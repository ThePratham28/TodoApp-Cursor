const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const todoRoutes = require('./routes/todos')
const { authMiddleware } = require('./middleware/auth')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/todos', authMiddleware, todoRoutes)

// Basic health
app.get('/api/health', (req, res) => res.json({ ok: true }))

module.exports = app


