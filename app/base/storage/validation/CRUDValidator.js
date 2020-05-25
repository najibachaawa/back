'use strict'

const ES = require('../../error/errorService')

module.exports = {
	validateDocExist: (Model, id) => {
		return Model.findById(id)
			.then(doc => {
				if (!doc) return Promise.reject(ES.notFoundError('Doc does not exist'))
				return Promise.resolve(doc)
			})
	}
}
