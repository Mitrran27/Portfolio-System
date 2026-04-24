/**
 * Migration: Add project_types (TEXT[]) to projects
 * - Replaces single project_type with a multi-value array (project_types)
 * - Existing project_type values are migrated into the new array column
 * - project_type column is kept for backwards compatibility but no longer used by the app
 * - Adds 'ai' as a valid category value alongside: web-app, mobile-app, website, ui-ux
 */

export async function up(supabase, sql) {
  // Add the new array column
  await sql(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_types TEXT[] DEFAULT '{}'`)

  // Migrate existing single values into the new array column
  await sql(`
    UPDATE projects
    SET project_types = ARRAY[project_type]
    WHERE project_type IS NOT NULL AND project_type != '' AND (project_types IS NULL OR project_types = '{}')
  `)
}

export async function down(supabase, sql) {
  await sql(`ALTER TABLE projects DROP COLUMN IF EXISTS project_types`)
}