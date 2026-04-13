/**
 * Migration: initial_schema
 * Creates all portfolio tables via Supabase JS client (no dollar-quoting)
 */

export async function up(supabase, sql) {

  // ── Extensions
  await sql(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)

  // ── admins
  await sql(`
    CREATE TABLE IF NOT EXISTS admins (
      id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      email         TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `)

  // ── portfolio
  await sql(`
    CREATE TABLE IF NOT EXISTS portfolio (
      id                 UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name               TEXT NOT NULL DEFAULT 'Your Name',
      title              TEXT NOT NULL DEFAULT 'Full Stack Developer',
      bio                TEXT,
      avatar_url         TEXT,
      resume_url         TEXT,
      email              TEXT DEFAULT 'hello@example.com',
      location           TEXT DEFAULT 'Kuala Lumpur, Malaysia',
      available_for_work BOOLEAN DEFAULT TRUE,
      updated_at         TIMESTAMPTZ DEFAULT NOW()
    )
  `)

  // ── projects
  await sql(`
    CREATE TABLE IF NOT EXISTS projects (
      id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title       TEXT NOT NULL,
      description TEXT,
      tech_stack  TEXT[] DEFAULT '{}',
      live_url    TEXT,
      github_url  TEXT,
      image_url   TEXT,
      featured    BOOLEAN DEFAULT FALSE,
      sort_order  INT DEFAULT 0,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `)

  // ── skills
  await sql(`
    CREATE TABLE IF NOT EXISTS skills (
      id       UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name     TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Other',
      level    INT DEFAULT 80 CHECK (level >= 0 AND level <= 100),
      icon     TEXT
    )
  `)

  // ── socials
  await sql(`
    CREATE TABLE IF NOT EXISTS socials (
      id       UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      platform TEXT NOT NULL,
      url      TEXT NOT NULL,
      icon     TEXT
    )
  `)

  // ── messages
  await sql(`
    CREATE TABLE IF NOT EXISTS messages (
      id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      sender_name  TEXT NOT NULL,
      sender_email TEXT NOT NULL,
      message      TEXT NOT NULL,
      is_read      BOOLEAN DEFAULT FALSE,
      created_at   TIMESTAMPTZ DEFAULT NOW()
    )
  `)

  // ── Enable RLS
  await sql(`ALTER TABLE admins    ENABLE ROW LEVEL SECURITY`)
  await sql(`ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY`)
  await sql(`ALTER TABLE projects  ENABLE ROW LEVEL SECURITY`)
  await sql(`ALTER TABLE skills    ENABLE ROW LEVEL SECURITY`)
  await sql(`ALTER TABLE socials   ENABLE ROW LEVEL SECURITY`)
  await sql(`ALTER TABLE messages  ENABLE ROW LEVEL SECURITY`)

  // ── RLS Policies
  await sql(`CREATE POLICY "Public read portfolio"   ON portfolio FOR SELECT USING (true)`)
  await sql(`CREATE POLICY "Service write portfolio"  ON portfolio FOR ALL    USING (auth.role() = 'service_role')`)
  await sql(`CREATE POLICY "Public read projects"    ON projects  FOR SELECT USING (true)`)
  await sql(`CREATE POLICY "Service write projects"   ON projects  FOR ALL    USING (auth.role() = 'service_role')`)
  await sql(`CREATE POLICY "Public read skills"      ON skills    FOR SELECT USING (true)`)
  await sql(`CREATE POLICY "Service write skills"     ON skills    FOR ALL    USING (auth.role() = 'service_role')`)
  await sql(`CREATE POLICY "Public read socials"     ON socials   FOR SELECT USING (true)`)
  await sql(`CREATE POLICY "Service write socials"    ON socials   FOR ALL    USING (auth.role() = 'service_role')`)
  await sql(`CREATE POLICY "Public insert messages"  ON messages  FOR INSERT WITH CHECK (true)`)
  await sql(`CREATE POLICY "Service all messages"     ON messages  FOR ALL    USING (auth.role() = 'service_role')`)
  await sql(`CREATE POLICY "Service only admins"     ON admins    FOR ALL    USING (auth.role() = 'service_role')`)

  // ── Seed default admin (password: Admin@123456)
  await supabase.from('admins').upsert({
    email: 'admin@yourdomain.com',
    password_hash: '$2a$10$rOzJqnqrIBSGblWp0k6cJuL6oMq9.i4mPJLmzUPHJiJQNGAz0eG6e'
  }, { onConflict: 'email', ignoreDuplicates: true })

  // ── Seed default portfolio row
  await supabase.from('portfolio').upsert({
    name: 'Your Name',
    title: 'Full Stack Developer',
    bio: 'Passionate developer crafting digital experiences with clean code and creative design.',
    email: 'hello@example.com',
    location: 'Kuala Lumpur, Malaysia',
  }, { ignoreDuplicates: true })

  console.log('    → All tables, RLS policies, and seed data created')
}

export async function down(supabase, sql) {
  const tables = ['messages', 'socials', 'skills', 'projects', 'portfolio', 'admins']
  for (const t of tables) {
    await sql(`DROP TABLE IF EXISTS ${t} CASCADE`)
  }
  console.log('    → All tables dropped')
}
