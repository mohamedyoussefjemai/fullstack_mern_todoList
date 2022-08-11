const { Schema, model } = require('mongoose')

const ToDoSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      type: String,
      required: true
    },
    complete: {
      type: Boolean,
      default: false
    },
    completeAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)

const ToDo = model('react_to_do', ToDoSchema)
module.exports = ToDo
