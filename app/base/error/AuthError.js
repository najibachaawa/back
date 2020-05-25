'use strict'

class AuthError extends Error {
  constructor (message) {
    super()
    this.name = 'Error'
    this.httpCode = 401
    this.clientMessage = message
    this.message = message
    this.isOperational = true
  }
}

module.exports = AuthError
