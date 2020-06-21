'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

var userSchema = Schema({
    user: String,
    password: String
})

module.exports = mongoose.model('user', userSchema)
