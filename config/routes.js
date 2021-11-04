module.exports = app => {
   app.route('/usuarios')
      //.all(app.config.passport.authenticate())
      .post(app.api.usuario.save)
      .get(app.api.usuario.get)

   app.route('/usuarios/:cod')
      //.all(app.config.passport.authenticate())
      .put(app.api.usuario.save)
      .get(app.api.usuario.getById)

   app.route('/contas')
      //.all(app.config.passport.authenticate())
      .post(app.api.conta.save)
      .get(app.api.conta.get)

   app.route('/contas/:cod')
      //.all(app.config.passport.authenticate())
      .get(app.api.conta.getById)
      .put(app.api.conta.save)

   app.route('/familias')
      //.all(app.config.passport.authenticate())
      .post(app.api.familia.save)
      .put(app.api.familia.update)

   app.route('/familias/:codconta')
      //.all(app.config.passport.authenticate())
      .get(app.api.familia.getById)
}