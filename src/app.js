'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const config = require('./confing')
const routing = require('./routes/routing')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

app.use('/api', routing)

const PORT = config.PORT

module.exports = {
    app,
    PORT
}