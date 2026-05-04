/**
 * Migration: Add dev_status to projects
 * - Adds `dev_status` TEXT column (nullable)
 * - Valid values: null (normal/live), 'in-progress', 'in-development', 'under-construction', 'under-testing'
 * - When set, portfolio hides the image and shows a styled status card instead
 */

export async function up(supabase, sql) {
  await sql(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS dev_status TEXT DEFAULT NULL`)
}

export async function down(supabase, sql) {
  await sql(`ALTER TABLE projects DROP COLUMN IF EXISTS dev_status`)
}
