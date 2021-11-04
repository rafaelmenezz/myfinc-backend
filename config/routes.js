module.exports = app => {
   app.route('/usuarios')
      //.all(app.config.passport.authenticate())
      .post(app.api.usuario.save)
      .get(app.api.usuario.get)
}