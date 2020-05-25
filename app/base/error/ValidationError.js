'use strict'

class ValidationError extends Error {
  constructor (message) {
    super()
    this.name = 'Error'
    this.httpCode = 422
    this.clientMessage = message
    this.message = message
    this.isOperational = true
  }
}

module.exports = ValidationError
