/**
 * Migration: initial_schema
 * Created: initial setup — creates all portfolio tables
 */

export async function up(supabase, sql) {
  // UUID extension
  await sql(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)

  // ── admins ──────────────────────────────────────────────────────────────
  await sql(`
    CREATE TABLE IF NOT EXISTS admins (
      id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      email         TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `)

  // Default admin: admin@yourdomain.com / Admin@123456
  await supabase.from('admins').upsert({
    email: 'admin@yourdomain.com',
    password_hash: '$2a$10$rOzJqnqrIBSGblWp0k6cJuL6oMq9.i4mPJLmzUPHJiJQNGAz0eG6e'
  }, { onConflict: 'email', ignoreDuplicates: true })

  // ── portfolio ────────────────────────────────────────────────────────────
  await sql(`
    CREATE TABLE IF NOT EXISTS portfolio (
      id                UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name              TEXT NOT NULL DEFAULT 'Your Name',
      title             TEXT NOT NULL DEFAULT 'Full Stack Developer',
      bio               TEXT,
      avatar_url        TEXT,
      resume_url        TEXT,
      email             TEXT DEFAULT 'hello@example.com',
      location          TEXT DEFAULT 'Kuala Lumpur, Malaysia',
      available_for_work BOOLEAN DEFAULT TRUE,
      updated_at        TIMESTAMPTZ DEFAULT NOW()
    )
  `)

  await supabase.from('portfolio').upsert({
    name: 'Your Name',
    title: 'Full Stack Developer',
    bio: 'Passionate developer crafting digital experiences with clean code and creative design.',
    email: 'hello@example.com',
    location: 'Kuala Lumpur, Malaysia',
  }, { onConflict: 'id', ignoreDuplicates: true })

  // ── projects ─────────────────────────────────────────────────────────────
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

  // ── skills ───────────────────────────────────────────────────────────────
  await sql(`
    CREATE TABLE IF NOT EXISTS skills (
      id       UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name     TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Other',
      level    INT DEFAULT 80 CHECK (level >= 0 AND level <= 100),
      icon     TEXT
    )
  `)

  // ── socials ──────────────────────────────────────────────────────────────
  await sql(`
    CREATE TABLE IF NOT EXISTS socials (
      id       UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      platform TEXT NOT NULL,
      url      TEXT NOT NULL,
      icon     TEXT
    )
  `)

  // ── messages ─────────────────────────────────────────────────────────────
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

  // ── RLS ──────────────────────────────────────────────────────────────────
  const tables = ['messages', 'portfolio', 'projects', 'skills', 'socials', 'admins']
  for (const t of tables) {
    await sql(`ALTER TABLE ${t} ENABLE ROW LEVEL SECURITY`)
  }

  // Public read tables
  for (const t of ['portfolio', 'projects', 'skills', 'socials']) {
    await sql(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = '${t}' AND policyname = 'Public read ${t}'
        ) THEN
          CREATE POLICY "Public read ${t}" ON ${t} FOR SELECT USING (TRUE);
        END IF;
      END $$
    `)
    await sql(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = '${t}' AND policyname = 'Service write ${t}'
        ) THEN
          CREATE POLICY "Service write ${t}" ON ${t} FOR ALL USING (auth.role() = 'service_role');
        END IF;
      END $$
    `)
  }

  // Messages: public insert only
  await sql(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Public insert messages'
      ) THEN
        CREATE POLICY "Public insert messages" ON messages FOR INSERT WITH CHECK (TRUE);
      END IF;
    END $$
  `)
  await sql(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Service all messages'
      ) THEN
        CREATE POLICY "Service all messages" ON messages FOR ALL USING (auth.role() = 'service_role');
      END IF;
    END $$
  `)

  console.log('    → All tables created with RLS')
}

export async function down(supabase, sql) {
  const tables = ['messages', 'socials', 'skills', 'projects', 'portfolio', 'admins', '_migrations']
  for (const t of tables) {
    await sql(`DROP TABLE IF EXISTS ${t} CASCADE`)
  }
  console.log('    → All tables dropped')
}
