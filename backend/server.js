require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const logger = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieparser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const { logEvents } = require('./middleware/logger')
const PORT = process.env.PORT || 3500

console.log(process.env.NODE_ENV)

connectDB()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieparser) //middleware

//body serverfile
app.use('/', express.static(path.join(__dirname, 'public'))) //listens  to the path

app.use('/', require('./routes/root'))

app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not found' })
  } else {
    res.type('txt').send('404 Not found')
  }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
  console.log('Connected to database')
})

mongoose.connection.on('error', (err) => {
  console.log(err)
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\ts${err.hostname}`,
    'mongoErrLog.log',
  )
})
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
