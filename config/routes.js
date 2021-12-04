

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
      // .all(app.config.passport.authenticate())
      .post(app.api.financa.save)

   app.route('/financas/:cod')
      // .all(app.config.passport.authenticate())
      .put(app.api.financa.update)
      .delete(app.api.financa.remove)

   app.route('/financas/familias/:cod')
      .all(app.config.passport.authenticate())
      .get(app.api.financa.getFamilia)

   app.route('/financas/familias/:codfamilia/usuario/:codusuario')
      .all(app.config.passport.authenticate())
      .get(app.api.financa.getUsuarioFamilia)

   app.route('/montantes/familias/:cod')
      .all(app.config.passport.authenticate())
      .get(app.api.financa.getFamiliaMontantes)

   app.route('/financas/usuarios/:cod')
      .all(app.config.passport.authenticate())
      .get(app.api.financa.getByUser)

   app.route('/montantes')
      .all(app.config.passport.authenticate())
      .post(app.api.montante.save)

   app.route('/montantes/:cod')
      .all(app.config.passport.authenticate())
      .put(app.api.montante.save)
      .get(app.api.financa.getByMontantes)
      .delete(app.api.montante.remove)

   app.route('/relatorio/usuario/:cod/mes/')
      .all(app.config.passport.authenticate())
      .get(app.api.montante.getUsuarioMes)

   app.route('/relatorio/usuario/:cod/mes/:data')
      .all(app.config.passport.authenticate())
      .get(app.api.montante.getUsuarioMes)


   app.route('/relatorio/usuario/:cod/familia/:codfamilia/mes/')
      .all(app.config.passport.authenticate())
      .get(app.api.montante.getUsuarioFamiliaMes)

   app.route('/relatorio/usuario/:cod/familia/:codfamilia/mes/:data')
      .all(app.config.passport.authenticate())
      .get(app.api.montante.getUsuarioFamiliaMes)

   app.route('/relatorio/usuario/:cod/ano/')
      .all(app.config.passport.authenticate())
      .get(app.api.montante.getUsuarioAno)

   app.route('/relatorio/familia/mes/:cod')
      .all(app.config.passport.authenticate())
      .get(app.api.montante.getFamiliaMes)

   app.route('/relatorio/familia/mes/:cod/:data')
      .all(app.config.passport.authenticate())
      .get(app.api.montante.getFamiliaMes)


   app.route('/relatorio/familia/ano/')
      .all(app.config.passport.authenticate())
      .get(app.api.montante.getFamiliaAno)

   app.route('/convidar')
      .all(app.config.passport.authenticate())
      .post(app.api.convite.convidar)

   app.route('/convites/:cod')
      .all(app.config.passport.authenticate())
      .get(app.api.convite.getConvites)
      .delete(app.api.convite.remove)

   app.route('/convites/aceitar/:cod')
      .all(app.config.passport.authenticate())
      .put(app.api.convite.aceitar)

   app.route('/convites/recusar/:cod')
      .all(app.config.passport.authenticate())
      .put(app.api.convite.recusar)


}