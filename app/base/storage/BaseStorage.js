'use strict'

const ES = require('../error/errorService')
const BaseValidator = require('./validation/BaseValidator')

class BaseStorage {
    constructor({ Model, CustomValidator }) {
        this.Model = Model
        this.validator = CustomValidator ? new CustomValidator({ Model }) : new BaseValidator({ Model })
    }

    saveAndPopulate(doc, populate) {
        if (!populate) return doc.save()
        return doc.save()
            .then(doc => {
                return this.Model.findById(doc._id).populate(populate)
            })
    }

    storeByAdmin(data, user, populate) {
        let doc = new this.Model(data)
        if (!populate) return doc.save()
        return this.saveAndPopulate(doc, populate)
    }

    store(data, user, populate) {
        return this.validator.store(data, user)
            .then(() => {
                let storeData = this.Model.modelName === 'User' ? data : { ...data, user: user._id }
                let doc = new this.Model(storeData)
                if (!populate) return doc.save()
                return this.saveAndPopulate(doc, populate)
            })
    }

    update(docId, updateData, user, populate) {
        return this.validator.update(docId, updateData, user)
            .then(doc => {
                updateData = { ...updateData, updatedAt: Date.now() }
                doc.set(updateData)
                return this.saveAndPopulate(doc, populate)
            })
    }

    find(docId, queryParams, populate) {
        return this.validator.find(docId, queryParams)
            .then(() => {
                return populate ? this.Model.findById(docId).populate(populate) : this.Model.findById(docId)
            })
            .then(doc => {
                if (!doc) return Promise.reject(ES.notFoundError(this.Model.modelName + ' not found'))
                return Promise.resolve(doc)
            })
    }

    findOne(queryParams, populate) {
        return this.validator.findOne(queryParams)
            .then(() => {
                if (populate) {
                    return this.Model.findOne(queryParams).populate(populate)
                }
                return this.Model.findOne(queryParams)
            })
    }

    async dataWithPagination(queryParams, populate, sortQuery, limit, pageNumber) {
        let allData = {}
        let data = await this.Model.find(queryParams).populate(populate).sort(sortQuery).limit(limit).skip(pageNumber > 0 ? ((pageNumber - 1) * limit) : 0)
        allData.data = data
        allData.page = pageNumber
        allData.nextPage = Number(pageNumber) + 1
        allData.previousPage = Number(pageNumber) - 1
        allData.limit = limit
        return allData
    }

    list(queryParams, populate, sortQuery, limit, pageNumber) {
        return this.validator.list(queryParams)
            .then(() => {
                if (populate) {
                    if (sortQuery) {
                        if (limit) {
                            if (pageNumber) {
                                return this.dataWithPagination(queryParams, populate, sortQuery, limit, pageNumber)
                            }
                            return this.Model.find(queryParams).populate(populate).sort(sortQuery).limit(limit)
                                .collation({ locale: 'en_US', strength: 2 })
                        }
                        return this.Model.find(queryParams).populate(populate).sort(sortQuery)
                            .collation({ locale: 'en_US', strength: 2 })
                    }
                    return this.Model.find(queryParams).populate(populate).collation({ locale: 'en_US', strength: 2 })
                }
                if (populate) {
                    if (sortQuery) return this.Model.find(queryParams).populate(populate).sort(sortQuery)
                        .collation({ locale: 'en_US', strength: 2 })
                    return this.Model.find(queryParams).populate(populate).collation({ locale: 'en_US', strength: 2 })
                }
                if (sortQuery) return this.Model.find(queryParams).sort(sortQuery).collation({ locale: 'en_US', strength: 2 })
                return this.Model.find(queryParams).collation({ locale: 'en_US', strength: 2 })
            })
    }

    delete(docId, user) {
        return this.validator.delete(docId, user)
            .then(() => this.Model.findByIdAndRemove(docId))
    }

    deleteMany(docId, user) {
        return this.validator.delete(docId, user)
            .then(() => this.Model.deleteMany(docId))
    }
}

module.exports = BaseStorage
