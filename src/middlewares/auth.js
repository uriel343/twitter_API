'use strict'
const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../confing')

exports.ensureAuth = (req, res, next)=>{
  var parametr = req.body.command; 
  parametr = parametr.toLowerCase();
  parametr = parametr.trim();
  parametr = parametr.split(" ");

  var evaluatingCommand =
    parametr[0] != null && parametr.length > 0 ? parametr[0] : "";

    if(evaluatingCommand != "register" && evaluatingCommand != "login") {
        if(!req.headers.authorization){
            return res.status(403).send({
                message: "You need to be logged to do this action "
            })
        }        
        var token = req.headers.authorization.replace(/['"]+/g, '')
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
    }
 
    req.user = payload
    next()
}