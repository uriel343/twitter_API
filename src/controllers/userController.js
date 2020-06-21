'use strict'
const User = require('../models/user')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('../services/jwt')

function optionsUser(req,res,command){
    var user = new User()
    var parametr = req.body.command
    parametr = parametr.toLowerCase()
    parametr = parametr.trim()
    parametr = parametr.split(" ")
    
    
    
    var evaluatingCommand = (parametr[0] != null && parametr.length > 0 ? parametr[0] : "")

    switch (evaluatingCommand) {
        case "registrar":
            if (parametr[1] && parametr[2]) {
                user.user = parametr[1]
                user.password = parametr[2]

                User.find({user: user.user}).exec(
                (err, userExisting)=>{
                    if(err){
                        return res.status(500).send({
                            message: "Server error, please try again"
                        })
                    }
                    if(userExisting && userExisting >= 1){
                        return res.status(400).send({
                            message: "This user already exists"
                        })
                    }else{
                        bcrypt.hash(user.password, null, null, (err,hash)=>{
                            user.password = hash
                            user.save((err,userSaved)=>{
                                if(err){
                                    return res.status(500).send({
                                        message: "Server error, please try again"
                                    })
                                }
                                if (userSaved) {
                                    res.status(200).send({
                                      user: userSaved
                                    });
                                  } else {
                                    res.status(404).send({
                                      message: "The user cannot register"
                                    });
                                  }
                            })
                        })
                    }
                } 
                )
            }else{
                res.status(400).send({
                    message: "Missing data, make sure that you are sending all the data"
                })
            }
            break;
    
        default:
            return res.status(404).send({
                message: "Option not found, please make sure that you wrote the correct form"
            })
            break;
    }


}

module.exports = {
    optionsUser
}