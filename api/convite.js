module.exports = app => {
   const { existsOrError } = app.api.validator

   const convidar = async (req, res) => {

      const convite = { ...req.body }

      try {
         existsOrError(convite.codusuario, "Usuário não informado!")
         existsOrError(convite.codfamilia, "Família não informada!")
         existsOrError(convite.email, "Email não informado!")
      } catch (msg) {
         return res.status(400).send(msg)
      }

      convite.status = 1


      app.db('convites')
         .insert(convite)
         .then(_ => res.status(204).send())
         .catch(err => res.status(500).send(err.message))
   }
   const aceitar = async (req, res) => {

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
         .catch(err => res.status(500).send('Error: ' + err.message))

      app.db('convites')
         .update({ status: 2 }).where({ cod: convite.cod })
         .then(_ => res.status(204).send())
         .catch(err => res.status(500).send('Error: ' + err.message))
   }

   const recusar = async (req, res) => {
      app.db('convites')
         .update({
            status: 3
         })
         .where({ cod: req.params.cod })
         .then(_ => res.status(204).send())
         .catch(err => res.status(500).send(err.message))
   }

   const remove = async (req, res) => {
      await app.db('convites')
         .where({ cod: req.params.cod }).del()
         .then(_ => res.status(204).send())
         .catch(err => res.status(500).send(err.message))
   }


   const getConvites = async (req, res) => {
      let user = await app.db('usuarios')
         .where({ cod: req.params.cod }).first()

      await app.db({ c: 'convites' })
         .join({ u: 'usuarios' }, 'c.codusuario', 'u.cod')
         .join({ f: 'familias' }, 'c.codfamilia', 'f.cod')
         .join({ s: 'status' }, 'c.status', 's.cod')
         .select({ cod: 'c.cod' }, { codusuario: 'u.cod' }, { remetente: 'u.nome' }, { codfamilia: 'c.codfamilia' }, { familia: 'f.nome' }, { email: 'c.email' }, { codstatus: 'c.status' }, { status: 's.descricao' })
         .where({ 'c.codusuario': user.cod }).orWhere({ 'c.email': user.email })
         .then(avisos => res.json(avisos))
         .catch(err => res.status(500).send(err.message))
   }

   return { convidar, remove, getConvites, aceitar, recusar }

}