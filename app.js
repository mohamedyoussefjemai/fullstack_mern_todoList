require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

// import routes
const authRoute = require('./routes/auth') 

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api', (req, res) => {
  res.send('Full stack JS')
})

app.use('/api/auth', authRoute)

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('mongoose connected')
  app.listen(process.env.PORT, () => {
    console.log(`server run in port ${process.env.PORT}`)
  })
}).catch((error) => {
  console.log(error)
})
