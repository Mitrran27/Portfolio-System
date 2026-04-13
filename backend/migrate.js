/**
 * DB Migration Runner
 * Usage:
 *   node migrate.js up        → run all pending migrations
 *   node migrate.js down      → rollback last migration
 *   node migrate.js status    → show migration status
 *   node migrate.js make name → create a new migration file
 */

import { createClient } from '@supabase/supabase-js'
import { readdir, readFile, writeFile } from 'fs/promises'
import { existsSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __dirname = dirname(fileURLToPath(import.meta.url))
const MIGRATIONS_DIR = resolve(__dirname, 'migrations')

// Ensure migrations dir exists
if (!existsSync(MIGRATIONS_DIR)) mkdirSync(MIGRATIONS_DIR, { recursive: true })

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// ─── Bootstrap migrations table ─────────────────────────────────────────────
async function ensureMigrationsTable() {
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS _migrations (
        id        SERIAL PRIMARY KEY,
        name      TEXT UNIQUE NOT NULL,
        run_at    TIMESTAMPTZ DEFAULT NOW()
      );
    `
  })

  // If rpc doesn't exist, try direct query via REST (supabase doesn't expose DDL easily)
  // So we use a workaround: try to select from the table; if error, instruct user
  if (error) {
    // Try selecting — if table already exists this will work
    const { error: selectErr } = await supabase.from('_migrations').select('id').limit(1)
    if (selectErr) {
      console.error('\n⚠️  Could not create _migrations table automatically.')
      console.error('Please run this SQL once in your Supabase SQL editor:\n')
      console.error(`  CREATE TABLE IF NOT EXISTS _migrations (
    id     SERIAL PRIMARY KEY,
    name   TEXT UNIQUE NOT NULL,
    run_at TIMESTAMPTZ DEFAULT NOW()
  );\n`)
      process.exit(1)
    }
  }
}

// ─── Get applied migrations ──────────────────────────────────────────────────
async function getApplied() {
  const { data, error } = await supabase
    .from('_migrations')
    .select('name')
    .order('id', { ascending: true })
  if (error) throw error
  return new Set(data.map(r => r.name))
}

// ─── Get all migration files ─────────────────────────────────────────────────
async function getMigrationFiles() {
  const files = await readdir(MIGRATIONS_DIR)
  return files
    .filter(f => f.endsWith('.js') && !f.startsWith('_'))
    .sort()
}

// ─── Run SQL via Supabase ─────────────────────────────────────────────────────
async function runSQL(sql) {
  // Supabase REST doesn't allow raw DDL — we use the rpc approach
  // Users must have the exec_sql function created (see bootstrap below)
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(Boolean)

  for (const stmt of statements) {
    const { error } = await supabase.rpc('exec_sql', { sql: stmt + ';' })
    if (error) throw new Error(`SQL error: ${error.message}\nStatement: ${stmt}`)
  }
}

// ─── UP ───────────────────────────────────────────────────────────────────────
async function up() {
  await ensureMigrationsTable()
  const applied = await getApplied()
  const files = await getMigrationFiles()
  const pending = files.filter(f => !applied.has(f))

  if (pending.length === 0) {
    console.log('✅ All migrations already applied. Nothing to run.')
    return
  }

  console.log(`\n🚀 Running ${pending.length} migration(s)...\n`)

  for (const file of pending) {
    process.stdout.write(`  ▸ ${file} ... `)
    try {
      const migration = await import(pathToFileURL(resolve(MIGRATIONS_DIR, file)).href)
      await migration.up(supabase, runSQL)
      await supabase.from('_migrations').insert({ name: file })
      console.log('✓')
    } catch (err) {
      console.log('✗')
      console.error(`\n❌ Failed on ${file}:\n   ${err.message}\n`)
      process.exit(1)
    }
  }

  console.log('\n✅ All migrations complete.\n')
}

// ─── DOWN ─────────────────────────────────────────────────────────────────────
async function down() {
  await ensureMigrationsTable()
  const { data } = await supabase
    .from('_migrations')
    .select('name')
    .order('id', { ascending: false })
    .limit(1)
    .single()

  if (!data) {
    console.log('Nothing to rollback.')
    return
  }

  const file = data.name
  process.stdout.write(`\n  ◂ Rolling back ${file} ... `)
  try {
    const migration = await import(pathToFileURL(resolve(MIGRATIONS_DIR, file)).href)
    if (!migration.down) throw new Error('No down() export found in this migration.')
    await migration.down(supabase, runSQL)
    await supabase.from('_migrations').delete().eq('name', file)
    console.log('✓\n')
  } catch (err) {
    console.log('✗')
    console.error(`\n❌ Rollback failed: ${err.message}\n`)
    process.exit(1)
  }
}

// ─── STATUS ───────────────────────────────────────────────────────────────────
async function status() {
  await ensureMigrationsTable()
  const applied = await getApplied()
  const files = await getMigrationFiles()

  console.log('\n📋 Migration Status:\n')
  console.log('  Status    Name')
  console.log('  ────────  ' + '─'.repeat(50))

  if (files.length === 0) {
    console.log('  (no migration files found)\n')
    return
  }

  for (const f of files) {
    const state = applied.has(f) ? '✅ applied' : '⏳ pending'
    console.log(`  ${state}  ${f}`)
  }

  const pendingCount = files.filter(f => !applied.has(f)).length
  console.log(`\n  ${files.length} total · ${applied.size} applied · ${pendingCount} pending\n`)
}

// ─── MAKE ─────────────────────────────────────────────────────────────────────
async function make(name) {
  if (!name) {
    console.error('Usage: node migrate.js make <migration_name>')
    process.exit(1)
  }

  const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14)
  const slug = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
  const filename = `${timestamp}_${slug}.js`
  const filepath = resolve(MIGRATIONS_DIR, filename)

  const template = `/**
 * Migration: ${slug}
 * Created: ${new Date().toISOString()}
 */

/**
 * up() — apply the migration
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {Function} sql  — helper to run raw SQL strings
 */
export async function up(supabase, sql) {
  // Example: add a column
  // await sql(\`ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS phone TEXT;\`)

  // Example: create a table
  // await sql(\`
  //   CREATE TABLE IF NOT EXISTS example (
  //     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  //     name TEXT NOT NULL,
  //     created_at TIMESTAMPTZ DEFAULT NOW()
  //   );
  // \`)

  // Example: insert seed data
  // await supabase.from('example').insert({ name: 'seed' })

  throw new Error('up() not implemented yet for migration: ${slug}')
}

/**
 * down() — rollback the migration
 */
export async function down(supabase, sql) {
  // Reverse of up()
  // await sql(\`ALTER TABLE portfolio DROP COLUMN IF EXISTS phone;\`)

  throw new Error('down() not implemented yet for migration: ${slug}')
}
`

  await writeFile(filepath, template)
  console.log(`\n✨ Created migration: migrations/${filename}\n`)
}

// ─── Entrypoint ───────────────────────────────────────────────────────────────
const command = process.argv[2]
const arg = process.argv[3]

switch (command) {
  case 'up':     await up();        break
  case 'down':   await down();      break
  case 'status': await status();    break
  case 'make':   await make(arg);   break
  default:
    console.log(`
Usage:
  node migrate.js up           Run all pending migrations
  node migrate.js down         Rollback the last migration
  node migrate.js status       Show migration status
  node migrate.js make <name>  Create a new migration file
`)
}
