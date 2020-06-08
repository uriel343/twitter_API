'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

var userSchema = Schema({
    name: String,
    user: String,
    email: String,
    password: String,
    status: String
})

module.exports = mongoose.model('user', userSchema)
