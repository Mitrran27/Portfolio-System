import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.js'
import messagesRoutes from './routes/messages.js'
import portfolioRoutes from './routes/portfolio.js'
import uploadRoutes from './routes/upload.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://mitrran-portfolio.vercel.app',
    'https://mitrran-portfolio-admin.vercel.app',
    process.env.PORTFOLIO_URL,
    process.env.ADMIN_URL
  ].filter(Boolean),
  credentials: true
}))

app.use(morgan('dev'))

// Increased limit to handle base64-encoded images stored in DB.
// A 2MB image becomes ~2.7MB as base64, and a project may have
// multiple screenshots — 50mb is a safe ceiling.
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/messages', messagesRoutes)
app.use('/api/portfolio', portfolioRoutes)
app.use('/api/upload', uploadRoutes) // raw body — no json middleware applied above

app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date().toISOString() }))
app.use('*', (_, res) => res.status(404).json({ error: 'Not found' }))
app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
