/**
 * Migration: add_experiences_and_portfolio_fields
 * Adds experiences table + available_for + response_time to portfolio
 */

export async function up(supabase, sql) {
  // Add new fields to portfolio table
  await sql(`ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS available_for TEXT DEFAULT 'Freelance, Full-time, Consulting'`)
  await sql(`ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS response_time TEXT DEFAULT 'Within 24 hours'`)

  // Create experiences table
  await sql(`
    CREATE TABLE IF NOT EXISTS experiences (
      id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      role        TEXT NOT NULL,
      company     TEXT NOT NULL,
      period      TEXT NOT NULL,
      description TEXT,
      bullets     TEXT[] DEFAULT '{}',
      tech_stack  TEXT[] DEFAULT '{}',
      type        TEXT DEFAULT 'work',
      sort_order  INT DEFAULT 0,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `)

  // RLS for experiences
  await sql(`ALTER TABLE experiences ENABLE ROW LEVEL SECURITY`)
  await sql(`CREATE POLICY "Public read experiences" ON experiences FOR SELECT USING (true)`)
  await sql(`CREATE POLICY "Service write experiences" ON experiences FOR ALL USING (auth.role() = 'service_role')`)

  // Seed sample experiences
  await supabase.from('experiences').insert([
    {
      role: 'Senior Full Stack Developer',
      company: 'TechNova Solutions',
      period: '2023 - Present',
      description: 'Led development of microservices architecture.',
      bullets: [
        'Led development of microservices architecture serving 1M+ users',
        'Implemented CI/CD pipelines reducing deployment time by 60%',
        'Mentored junior developers and conducted code reviews'
      ],
      tech_stack: ['Vue.js', 'Node.js', 'PostgreSQL', 'Docker'],
      type: 'work',
      sort_order: 1
    },
    {
      role: 'Frontend Developer',
      company: 'Digital Dynamics Inc.',
      period: '2021 - 2023',
      description: 'Built responsive web applications.',
      bullets: [
        'Built responsive web applications using React and TypeScript',
        'Improved application performance by 40% through optimization',
        'Collaborated with UX team to implement design systems'
      ],
      tech_stack: ['React', 'TypeScript', 'Tailwind CSS'],
      type: 'work',
      sort_order: 2
    }
  ])

  console.log('    → experiences table + portfolio fields added')
}

export async function down(supabase, sql) {
  await sql(`DROP TABLE IF EXISTS experiences CASCADE`)
  await sql(`ALTER TABLE portfolio DROP COLUMN IF EXISTS available_for`)
  await sql(`ALTER TABLE portfolio DROP COLUMN IF EXISTS response_time`)
  console.log('    → experiences table + portfolio fields removed')
}
