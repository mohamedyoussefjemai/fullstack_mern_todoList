const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const validateRegisterInput = require('../validations/registrationValidation')

// @Route   GET /api/auth/test
// @desc    Test auth api
// @access  Public
router.get('/test', (req, res) => {
  res.send('auth route working')
})

// @Route   POST /api/auth/register
// @desc    Create a new User
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { errors, isValid } = validateRegisterInput(req.body)
    if (!isValid) {
      res.status(400).json(errors)
    }
    const { email, password, name } = req.body

    // check email exist
    const existingEmail = await User.findOne({ email: new RegExp('^' + email + '$', 'i') })
    if (existingEmail) {
      return res.status(500).json({ error: 'email exist' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = new User({ email, password: hashedPassword, name })
    const savedUser = await newUser.save()
    return res.json({ user: savedUser })
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
})

module.exports = router
