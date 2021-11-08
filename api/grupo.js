
module.exports = app => {
   const { existsOrError, notExistsOrError, equalsOrError } = app.api.validator


   //metodo post
   const save = async (req, res) => {
      const grupo = { ...req.body }
      if (req.params.cod) grupo.familia.cod = req.params.cod

      app.db('grupos')
         .insert(grupo)
         .then(_ => res.status(204).send())
         .catch(err => res.status(500).send(err.message))

   }
   //metodo put
   const update = async (req, res) => {
      const grupo = { ...req.body }
      await app.db('grupos')
         .update({
            admin: grupo.admin
         })
         .where({ codfamilia: grupo.codfamilia }).andWhere({ codusuario: grupo.codusuario })
         .then(_ => res.status(200).send('Status do usuário alterado com sucesso!'))
         .catch(err => res.status(500).send(err))
   }

   //metodo getFamilia - busca por código da familia
   const getFamilia = async (req, res) => {
      try {
         let grupo = {}
         const cod = req.params.codfamilia
         grupo.familia = await app.db('familias').select('cod', 'nome').where({ cod: cod }).first()

         grupo.usuarios = await app.db('grupos')
            .join('usuarios', 'grupos.codusuario', 'usuarios.cod')
            .select('usuarios.cod', 'usuarios.nome', 'usuarios.telefone', 'usuarios.email', 'grupos.admin').where({ 'grupos.codfamilia': cod })
         res.json(grupo)
      } catch (error) {
         res.status(500).send(error)
      }

   }
   //metodo getUsuario - busca os grupos do usuário
   const getUsuario = async (req, res) => {

      const cod = req.params.codusuario

      await app.db('grupos')
         .join('familias', 'grupos.codfamilia', 'familias.cod')
         .select('familias.cod', 'familias.nome', 'grupos.admin').where({ 'grupos.codusuario': cod })
         .then(grupos => res.json(grupos))
         .catch(err => res.status(500).send(err.message))



   }
   return { save, getFamilia, update, getUsuario }
}