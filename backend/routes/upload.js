import { Router } from 'express'
import { supabase } from '../config/supabase.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// ── Shared multipart parser ────────────────────────────────────────────────
function parseMultipart(body, boundary) {
  const parts = []
  const boundaryBuf = Buffer.from('--' + boundary)
  let start = 0
  while (start < body.length) {
    const boundaryIdx = body.indexOf(boundaryBuf, start)
    if (boundaryIdx === -1) break
    const headerStart = boundaryIdx + boundaryBuf.length + 2
    const headerEnd = body.indexOf(Buffer.from('\r\n\r\n'), headerStart)
    if (headerEnd === -1) break
    const headers = body.slice(headerStart, headerEnd).toString()
    const dataStart = headerEnd + 4
    const nextBoundary = body.indexOf(boundaryBuf, dataStart)
    const dataEnd = nextBoundary === -1 ? body.length : nextBoundary - 2
    const nameMatch = headers.match(/name="([^"]+)"/)
    const filenameMatch = headers.match(/filename="([^"]+)"/)
    const typeMatch = headers.match(/Content-Type:\s*([^\r\n]+)/)
    if (nameMatch) {
      parts.push({ name: nameMatch[1], filename: filenameMatch?.[1], type: typeMatch?.[1]?.trim(), data: body.slice(dataStart, dataEnd) })
    }
    start = nextBoundary === -1 ? body.length : nextBoundary
  }
  return parts
}

// ── Helper: read multipart request ────────────────────────────────────────
function readMultipart(req, res, allowedExts) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => {
      const body = Buffer.concat(chunks)
      const contentType = req.headers['content-type'] || ''
      const boundaryMatch = contentType.match(/boundary=(.+)$/)
      if (!boundaryMatch) return reject(new Error('No boundary found'))
      const parts = parseMultipart(body, boundaryMatch[1])
      const filePart = parts.find(p => p.name === 'file')
      if (!filePart) return reject(new Error('No file field found'))
      const ext = filePart.filename?.split('.').pop()?.toLowerCase() || 'jpg'
      if (!allowedExts.includes(ext)) return reject(new Error('Invalid file type'))
      resolve({ filePart, ext })
    })
    req.on('error', reject)
  })
}

// ── POST /api/upload/avatar ────────────────────────────────────────────────
router.post('/avatar', authenticate, async (req, res) => {
  try {
    const { filePart, ext } = await readMultipart(req, res, ['jpg', 'jpeg', 'png', 'gif', 'webp'])
    const filename = `avatar_${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('portfolio-assets')
      .upload(filename, filePart.data, { contentType: filePart.type || `image/${ext}`, upsert: true })
    if (error) return res.status(500).json({ error: error.message })
    const { data: urlData } = supabase.storage.from('portfolio-assets').getPublicUrl(filename)
    res.json({ url: urlData.publicUrl })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ── POST /api/upload/resume ────────────────────────────────────────────────
router.post('/resume', authenticate, async (req, res) => {
  try {
    const { filePart } = await readMultipart(req, res, ['pdf'])
    const filename = `resume_${Date.now()}.pdf`
    const { error } = await supabase.storage.from('portfolio-assets')
      .upload(filename, filePart.data, { contentType: 'application/pdf', upsert: true })
    if (error) return res.status(500).json({ error: error.message })
    const { data: urlData } = supabase.storage.from('portfolio-assets').getPublicUrl(filename)
    res.json({ url: urlData.publicUrl })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ── POST /api/upload/project-image — logo stored as base64 in DB ──────────
router.post('/project-image', authenticate, async (req, res) => {
  try {
    const { filePart, ext } = await readMultipart(req, res, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'])
    const mimeType = filePart.type || `image/${ext}`
    const base64 = `data:${mimeType};base64,${filePart.data.toString('base64')}`
    res.json({ url: base64 })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ── POST /api/upload/screenshot — stored as base64 in DB ─────────────────
router.post('/screenshot', authenticate, async (req, res) => {
  try {
    const { filePart, ext } = await readMultipart(req, res, ['jpg', 'jpeg', 'png', 'gif', 'webp'])
    const mimeType = filePart.type || `image/${ext}`
    const base64 = `data:${mimeType};base64,${filePart.data.toString('base64')}`
    res.json({ url: base64 })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

export default router
