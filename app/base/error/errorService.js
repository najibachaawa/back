'use strict'
const AuthError = require('./AuthError')
const ForbiddenError = require('./ForbiddenError')
const NotFoundError = require('./NotFoundError')
const ServerError = require('./ServerError')
const ValidationError = require('./ValidationError')

module.exports = {
  authError: (message) => {
    return new AuthError(message)
  },
  forbiddenError: (message) => {
    return new ForbiddenError(message)
  },
  notFoundError: (message) => {
    return new NotFoundError(message)
  },
  serverError: (message) => {
    return new ServerError(message)
  },
  validationError: (message) => {
    return new ValidationError(message)
  }
}
