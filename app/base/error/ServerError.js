'use strict'

class ServerError extends Error {
  constructor (message) {
    super()
    this.name = 'Error'
    this.httpCode = 500
    this.message = message
    this.clientMessage = null
    this.isOperational = false
  }
}

module.exports = ServerError
