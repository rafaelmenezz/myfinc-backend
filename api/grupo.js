
module.exports = app => {
   const { existsOrError, notExistsOrError, equalsOrError } = app.api.validator


   //metodo getFamilia - busca por código da familia
   const getFamilia = async (req, res) => {
      try {
         let grupo = {}
         const cod = req.params.cod
         grupo = await app.db('familias').select('cod', 'nome').where({ cod: cod }).first()

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

      const cod = req.params.cod
      let familias = {}
      try {

         familias = await app.db('grupos')
            .join('familias', 'grupos.codfamilia', 'familias.cod')
            .select('familias.cod', 'familias.nome', 'grupos.admin').where({ 'grupos.codusuario': cod })
         res.json(familias)
      } catch (error) {
         res.status(500).send('Error: ' + error)
      }

   }
   return { getFamilia, getUsuario }
}