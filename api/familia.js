
module.exports = app => {
   const { existsOrError, notExistsOrError } = app.api.validator


   const save = async (req, res) => {
      const familia = { ...req.body }
      try {
         existsOrError(familia.nome, "Nome da familia não informado")
         existsOrError(familia.usuario.cod, "Usuário não informado")
         const familiaFromDB = await app.db('familias')
            .where({ nome: familia.nome }).first()
         if (!familia.cod) {
            notExistsOrError(familiaFromDB, 'Nome da familia já cadastrado')
         }
      } catch (msg) {
         return res.status(400).send(msg)
      }
      familia.usuario.admin = true

      const cod = await app.db('familias')
         .insert({ nome: familia.nome }, 'cod').into('familias')
         .catch(err => res.status(500).send('Error: ' + err.message))

      familia.cod = cod[0]


      await app.db('grupos')
         .insert({
            codfamilia: familia.cod,
            codusuario: familia.usuario.cod,
            admin: familia.usuario.admin
         })
         .then(_ => res.status(200).send('Familia cadastrada com sucesso!'))
         .catch(err => res.status(500).send('Error: ' + err.message))
   }

   //metodo post
   const update = async (req, res) => {
      const familia = { ...req.body }
      try {
         existsOrError(familia.nome, "Nome não informado")
         if (!familia.usuario.admin) {
            existsOrError(familia.usuario.admin, 'Você não é o administrador da família!')
         }

      } catch (msg) {
         return res.status(400).send(msg)
      }
      app.db('familias')
         .update({
            nome: familia.nome,
         })
         .where({ cod: familia.cod })
         .then(_ => res.status(200).send('Nome da familia alterado com sucesso!'))
         .catch(err => res.status(500).send('Error' + err.message))
   }

   const addUsuario = async (req, res) => {

      const convite = { ...req.body }
      let grupo = {}
      try {
         grupo = await app.db('familias')
            .where({ cod: convite.codfamilia }).first()

         if (!grupo) {
            existsOrError(grupo, 'Nome da familia não Encontrado')
         }

         const admin = await app.db('grupos')
            .where({ codfamilia: convite.codfamilia }).andWhere({ codusuario: convite.codusuario }).andWhere({ admin: true }).first()
         console.log(grupo)
         if (!admin.admin) {
            existsOrError(admin.admin, 'Você não é administrador da conta!')
         }

         const convidado = await app.db('usuarios')
            .where({ cod: convite.codconvidado }).first()
         if (!convidado.cod) {
            existsOrError(convidado.cod, 'Você não é administrador da conta!')
         }

      } catch (msg) {
         return res.status(400).send(msg)
      }
      app.db('grupos')
         .insert({ codfamilia: convite.codfamilia, codusuario: convite.codconvidado, admin: false })
         .then(_ => res.status(200).send('Usuário inserido na famílias com sucesso!'))
         .catch(err => res.status(500).send('Error: ' + err.message))
   }

   const remove = async (req, res) => {
      const familia = { ...req.body }

      try {
         existsOrError(familia.codfamilia, "Nome da familia não informado")
         existsOrError(familia.codusuario, "Usuário não informado")
         const userAdmin = await app.db('grupos')
            .where({ codfamilia: familia.codfamilia }).andWhere({ codusuario: familia.codusuario }).first()

         if (!userAdmin.admin) {
            existsOrError(userAdmin.admin, "Você não é um administrador da familia!")
         } else {
            await app.db('financas')
            update({ codfamilia: null })
               .where({ codfamilia: familia.codfamilia }).del()

            await app.db('grupos')
               .where({ codfamilia: familia.codfamilia }).del()

            await app.db('familia')
               .where({ cod: familia.codfamilia }).del()

            res.status(200).send('Familia deletada com sucesso.')
         }

      } catch (msg) {
         return res.status(400).send('Error: ' + msg)
      }
   }

   return { save, remove, update, addUsuario }
}