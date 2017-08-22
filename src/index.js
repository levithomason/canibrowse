const express = require('express')
const cors = require('cors')

const app = express()
const handlers = require('./handlers')

//
// Middleware
//
app.use(cors())

//
// Routes
//
app.get('/', handlers.getRoot)
app.get('/detect', handlers.getDetect)

//
// Error handler
//
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err)

  res.status(err.status || 400)
  res.json({ error: err.message })
})

//
// Start
//
const { PORT = 3000 } = process.env

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
