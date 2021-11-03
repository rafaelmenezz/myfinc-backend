const app = require('express')()
const consign = require('consign')
const port = process.env.PORT || 3000
const db = require('./config/db')

app.db = db

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/validator.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)

app.listen(port, () =>{
    console.log('Backend executando...')
})