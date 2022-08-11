const express = require('express')
const router = express.Router()
const ToDo = require('../models/ToDo')
const requireAuth = require('../middlewares/permissions')
const validateToDoInput = require('../validations/todoValidation')

// @Route   GET /api/todos/test
// @desc    Test todos api
// @access  Public
router.get('/test', (req, res) => {
  res.send('test todos route working')
})

// @Route   POST /api/todos/new
// @desc    Create a to do
// @access  Private
router.post('/new', requireAuth, async (req, res) => {
  try {
    const { isValid, errors } = validateToDoInput(req.body)
    if (!isValid) {
      return res.status(400).json(errors)
    }
    const { content } = req.body
    const newToDo = new ToDo({
      user: req.user._id,
      content
    })
    await newToDo.save()
    return res.json(newToDo)
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
})

// @Route   GET /api/todos/current
// @desc    current users to do
// @access  Private
router.get('/current', requireAuth, async (req, res) => {
  try {
    const completeToDos = await ToDo.find({ user: req.user._id, complete: true }).sort({ completedAt: -1 })
    const incompleteToDos = await ToDo.find({ user: req.user._id, complete: false }).sort({ createdAt: -1 })
    return res.json({ completeToDos, incompleteToDos })
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
})

module.exports = router
