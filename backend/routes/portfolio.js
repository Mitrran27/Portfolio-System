import { Router } from 'express'
import { supabase } from '../config/supabase.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// GET /api/portfolio — public
router.get('/', async (req, res) => {
  let { data, error } = await supabase.from('portfolio').select('*').single()

  if (error || !data) {
    const { data: seeded, error: seedErr } = await supabase
      .from('portfolio')
      .insert({
        name: 'Your Name', title: 'Full Stack Developer',
        bio: 'Passionate developer crafting digital experiences.',
        email: 'hello@example.com', location: 'Kuala Lumpur, Malaysia',
        available_for_work: true, available_for: 'Freelance, Full-time, Consulting',
        response_time: 'Within 24 hours'
      })
      .select().single()
    if (seedErr) return res.status(500).json({ error: 'Failed to fetch portfolio' })
    return res.json(seeded)
  }
  res.json(data)
})

// PUT /api/portfolio — admin only
router.put('/', authenticate, async (req, res) => {
  const { data: existing } = await supabase.from('portfolio').select('id').single()
  let result
  if (existing) {
    result = await supabase.from('portfolio')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', existing.id).select().single()
  } else {
    result = await supabase.from('portfolio').insert([req.body]).select().single()
  }
  if (result.error) return res.status(500).json({ error: 'Failed to update portfolio' })
  res.json(result.data)
})

// --- Projects ---
router.get('/projects', async (req, res) => {
  const { data, error } = await supabase.from('projects').select('*').order('sort_order', { ascending: true })
  if (error) return res.status(500).json({ error: 'Failed to fetch projects' })
  res.json(data)
})
router.post('/projects', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('projects').insert([req.body]).select().single()
  if (error) return res.status(500).json({ error: 'Failed to create project' })
  res.status(201).json(data)
})
router.put('/projects/:id', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('projects').update(req.body).eq('id', req.params.id).select().single()
  if (error) return res.status(500).json({ error: 'Failed to update project' })
  res.json(data)
})
router.delete('/projects/:id', authenticate, async (req, res) => {
  const { error } = await supabase.from('projects').delete().eq('id', req.params.id)
  if (error) return res.status(500).json({ error: 'Failed to delete project' })
  res.json({ success: true })
})

// --- Skills ---
router.get('/skills', async (req, res) => {
  const { data, error } = await supabase.from('skills').select('*').order('category', { ascending: true })
  if (error) return res.status(500).json({ error: 'Failed to fetch skills' })
  res.json(data)
})
router.post('/skills', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('skills').insert([req.body]).select().single()
  if (error) return res.status(500).json({ error: 'Failed to create skill' })
  res.status(201).json(data)
})
router.put('/skills/:id', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('skills').update(req.body).eq('id', req.params.id).select().single()
  if (error) return res.status(500).json({ error: 'Failed to update skill' })
  res.json(data)
})
router.delete('/skills/:id', authenticate, async (req, res) => {
  const { error } = await supabase.from('skills').delete().eq('id', req.params.id)
  if (error) return res.status(500).json({ error: 'Failed to delete skill' })
  res.json({ success: true })
})

// --- Social Links ---
router.get('/socials', async (req, res) => {
  const { data, error } = await supabase.from('socials').select('*')
  if (error) return res.status(500).json({ error: 'Failed to fetch socials' })
  res.json(data)
})
router.put('/socials', authenticate, async (req, res) => {
  const { error } = await supabase.from('socials').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (error) return res.status(500).json({ error: 'Failed to reset socials' })
  const { data, error: insertErr } = await supabase.from('socials').insert(req.body).select()
  if (insertErr) return res.status(500).json({ error: 'Failed to update socials' })
  res.json(data)
})

// --- Experiences ---
router.get('/experiences', async (req, res) => {
  const { data, error } = await supabase.from('experiences').select('*').order('sort_order', { ascending: true })
  if (error) return res.status(500).json({ error: 'Failed to fetch experiences' })
  res.json(data)
})
router.post('/experiences', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('experiences').insert([req.body]).select().single()
  if (error) return res.status(500).json({ error: 'Failed to create experience' })
  res.status(201).json(data)
})
router.put('/experiences/:id', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('experiences').update(req.body).eq('id', req.params.id).select().single()
  if (error) return res.status(500).json({ error: 'Failed to update experience' })
  res.json(data)
})
router.delete('/experiences/:id', authenticate, async (req, res) => {
  const { error } = await supabase.from('experiences').delete().eq('id', req.params.id)
  if (error) return res.status(500).json({ error: 'Failed to delete experience' })
  res.json({ success: true })
})

// --- Education ---
router.get('/education', async (req, res) => {
  const { data, error } = await supabase.from('education').select('*').order('sort_order', { ascending: true })
  if (error) return res.status(500).json({ error: 'Failed to fetch education' })
  res.json(data)
})
router.post('/education', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('education').insert([req.body]).select().single()
  if (error) return res.status(500).json({ error: 'Failed to create education' })
  res.status(201).json(data)
})
router.put('/education/:id', authenticate, async (req, res) => {
  const { data, error } = await supabase.from('education').update(req.body).eq('id', req.params.id).select().single()
  if (error) return res.status(500).json({ error: 'Failed to update education' })
  res.json(data)
})
router.delete('/education/:id', authenticate, async (req, res) => {
  const { error } = await supabase.from('education').delete().eq('id', req.params.id)
  if (error) return res.status(500).json({ error: 'Failed to delete education' })
  res.json({ success: true })
})

export default router
