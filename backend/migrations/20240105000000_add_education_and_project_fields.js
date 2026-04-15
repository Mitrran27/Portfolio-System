/**
 * Migration: add_education_and_project_fields
 * - Adds `project_type` column to projects (mobile-app, web-app, website)
 * - Adds `screenshots` TEXT[] column to projects
 * - Creates education table
 */

export async function up(supabase, sql) {
  // Add project_type to projects
  await sql(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_type TEXT DEFAULT 'web-app'`)

  // Add screenshots array to projects
  await sql(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS screenshots TEXT[] DEFAULT '{}'`)

  // Create education table
  await sql(`
    CREATE TABLE IF NOT EXISTS education (
      id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      degree      TEXT NOT NULL,
      institution TEXT NOT NULL,
      period      TEXT NOT NULL,
      description TEXT,
      bullets     TEXT[] DEFAULT '{}',
      grade       TEXT,
      sort_order  INT DEFAULT 0,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `)

  await sql(`ALTER TABLE education ENABLE ROW LEVEL SECURITY`)
  await sql(`CREATE POLICY "Public read education" ON education FOR SELECT USING (true)`)
  await sql(`CREATE POLICY "Service write education" ON education FOR ALL USING (auth.role() = 'service_role')`)
}

export async function down(supabase, sql) {
  await sql(`ALTER TABLE projects DROP COLUMN IF EXISTS project_type`)
  await sql(`ALTER TABLE projects DROP COLUMN IF EXISTS screenshots`)
  await sql(`DROP TABLE IF EXISTS education`)
}
