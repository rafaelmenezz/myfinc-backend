

module.exports = app => {
   app.post('/signup', app.api.usuario.save)
   app.post('/signin', app.api.auth.signin)
   app.post('/validateToken', app.api.auth.validateToken)

   app.route('/usuarios')
      .all(app.config.passport.authenticate())
      .put(app.api.usuario.save)
      .get(app.api.usuario.get)


   app.route('/usuarios/:cod')
      // .all(app.config.passport.authenticate())
      .get(app.api.usuario.getById)

   app.route('/familias')
      //  .all(app.config.passport.authenticate())
      .post(app.api.familia.save)
      .get(app.api.familia.get)
      .put(app.api.familia.save)

   app.route('/familias/:cod')
      // .all(app.config.passport.authenticate())
      .get(app.api.familia.getById)
      .delete(app.api.familia.remove)


   app.route('/grupos')
      // .all(app.config.passport.authenticate())
      .post(app.api.grupo.save)
      .put(app.api.grupo.update)

   app.route('/familias/grupos/:codfamilia')
      //.all(app.config.passport.authenticate())
      .get(app.api.grupo.getFamilia)

   app.route('/usuarios/grupos/:codusuario')
      //.all(app.config.passport.authenticate())
      .get(app.api.grupo.getUsuario)


   app.route('/financas')
      //.all(app.config.passport.authenticate())
      .get(app.api.financa.get)
      .post(app.api.financa.save)

   app.route('/financas/:cod')
      //  .all(app.config.passport.authenticate())
      .put(app.api.financa.save)
      .get(app.api.financa.getById)
      .delete(app.api.financa.remove)

   app.route('/montantes')
      //   .all(app.config.passport.authenticate())
      .post(app.api.montante.save)
      .get(app.api.montante.get)

   app.route('/montantes/:cod')
      //   .all(app.config.passport.authenticate())
      .put(app.api.montante.save)
      .get(app.api.montante.getById)
      .delete(app.api.montante.remove)

}