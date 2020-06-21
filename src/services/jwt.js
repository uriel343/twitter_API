'use strict'
const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../confing')

exports.createToken = user => {
    var payload = {
        sub: user._id,
        user: user.user,
        iat: moment().unix(),
        exp: moment().day(30, 'days').unix()
    }

    return jwt.encode(payload, config.SECRET_PASS)
}