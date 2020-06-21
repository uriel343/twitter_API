'use strict'
const express = require('express')
const UserController = require('../controllers/userController')


const api = express.Router()
api.post("/command", UserController.optionsUser)

module.exports = api