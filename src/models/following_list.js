'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

var followingSchema = Schema({
    user: {type: Schema.Types.ObjectId, ref: 'user'},
    following: [
       {
           userAccount: {type: Schema.Types.ObjectId, ref: 'user'}
       }
    ]
})

module.exports = mongoose.model('following', followingSchema)
