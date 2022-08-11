const Validator = require('validator')
const isEmpty = require('./isEmpty')

const validateRegisterInput = (data) => {
  const errors = {}

  // check email field
  if (isEmpty(data.email)) {
    errors.email = 'Email cannot be empty'
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is not valid'
  }

  // check password
  if (isEmpty(data.password)) {
    errors.password = 'Password cannot be empty'
  } else if (!Validator.isLength(data.password, { min: 6, max: 150 })) {
    errors.password = 'Password must be between 6 and 150 characters long'
  }

  // check confirm password
  if (isEmpty(data.confirmPassword)) {
    errors.confirmPassword = 'confirm Password cannot be empty'
  } else if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = 'Password & confirmPassword are not equal'
  }
  return { errors, isValid: isEmpty(errors) }
}

module.exports = validateRegisterInput
