const bcrypt = require('bcrypt')

module.exports = app => {
   const { existsOrError, notExistsOrError, equalsOrError } = app.api.validator

   //metodo post
   const save = async (req, res) => {
      const montante = { ...req.body }
      if (req.params.cod) montante.cod = req.params.cod

      if (montante.cod) {
         try {
            existsOrError(montante.pagamento, "Forma de pagamento não informado!")
            existsOrError(montante.valor, "Valor não informado!")

         } catch (msg) {
            return res.status(400).send(msg)
         }
         app.db('montantes')
            .update({
               pagamento: montante.pagamento,
               dt_vencimento: montante.dt_vencimento,
               valor: montante.valor,
               codfinanca: montante.codfinanca
            })
            .where({ cod: montante.cod })
            .then(_ => res.status(200).send('Montante alterado com sucesso!'))
            .catch(err => res.status(500).send('Falha no servidor!'))
      } else {
         try {
            existsOrError(montante.pagamento, "Pagamento não informado!")
            existsOrError(montante.valor, "Valor não informado!")
            existsOrError(montante.codfinanca, "Finança não informado!")

         } catch (msg) {
            return res.status(400).send(msg)
         }

         app.db('montantes')
            .insert(montante, 'cod').into('montantes')
            .then(cod => res.json(cod[0]))
            .catch(err => res.status(500).send('Falha no servidor!'))
      }

   }
   const remove = async (req, res) => {
      try {

         const rowDeleted = await app.db('montantes')
            .where({ cod: req.params.cod }).del()
         existsOrError(rowDeleted, 'Dados não encontrado.')

         res.status(200).send('Dados deletado com sucesso.')

      } catch (msg) {
         return res.status(400).send(msg)
      }
   }

   return { save, remove }
}