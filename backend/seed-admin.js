/**
 * seed-admin.js
 * Creates or updates the admin account using credentials from .env
 * Usage: node seed-admin.js
 */

import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const { SUPABASE_URL, SUPABASE_SERVICE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env')
  process.exit(1)
}

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('❌ Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

console.log(`\n🔧 Seeding admin account...`)
console.log(`   Email:    ${ADMIN_EMAIL}`)
console.log(`   Password: ${'*'.repeat(ADMIN_PASSWORD.length)}\n`)

const hash = bcrypt.hashSync(ADMIN_PASSWORD, 10)

const { data, error } = await supabase
  .from('admins')
  .upsert({ email: ADMIN_EMAIL, password_hash: hash }, { onConflict: 'email' })
  .select()
  .single()

if (error) {
  console.error('❌ Failed to seed admin:', error.message)
  process.exit(1)
}

console.log('✅ Admin account ready!')
console.log(`   You can now log in at http://localhost:5174`)
console.log(`   Email:    ${ADMIN_EMAIL}`)
console.log(`   Password: (as set in .env)\n`)
