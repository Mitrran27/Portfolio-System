import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.js'
import messagesRoutes from './routes/messages.js'
import portfolioRoutes from './routes/portfolio.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet())
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.PORTFOLIO_URL,
    process.env.ADMIN_URL
  ].filter(Boolean),
  credentials: true
}))

app.use(morgan('dev'))
app.use(express.json({ limit: '10kb' }))

// Rate limiter is now inside messages.js on POST only
app.use('/api/auth', authRoutes)
app.use('/api/messages', messagesRoutes)
app.use('/api/portfolio', portfolioRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date().toISOString() }))
app.use('*', (_, res) => res.status(404).json({ error: 'Not found' }))
app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
