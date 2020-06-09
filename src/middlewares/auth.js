'use strict'
const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../confing')

exports.ensureAuth = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(403).send({
            message: "The request fail"
        })
    }
    var token = req.headers.authorization.replace(/['"]+/g, "")
    try {
        var payload = jwt.decode(token, config.SECRET_PASS)
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                message: 'The token has expired'
            })
        }
    } catch (error) {
        return res.status(404).send({
            message: 'Invalid token'
        })
    }

    req.user = payload
    next()
}