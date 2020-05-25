'use strict'

const mongoose = require('mongoose');
const userFieldValidation = require('../validation/UserFieldValidation')

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        sparse: true,
        text: true,
        required: true
    },
    lastName: {
        type: String,
        sparse: true,
        required: true
    },
    facebookId: {
        type: String,
        sparse: true,
        unique: true,
    },
    googleId: {
        type: String,
        sparse: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        sparse: true,
        unique: true,
        lowercase: true,
        validate: userFieldValidation.validateEmail(this)
    },
    password: {
        type: String
    },
    secretNumber: {
        type: String
    },
    phoneNumber: {
        type: Number,
        default: null
    },
    role: {
        type: String,
        default: 'user'
    },
    suspend: {
        type: Boolean,
        default: false
    },
    verified: {
        type: Boolean,
        default: false
    },
    userImage: {
        type: String,
        default: null
    },
    // location: {
    //     type: {
    //         type: String,
    //         default: 'Point',
    //         enum: ['Point']
    //     },
    //     coordinates: [Number]
    // },
    deviceTokens: {
        type: Array
    },
    resetPaswordToken: {
        type: String,
        default: null
    },
    resetPaswordExpires: {
        type: Date,
        default: null
    },
}, {
        timestamps: true
    });

//userSchema.index({ location: "2dsphere" });

userSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}
const User = mongoose.model('User', userSchema);

module.exports = User;