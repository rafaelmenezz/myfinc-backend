
module.exports = app => {
   const { existsOrError, notExistsOrError, equalsOrError } = app.api.validator


   //metodo post
   const save = async (req, res) => {
      const conta = { ...req.body }
      if (req.params.cod) conta.cod = req.params.cod

      if (conta.cod) {
         try {
            existsOrError(conta.nome, "Nome não informado")
         } catch (msg) {
            return res.status(400).send(msg)
         }
         app.db('contas')
            .update({
               nome: conta.nome,
            })
            .where({ cod: conta.cod })
            .then(_ => res.status(200).send('Nome da familia alterado com sucesso!'))
            .catch(err => res.status(500).send(err.message))
      } else {
         try {
            existsOrError(conta.nome, "Nome da conta não informado")
            const contaFromDB = await app.db('contas')
               .where({ nome: conta.nome }).first()
            if (!conta.cod) {
               notExistsOrError(contaFromDB, 'Nome da familia já cadastrado')
            }
         } catch (msg) {
            return res.status(400).send(msg)
         }
         app.db('contas')
            .insert(conta, 'cod').into('contas')
            .then(cod => res.json(cod[0]))
            .catch(err => res.status(500).send(err.message))
      }

   }
   // metodo get
   const get = (req, res) => {
      app.db('contas')
         .select('cod', 'nome')
         .then(contas => res.json(contas))
         .catch(err => res.status(500).send(err))
   }

   //metodo getById
   const getById = (req, res) => {
      const cod = req.params.cod
      app.db('contas')
         .select('cod', 'nome')
         .where({ cod: cod })
         .then(contas => res.json(contas))
         .catch(err => res.status(500).send(err))
   }
   return { save, get, getById }
}