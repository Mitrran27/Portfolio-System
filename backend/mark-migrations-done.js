/**
 * mark-migrations-done.js
 * Run this ONCE to mark already-applied migrations as done.
 * Usage: node mark-migrations-done.js
 */
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

const migrations = [
  '20240101000000_initial_schema.js',
  '20240102000000_add_phone_to_portfolio.js',
]

console.log('\n🔧 Marking existing migrations as applied...\n')

for (const name of migrations) {
  const { error } = await supabase
    .from('_migrations')
    .upsert({ name }, { onConflict: 'name', ignoreDuplicates: true })

  if (error) console.log(`  ✗ ${name} — ${error.message}`)
  else console.log(`  ✓ ${name}`)
}

console.log('\n✅ Done! Now run: npm run migrate\n')
