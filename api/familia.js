
module.exports = app => {
   const { existsOrError, notExistsOrError, equalsOrError } = app.api.validator


   //metodo post
   const save = async (req, res) => {
      const familia = { ...req.body }

      if (familia.cod) {
         try {
            existsOrError(conta.nome, "Nome não informado")

         } catch (msg) {
            return res.status(400).send(msg.message)
         }
         app.db('familias')
            .update({
               nome: familia.nome,
            })
            .where({ cod: familia.cod })
            .then(_ => res.status(200).send('Nome da familia alterado com sucesso!'))
            .catch(err => res.status(500).send(err.message))
      } else {
         try {
            existsOrError(familia.nome, "Nome da familia não informado")
            const familiaFromDB = await app.db('familias')
               .where({ nome: familia.nome }).first()
            if (!familia.cod) {
               notExistsOrError(familiaFromDB, 'Nome da familia já cadastrado')
            }
         } catch (msg) {
            return res.status(400).send(msg)
         }
         app.db('familias')
            .insert(familia, 'cod').into('familias')
            .then(cod => res.json({ cod: cod[0] }))
            .catch(err => res.status(500).send(err.message))
      }

   }
   const remove = async (req, res) => {
      try {

         const financas = await app.db('financas')
            .where({ codconta: req.params.cod })
         notExistsOrError(financas, 'Não foi possível deletar familia. A familia possui finanças cadastrado.')

         const grupos = await app.db('grupos')
            .where({ codfamilia: req.params.cod })
         notExistsOrError(familia, 'Não foi possível deletar familia. A familia possui menbros cadastrado.')

         const rowDeleted = await app.db('familias')
            .where({ cod: req.params.cod }).del()
         existsOrError(rowDeleted, 'Familia não encontrada.')

         res.status(200).send('Familia deletada com sucesso.')

      } catch (msg) {
         return res.status(400).send(msg)
      }
   }
   // metodo get
   const get = (req, res) => {
      app.db('familia')
         .select('cod', 'nome')
         .then(familias => res.json(familias))
         .catch(err => res.status(500).send(err))
   }

   //metodo getById
   const getById = (req, res) => {
      const cod = req.params.cod
      app.db('familias')
         .select('cod', 'nome')
         .where({ cod: cod })
         .then(familias => res.json(familias))
         .catch(err => res.status(500).send(err))
   }
   return { save, get, getById, remove }
}