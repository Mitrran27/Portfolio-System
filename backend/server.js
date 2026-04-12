import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.js'
import messagesRoutes from './routes/messages.js'
import portfolioRoutes from './routes/portfolio.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Security
app.use(helmet())
app.use(cors({
  origin: [
    'http://localhost:5173',  // portfolio dev
    'http://localhost:5174',  // admin dev
    process.env.PORTFOLIO_URL,
    process.env.ADMIN_URL
  ].filter(Boolean),
  credentials: true
}))

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5,
  message: { error: 'Too many messages sent. Please try again later.' }
})

// Middleware
app.use(morgan('dev'))
app.use(express.json({ limit: '10kb' }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/messages', contactLimiter, messagesRoutes)
app.use('/api/portfolio', portfolioRoutes)

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date().toISOString() }))

// 404
app.use('*', (_, res) => res.status(404).json({ error: 'Not found' }))

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
