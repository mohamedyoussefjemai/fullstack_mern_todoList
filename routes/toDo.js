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

// @Route   PUT /api/todos/:id/complete
// @desc    mark a to do complete
// @access  Private
router.put('/:id/complete', requireAuth, async (req, res) => {
  try {
    const toDo = await ToDo.findOne({ user: req.user._id, _id: req.params.id })
    if (!toDo) {
      return res.status(404).json('Could not find toDo')
    }
    if (toDo.complete) {
      return res.status(400).json('toDo already complete')
    }

    const updateToDo = await ToDo.findByIdAndUpdate(
      { user: req.user._id, _id: req.params.id },
      { complete: true, completeAt: new Date() },
      { new: true }
    )
    return res.json(updateToDo)
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
})

// @Route   PUT /api/todos/:id/uncomplete
// @desc    mark a to do uncomplete
// @access  Private
router.put('/:id/uncomplete', requireAuth, async (req, res) => {
  try {
    const toDo = await ToDo.findOne({ user: req.user._id, _id: req.params.id })
    if (!toDo) {
      return res.status(404).json('Could not find toDo')
    }

    const updateToDo = await ToDo.findByIdAndUpdate(
      { user: req.user._id, _id: req.params.id },
      { complete: false, completeAt: null },
      { new: true }
    )
    return res.json(updateToDo)
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
})

// @Route   PUT /api/todos/:id
// @desc    update content a to do
// @access  Private
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const toDo = await ToDo.findOne({ user: req.user._id, _id: req.params.id })
    if (!toDo) {
      return res.status(404).json('Could not find toDo')
    }
    const { isValid, errors } = validateToDoInput(req.body)
    if (!isValid) {
      return res.status(400).json(errors)
    }
    const { content } = req.body
    const updateToDo = await ToDo.findByIdAndUpdate(
      { user: req.user._id, _id: req.params.id },
      { content },
      { new: true }
    )
    return res.json(updateToDo)
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
})
// @Route   DELETE /api/todos/:id
// @desc    delete a toDo
// @access  Private
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const toDo = await ToDo.findOne({ user: req.user._id, _id: req.params.id })
    if (!toDo) {
      return res.status(404).json('Could not find toDo')
    }
    const { isValid, errors } = validateToDoInput(req.body)
    if (!isValid) {
      return res.status(400).json(errors)
    }
    await ToDo.findByIdAndRemove(
      { user: req.user._id, _id: req.params.id }
    )
    return res.json({ success: true })
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
})

module.exports = router
