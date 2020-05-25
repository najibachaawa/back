'use strict'

class NotFoundError extends Error {
  constructor (message) {
    super();
    this.name = 'Error';
    this.httpCode = 404;
    this.clientMessage = message;
    this.message = message;
    this.isOperational = true;
  }
}

module.exports = NotFoundError;
