const app = require('express')()
const consign = require('consign')
const db = require('./config/db')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger.json');

const port = process.env.PORT || 3000

app.db = db

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/validator.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)

app.listen(port, () => {
    console.log('Backend executando...')
})