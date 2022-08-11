const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const validateRegisterInput = require('../validations/registrationValidation')
const jwt = require('jsonwebtoken')
const requireAuth = require('../middlewares/permissions')

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
    const payload = { userId: savedUser._id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })
    res.cookie('access-token', token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    })
    const returnedUser = { ...savedUser._doc }
    delete returnedUser.password
    return res.json({ user: returnedUser })
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
})

// @Route   POST /api/auth/login
// @desc    login user and return token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // find user
    const user = await User.findOne({ email: new RegExp('^' + email + '$', 'i') })
    if (!user) {
      return res.status(400).json({ error: 'a problem with credentials' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(400).json({ error: 'a problem with credentials' })
    }
    const payload = { userId: user._id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })
    res.cookie('access-token', token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    })

    const returnedUser = { ...user._doc }
    delete returnedUser.password
    return res.json({ token, user: returnedUser })
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
})

// @Route   GET /api/auth/current
// @desc    Get current user
// @access  Private
router.get('/current', requireAuth, async (req, res) => {
  if (!req.user) {
    return res.status(401).send('Unauthorised')
  }
  return res.json(req.user)
})

// @Route   PUT /api/auth/logout
// @desc    Logout and clean cookie
// @access  Private
router.put('/logout', requireAuth, async (req, res) => {
  try {
    res.clearCookie('access-token')
    return res.json({ success: true })
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
})

module.exports = router
