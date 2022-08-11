const Validator = require('validator')
const isEmpty = require('./isEmpty')

const validateToDoInput = (data) => {
  const errors = {}

  // check content field
  if (isEmpty(data.content)) {
    errors.content = 'content cannot be empty'
  } else if (!Validator.isLength(data.content, { min: 1, max: 300 })) {
    errors.content = 'content must be between 1 and 300 characters long'
  }
  return { errors, isValid: isEmpty(errors) }
}

module.exports = validateToDoInput
