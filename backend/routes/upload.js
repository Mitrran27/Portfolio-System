import { Router } from 'express'
import { supabase } from '../config/supabase.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// POST /api/upload/avatar — multipart, admin only
// Expects: form-data with field "file"
router.post('/avatar', authenticate, async (req, res) => {
  try {
    const chunks = []
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', async () => {
      const body = Buffer.concat(chunks)

      // Parse multipart manually using boundary
      const contentType = req.headers['content-type'] || ''
      const boundaryMatch = contentType.match(/boundary=(.+)$/)
      if (!boundaryMatch) return res.status(400).json({ error: 'No boundary found' })

      const boundary = boundaryMatch[1]
      const parts = parseMultipart(body, boundary)
      const filePart = parts.find(p => p.name === 'file')
      if (!filePart) return res.status(400).json({ error: 'No file field found' })

      const ext = filePart.filename?.split('.').pop()?.toLowerCase() || 'jpg'
      const allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp']
      if (!allowed.includes(ext)) return res.status(400).json({ error: 'Invalid file type' })

      const filename = `avatar_${Date.now()}.${ext}`

      const { data, error } = await supabase.storage
        .from('portfolio-assets')
        .upload(filename, filePart.data, {
          contentType: filePart.type || `image/${ext}`,
          upsert: true
        })

      if (error) return res.status(500).json({ error: error.message })

      const { data: urlData } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filename)

      res.json({ url: urlData.publicUrl })
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/upload/resume — admin only
router.post('/resume', authenticate, async (req, res) => {
  try {
    const chunks = []
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', async () => {
      const body = Buffer.concat(chunks)
      const contentType = req.headers['content-type'] || ''
      const boundaryMatch = contentType.match(/boundary=(.+)$/)
      if (!boundaryMatch) return res.status(400).json({ error: 'No boundary found' })

      const boundary = boundaryMatch[1]
      const parts = parseMultipart(body, boundary)
      const filePart = parts.find(p => p.name === 'file')
      if (!filePart) return res.status(400).json({ error: 'No file field found' })

      const ext = filePart.filename?.split('.').pop()?.toLowerCase()
      if (ext !== 'pdf') return res.status(400).json({ error: 'Only PDF files allowed' })

      const filename = `resume_${Date.now()}.pdf`

      const { error } = await supabase.storage
        .from('portfolio-assets')
        .upload(filename, filePart.data, {
          contentType: 'application/pdf',
          upsert: true
        })

      if (error) return res.status(500).json({ error: error.message })

      const { data: urlData } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filename)

      res.json({ url: urlData.publicUrl })
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Simple multipart parser (no external deps)
function parseMultipart(body, boundary) {
  const parts = []
  const boundaryBuf = Buffer.from('--' + boundary)
  let start = 0

  while (start < body.length) {
    const boundaryIdx = body.indexOf(boundaryBuf, start)
    if (boundaryIdx === -1) break
    const headerStart = boundaryIdx + boundaryBuf.length + 2 // skip \r\n
    const headerEnd = body.indexOf(Buffer.from('\r\n\r\n'), headerStart)
    if (headerEnd === -1) break

    const headers = body.slice(headerStart, headerEnd).toString()
    const dataStart = headerEnd + 4 // skip \r\n\r\n
    const nextBoundary = body.indexOf(boundaryBuf, dataStart)
    const dataEnd = nextBoundary === -1 ? body.length : nextBoundary - 2 // trim \r\n

    const nameMatch = headers.match(/name="([^"]+)"/)
    const filenameMatch = headers.match(/filename="([^"]+)"/)
    const typeMatch = headers.match(/Content-Type:\s*([^\r\n]+)/)

    if (nameMatch) {
      parts.push({
        name: nameMatch[1],
        filename: filenameMatch?.[1],
        type: typeMatch?.[1]?.trim(),
        data: body.slice(dataStart, dataEnd)
      })
    }
    start = nextBoundary === -1 ? body.length : nextBoundary
  }
  return parts
}

export default router
