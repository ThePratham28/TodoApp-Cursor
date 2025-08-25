require('dotenv').config()
const mongoose = require('mongoose')
const app = require('./app')

const PORT = process.env.PORT || 4000
const mongoUri = process.env.MONGODB_URI
const mongoDbName = process.env.MONGODB_DB
mongoose
  .connect(mongoUri, mongoDbName ? { dbName: mongoDbName } : undefined)
  .then(() => {
    app.listen(PORT, () => console.log(`API listening on :${PORT}`))
  })
  .catch((err) => {
    console.error('Mongo connection error:', err)
    process.exit(1)
  })


