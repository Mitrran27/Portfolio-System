import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabase } from '../config/supabase.js'

const router = Router()

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' })

  const { data: admin, error } = await supabase
    .from('admins')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !admin)
    return res.status(401).json({ error: 'Invalid credentials' })

  const valid = await bcrypt.compare(password, admin.password_hash)
  if (!valid)
    return res.status(401).json({ error: 'Invalid credentials' })

  const token = jwt.sign(
    { id: admin.id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.json({ token, admin: { id: admin.id, email: admin.email } })
})

// POST /api/auth/verify
router.post('/verify', async (req, res) => {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ valid: false })
  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET)
    res.json({ valid: true, admin: decoded })
  } catch {
    res.status(401).json({ valid: false })
  }
})

export default router
