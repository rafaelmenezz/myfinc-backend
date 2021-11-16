

module.exports = app => {
   app.post('/signup', app.api.usuario.save)
   app.post('/signin', app.api.auth.signin)
   app.post('/validateToken', app.api.auth.validateToken)

   app.route('/usuarios/')
      .all(app.config.passport.authenticate())
      .delete(app.api.usuario.remove)

   app.route('/usuarios/:cod')
      .all(app.config.passport.authenticate())
      .put(app.api.usuario.save)
      .get(app.api.usuario.getById)

   app.route('/familias')
      .all(app.config.passport.authenticate())
      .post(app.api.familia.save)
      .put(app.api.familia.update)

   app.route('/familias/:cod')
      .all(app.config.passport.authenticate())
      .delete(app.api.familia.remove)

   app.route('/familias/convidar/:email')
      .all(app.config.passport.authenticate())
      .get(app.api.usuario.getByEmail)

   app.route('/familias/convidar')
      .all(app.config.passport.authenticate())
      .post(app.api.familia.addUsuario)

   app.route('/familias/grupos/:cod')
      .all(app.config.passport.authenticate())
      .get(app.api.grupo.getFamilia)

   app.route('/usuarios/grupos/:cod')
      .all(app.config.passport.authenticate())
      .get(app.api.grupo.getUsuario)

   app.route('/financas')
      .all(app.config.passport.authenticate())
      .post(app.api.financa.save)
      .put(app.api.financa.update)

   app.route('/financas/:cod')
      .all(app.config.passport.authenticate())
      .put(app.api.financa.update)

   app.route('/montantes')
      .all(app.config.passport.authenticate())
      .post(app.api.montante.save)

   app.route('/montantes/:cod')
      .all(app.config.passport.authenticate())
      .get(app.api.financa.getByMontantes)
      .delete(app.api.montante.remove)

}