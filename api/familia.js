
module.exports = app => {
   const { existsOrError, notExistsOrError, equalsOrError } = app.api.validator


   //metodo post
   const save = async (req, res) => {
      const familia = { ...req.body }
      if (req.params.cod) familia.conta.cod = req.params.cod

      app.db('familias')
         .insert(familia)
         .then(_ => res.status(204).send())
         .catch(err => res.status(500).send(err.message))

   }
   //metodo put
   const update = async (req, res) => {
      const familia = { ...req.body }
      await app.db('familias')
         .update({
            admin: familia.admin
         })
         .where({ codconta: familia.codconta }).andWhere({ codusuario: familia.codusuario })
         .then(_ => res.status(200).send('Status do usuário alterado!'))
         .catch(err => res.status(500).send(err.message))
   }

   //metodo getById
   const getById = async (req, res) => {
      try {
         let familia = {}
         const cod = req.params.codconta
         familia = await app.db('contas').select('cod', 'nome').where({ cod: cod }).first()
         familia.menbros = await app.db('familias')
            .join('usuarios', 'familias.codusuario', 'usuarios.cod')
            .select('usuarios.cod', 'usuarios.nome', 'usuarios.telefone', 'usuarios.email').where({ 'familias.codconta': cod })

         res.json(familia)
      } catch (error) {
         res.status(500).send(error)
      }

   }
   return { save, getById, update }
}