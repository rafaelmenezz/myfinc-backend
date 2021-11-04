module.exports = app => {
   app.route('/usuarios')
      //.all(app.config.passport.authenticate())
      .post(app.api.usuario.save)
      .get(app.api.usuario.get)

      app.route('/usuarios/:id')
      //.all(app.config.passport.authenticate())
      .put(app.api.usuario.save)
      .get(app.api.usuario.getById)
}