const { Schema, model } = require('mongoose')

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

const User = model('react_user', UserSchema)
module.exports = User
