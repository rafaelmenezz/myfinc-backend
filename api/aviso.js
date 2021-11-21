module.exports = app => {
   const { existsOrError } = app.api.validator

   const convidar = async (req, res) => {

      const aviso = { ...req.body }

      try {
         existsOrError(aviso.codusuario, "Usuário não informado!")
         existsOrError(aviso.codfamilia, "Família não informada!")
      } catch (msg) {
         return res.status(400).send(msg)
      }

      aviso.tipo = 3

      app.db('avisos')
         .insert(aviso)
         .then(_ => res.status(200).send('Convite enviado com sucesso!'))
         .catch(err => res.status(500).send(err))
   }

   const msgLida = async (req, res) => {
      const cod = req.params.cod
      try {
         existsOrError(notify.codusuario, "Usuário não informado!")
         existsOrError(notify.codfamilia, "Família não informada!")
      } catch (msg) {
         return res.status(400).send(msg)
      }
      app.db('avisos')
         .update({ lida: true })
         .where({ cod })
         .then(_ => res.status(204).send())
         .catch(err => res.status(500).send(err))
   }

   const remove = async (req, res) => {
      await app.db('avisos')
         .where({ cod: req.params.cod }).del()
         .catch(err => res.status(500).send(err))
   }

   const getByEmail = async (req, res) => {
      const email = req.params.email
      const aviso = await app.db('avisos')
         .where({ email: email }).andWhere({ codtipo: 3 }).first()

      let convites = {}
      if (aviso) {
         try {
            convites.cod = aviso.cod
            convites.familia = await app.db('familias')
               .where({ cod: aviso.codfamilia }).first()
            convites.usuario = await app.db('usuarios')
               .where({ cod: aviso.codusuario }).first()
            res.json(convites)

         } catch (error) {
            return res.status(400).send(error)
         }
      } else {
         res.status(200).send(false)
      }
   }
   const getByUserCod = (req, res) => {

      app.db({ a: 'avisos' })
         .join({ f: 'familias' }, 'a.codfamilia', 'f.cod')
         .join({ tp: 'tpavisos' }, 'a.tipo', 'tp.cod')
         .select({ cod: 'a.cod' }, { codfamilia: 'a.codfamilia' }, { familia: 'f.nome' }, 'a.mensagem', 'tp.cod', { tipo: 'tp.descricao' })
         .where({ codusuario: req.params.cod })
         .then(avisos => res.json(avisos))
         .catch(err => res.status(500).send('Error: ' + err))
   }

   return { convidar, msgLida, remove, getByEmail, getByUserCod }

}