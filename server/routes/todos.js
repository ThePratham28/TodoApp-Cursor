const express = require('express')
const Todo = require('../models/Todo')

const router = express.Router()

router.get('/', async (req, res) => {
  const todos = await Todo.find({ userId: req.userId }).sort({ createdAt: -1 })
  res.json(todos)
})

router.post('/', async (req, res) => {
  try {
    const title = (req && req.body && typeof req.body.title === 'string') ? req.body.title.trim() : ''
    if (!title) return res.status(400).json({ error: 'Title required' })
    const todo = await Todo.create({ title, userId: req.userId })
    res.status(201).json(todo)
  } catch (e) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body },
      { new: true, runValidators: true }
    )
    if (!todo) return res.status(404).json({ error: 'Not found' })
    res.json(todo)
  } catch (e) {
    res.status(400).json({ error: 'Invalid update' })
  }
})

router.delete('/:id', async (req, res) => {
  const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId })
  if (!todo) return res.status(404).json({ error: 'Not found' })
  res.status(204).end()
})

module.exports = router


