'use strict'
const express = require('express')
const UserController = require('../controllers/userController')
const GeneralController = require('../controllers/generalController')
const md_auth = require('../middlewares/auth')


const api = express.Router()
api.post("/command", md_auth.ensureAuth ,GeneralController.generalOptions)

module.exports = api