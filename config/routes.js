module.exports = app => {
   app.route('/usuarios')
      //.all(app.config.passport.authenticate())
      .post(app.api.usuario.save)
      .get(app.api.usuario.get)
      

   app.route('/usuarios/:cod')
      //.all(app.config.passport.authenticate())
      .get(app.api.usuario.getById)

   app.route('/contas')
      //.all(app.config.passport.authenticate())
      .post(app.api.conta.save)
      .get(app.api.conta.get)
      .put(app.api.conta.save)

   app.route('/contas/:cod')
      //.all(app.config.passport.authenticate())
      .get(app.api.conta.getById)
      .delete(app.api.conta.remove)
      

   app.route('/familias')
      //.all(app.config.passport.authenticate())
      .post(app.api.familia.save)
      .put(app.api.familia.update)

   app.route('/familias/:codconta')
      //.all(app.config.passport.authenticate())
      .get(app.api.familia.getById)

   app.route('/financas')
      //.all(app.config.passport.authenticate())
      .post(app.api.financa.save)
      .get(app.api.financa.get)

   app.route('/financas/:cod')
      //.all(app.config.passport.authenticate())
      .post(app.api.financa.save)
      .delete(app.api.financa.remove)
      .get(app.api.financa.getById)

   app.route('/montantes')
      //.all(app.config.passport.authenticate())
      .post(app.api.montante.save)
      .get(app.api.montante.get)

   app.route('/montantes/:cod')
      //.all(app.config.passport.authenticate())
      .post(app.api.montante.save)
      .get(app.api.montante.getById)
      .delete(app.api.montante.remove)

}