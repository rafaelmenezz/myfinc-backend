const cors = require('cors')
const express = require('express')
const passport = require('passport')

module.exports = app =>{
    app.use(express.json())
    app.use(cors())
    app.use(passport.initialize())
}