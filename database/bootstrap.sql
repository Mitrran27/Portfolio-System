-- ============================================================
-- BOOTSTRAP — paste this ONCE in your Supabase SQL Editor
-- This creates the exec_sql helper and _migrations table
-- After this, never touch the SQL editor again — use migrate.js
-- ============================================================

-- 1. Function to allow the migration runner to execute raw SQL
CREATE OR REPLACE FUNCTION exec_sql(sql TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- 2. Migration tracking table
CREATE TABLE IF NOT EXISTS _migrations (
  id     SERIAL PRIMARY KEY,
  name   TEXT UNIQUE NOT NULL,
  run_at TIMESTAMPTZ DEFAULT NOW()
);

-- Done! Now run: node migrate.js up
