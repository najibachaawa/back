'use strict'

class ForbiddenError extends Error {
  constructor (message) {
    super()
    this.name = 'Error'
    this.httpCode = 403
    this.clientMessage = message
    this.message = message
    this.isOperational = true
  }
}

module.exports = ForbiddenError
