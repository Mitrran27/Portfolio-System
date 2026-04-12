/**
 * Migration: add_phone_to_portfolio
 * Example of how to add a new column in a future migration
 */

export async function up(supabase, sql) {
  await sql(`
    ALTER TABLE portfolio
    ADD COLUMN IF NOT EXISTS phone TEXT
  `)
  console.log('    → Added phone column to portfolio')
}

export async function down(supabase, sql) {
  await sql(`
    ALTER TABLE portfolio
    DROP COLUMN IF EXISTS phone
  `)
  console.log('    → Removed phone column from portfolio')
}
