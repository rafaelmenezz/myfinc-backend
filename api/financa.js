
const queries = require('./queries')

module.exports = app => {
   const { existsOrError, notExistsOrError } = app.api.validator

   //metodo post
   const save = async (req, res) => {
      const financa = { ...req.body }

      //  if (!financa.codfamilia) financa.codfamilia = 0

      try {
         existsOrError(financa.descricao, "Descricao não informado!")
         existsOrError(financa.codusuario, "Usuário não informado!")
         // const familiaFromDB = await app.db('familias')
         //    .where({ cod: financa.codfamilia }).first()
         // if (!familiaFromDB.cod) {
         //    notExistsOrError(familiaFromDB, 'Familia não encontrada')
         // }
      } catch (msg) {
         return res.status(400).send(msg)
      }

      app.db('financas')
         .insert(financa)
         .then(_ => res.status(200).send('Finança ' + financa.descricao + ' cadastrada com sucesso!'))
         .catch(err => res.status(500).send('Erro: ' + err.message))
   }

   const update = (req, res) => {
      const financa = { ...req.body }

      try {
         existsOrError(financa.descricao, "Descrição não informado!")
         existsOrError(financa.codusuario, "Usuário não informado!")
      } catch (msg) {
         return res.status(400).send(msg)
      }
      app.db('financas')
         .update(financa)
         .where({ cod: req.params.cod })
         .then(_ => res.status(200).send('Dados da finanças alterado com sucesso!'))
         .catch(err => res.status(500).send(err.message))
   }

   const remove = async (req, res) => {
      try {
         existsOrError(req.params.cod, 'Código da finança não informado.')

         const subfinanca = await app.db('financas')
            .where({ parentcod: req.params.cod })
         notExistsOrError(subfinanca, 'Finanças possui subfinanças cadastradas')

         const montantes = await app.db('montantes')
            .where({ codfinanca: req.params.cod })
         notExistsOrError(montantes, 'Finança possui montantes.')

         const rowDeleted = await app.db('financas')
            .where({ cod: req.params.cod }).del()
         existsOrError(rowDeleted, 'Finança não encontrada.')

         res.status(200).send('Finança deletada com sucesso.')

      } catch (msg) {
         return res.status(400).send(msg)
      }
   }

   const withPath = financas => {
      const getParent = (financas, parentcod) => {
         let parent = financas.filter(parent => parent.cod === parentcod)
         return parent.length ? parent[0] : null
      }

      const financasWithPath = financas.map(financa => {
         let path = financa.descricao
         let parent = getParent(financas, financa.parentcod)

         while (parent) {
            path = `${parent.descricao} > ${path}`
            parent = getParent(financas, parent.parentcod)
         }

         return { ...financa, path }

      })

      financasWithPath.sort((a, b) => {
         if (a.path < b.path) return -1
         if (a.path > b.path) return 1
         return 0
      })

      return financasWithPath
   }

   const getFamilia = (req, res) => {
      // const user = { ...req.body }
      app.db('financas')
         .where({ codfamilia: req.params.familia })
         .then(financas => res.json(withPath(financas)))
         .catch(err => res.status(500).send(err))
   }

   const getById = (req, res) => {
      app.db('financas')
         .where({ cod: req.params.cod }).andWhere({ codusuario: req.params.usuario })
         .first()
         .then(financas => res.json(financas))
         .catch(err => res.status(500).send(err.message))
   }

   const getByMontantes = async (req, res) => {
      const financasCod = req.params.cod
      const financas = await app.db.raw(queries.categoryWithChildren, financasCod)
      const cods = financas.rows.map(c => c.cod)

      app.db({ m: 'montantes', f: 'financas' })
         .select('m.cod', 'm.pagamento', 'm.dt_vencimento', 'm.valor', { financa: 'f.descricao' })
         .whereRaw('?? = ??', ['m.codfinanca', 'f.cod'])
         .whereIn('parentcod', cods)
         .orderBy('m.cod', 'desc')
         .then(financas => res.json(financas))
         .catch(err => res.status(500).send(err.message))
   }
   return { save, update, remove, getByMontantes }
}