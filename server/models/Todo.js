const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
}, { timestamps: true })

module.exports = mongoose.model('Todo', todoSchema)


