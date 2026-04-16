import { Router } from 'express'
import Joi from 'joi'
import rateLimit from 'express-rate-limit'
import { supabase } from '../config/supabase.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// Rate limit ONLY the public contact form POST
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many messages sent. Please try again later.' }
})

const messageSchema = Joi.object({
  sender_name: Joi.string().min(2).max(100).required(),
  sender_email: Joi.string().email().required(),
  message: Joi.string().min(10).max(5000).required()
})

// POST /api/messages — public (rate limited)
router.post('/', contactLimiter, async (req, res) => {
  const { error: vErr, value } = messageSchema.validate(req.body)
  if (vErr) return res.status(400).json({ error: vErr.details[0].message })

  const { data, error } = await supabase
    .from('messages')
    .insert([{ ...value, is_read: false }])
    .select()
    .single()

  if (error) return res.status(500).json({ error: 'Failed to save message' })
  res.status(201).json({ success: true, id: data.id })
})

// GET /api/messages — admin only
router.get('/', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: 'Failed to fetch messages' })
  res.json(data)
})

// GET /api/messages/unread-count — admin only
// IMPORTANT: must be defined BEFORE /:id routes or Express will treat
// the literal string "unread-count" as a dynamic :id parameter
router.get('/unread-count', authenticate, async (req, res) => {
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false)

  if (error) return res.status(500).json({ error: 'Failed to fetch count' })
  res.json({ count })
})

// PATCH /api/messages/mark-all-read — admin only
// IMPORTANT: must be defined BEFORE /:id/read or Express matches
// "mark-all-read" as :id = "mark-all-read" and runs the wrong handler
router.patch('/mark-all-read', authenticate, async (req, res) => {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('is_read', false)

  if (error) return res.status(500).json({ error: 'Failed to update messages' })
  res.json({ success: true })
})

// PATCH /api/messages/:id/read — admin only
router.patch('/:id/read', authenticate, async (req, res) => {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('id', req.params.id)

  if (error) return res.status(500).json({ error: 'Failed to update message' })
  res.json({ success: true })
})

// DELETE /api/messages/:id — admin only
router.delete('/:id', authenticate, async (req, res) => {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', req.params.id)

  if (error) return res.status(500).json({ error: 'Failed to delete message' })
  res.json({ success: true })
})

export default router
