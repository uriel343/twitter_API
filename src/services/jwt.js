'use strict'
const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../confing')

exports.createToken = user => {
    var payload = {
        sub: user._id,
        name: user.name,
        user: user.user,
        email: user.email,
        iat: moment().unix(),
        exp: moment().day(30, 'days').unix()
    }

    return jwt.encode(payload, config.SECRET_PASS)
}