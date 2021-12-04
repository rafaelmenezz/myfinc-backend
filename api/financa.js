
const queries = require('./queries')

module.exports = app => {
   const { existsOrError, notExistsOrError } = app.api.validator

   //metodo post
   const save = async (req, res) => {
      const financa = { ...req.body }

      try {
         existsOrError(financa.descricao, "Descricao não informado!")
         existsOrError(financa.codusuario, "Usuário não informado!")
         existsOrError(financa.parentcod, "Tipo de finança não informado!")

      } catch (msg) {
         return res.status(400).send(msg)
      }
      app.db('financas')
         .insert(financa, 'cod').into('financas')
         .then(cod => res.json({ cod: cod[0] }))
         .catch(err => res.status(500).send('Erro: ' + err.message))
   }

   const update = (req, res) => {
      const financa = { ...req.body }

      try {
         existsOrError(financa.descricao, "Descrição não informado!")
      } catch (msg) {
         return res.status(400).send(msg)
      }
      app.db('financas')
         .update({
            descricao: financa.descricao
         })
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

   const getById = (req, res) => {
      app.db('financas')
         .select('cod', 'descricao', 'parentcod')
         .where({ codusuario: req.params.cod }).orWhere({ codusuario: null })
         .then(financas => res.json(withPath(financas)))
         .catch(err => res.status(500).send(err))
   }

   const getByUser = async (req, res) => {
      const financas = {}

      financas.receitas = await app.db('financas')
         .where({ codusuario: req.params.cod }).andWhere({ codfamilia: null }).andWhere({ parentcod: 2 })
         .catch(err => res.status(500).send(err.message))
      financas.despesas = await app.db('financas')
         .where({ codusuario: req.params.cod }).andWhere({ codfamilia: null }).andWhere({ parentcod: 1 })
         .catch(err => res.status(500).send(err.message))

      res.json(financas)

   }

   const getFamilia = async (req, res) => {
      const financas = {}

      financas.receitas = await app.db('financas')
         .where({ codfamilia: req.params.cod }).andWhere({ parentcod: 2 })
         .catch(err => res.status(500).send(err.message))
      financas.despesas = await app.db('financas')
         .where({ codfamilia: req.params.cod }).andWhere({ parentcod: 1 })
         .catch(err => res.status(500).send(err.message))

      res.json(financas)

   }



   const getUsuarioFamilia = async (req, res) => {
      const financas = {}

      financas.receitas = await app.db('financas')
         .where({ codfamilia: req.params.codfamilia }).andWhere({ codusuario: req.params.codusuario }).andWhere({ parentcod: 2 })
         .catch(err => res.status(500).send(err.message))
      financas.despesas = await app.db('financas')
         .where({ codfamilia: req.params.codfamilia }).andWhere({ codusuario: req.params.codusuario }).andWhere({ parentcod: 1 })
         .catch(err => res.status(500).send(err.message))

      res.json(financas)

   }

   const getFamiliaMontantes = async (req, res) => {

      const financas = {}


      // financas.receitas = await app.db('financas')
      //    .where({ codfamilia: req.params.cod }).andWhere({ parentcod: 2 })
      //    .catch(err => res.status(500).send(err.message))
      // financas.despesas = await app.db('financas')
      //    .where({ codfamilia: req.params.cod }).andWhere({ parentcod: 1 })
      //    .catch(err => res.status(500).send(err.message))

      // financas.despesas = await app.db({ f: 'financas' })
      //    .join({ m: 'montantes' }, 'f.cod', 'm.codfinanca')
      //    .join({ u: 'usuarios' }, 'f.codusuario', 'u.cod')
      //    .select('f.cod', 'f.descricao', 'u.cod', 'u.nome', 'u.email', 'm.pagamento', 'm.dt_vencimento', 'm.valor')
      //    .where({ 'f.codfamilia': req.params.cod }).andWhere({ parentcod: 1 })
      //    .catch(err => res.status(500).send(err.message))

      financas.receitas = await app.db({ f: 'financas' })
         .join({ m: 'montantes' }, 'f.cod', 'm.codfinanca')
         .join({ u: 'usuarios' }, 'f.codusuario', 'u.cod')
         .select('f.cod', 'f.descricao', 'u.cod', 'u.nome', 'u.email', 'm.pagamento', 'm.dt_vencimento', 'm.valor')
         .where({ 'f.codfamilia': req.params.cod }).andWhere({ parentcod: 2 })
         .catch(err => res.status(500).send(err.message))

      financas.despesas = await app.db({ f: 'financas' })
         .join({ m: 'montantes' }, 'f.cod', 'm.codfinanca')
         .join({ u: 'usuarios' }, 'f.codusuario', 'u.cod')
         .select('f.cod', 'f.descricao', 'u.cod', 'u.nome', 'u.email', 'm.pagamento', 'm.dt_vencimento', 'm.valor')
         .where({ 'f.codfamilia': req.params.cod }).andWhere({ parentcod: 1 })
         .catch(err => res.status(500).send(err.message))

      res.json(financas)
   }

   const getByUsuario = async (req, res) => {
      const financas = {}

      financas.receitas = await app.db({ f: 'financas' })
         .join({ m: 'montantes' }, 'f.cod', 'm.codfinanca')
         .join({ u: 'usuarios' }, 'f.codusuario', 'u.cod')
         .select('f.cod', 'f.descricao', 'm.pagamento', 'm.dt_vencimento', 'm.valor')
         .where({ codusuario: req.params.cod }).andWhere({ parentcod: 2 })
         .catch(err => res.status(500).send(err.message))

      financas.despesas = await app.db({ f: 'financas' })
         .join({ m: 'montantes' }, 'f.cod', 'm.codfinanca')
         .join({ u: 'usuarios' }, 'f.codusuario', 'u.cod')
         .select('f.cod', 'f.descricao', 'm.pagamento', 'm.dt_vencimento', 'm.valor')
         .where({ 'f.codusuario': req.params.cod }).andWhere({ parentcod: 1 })
         .catch(err => res.status(500).send(err.message))

      res.json(financas)
   }

   const getByMontantes = async (req, res) => {
      await app.db({ m: 'montantes' })
         .join({ f: 'financas' }, 'm.codfinanca', 'f.cod')
         .select('m.cod as codmontante', 'f.cod as codfinanca', 'f.descricao', 'm.pagamento', 'm.dt_vencimento', 'm.valor')
         .where({ 'm.cod': req.params.cod }).first()
         .then(financas => res.json(financas))
         .catch(err => res.status(500).send(err.message))

   }

   const getByDespesas = async (req, res) => {
      const financas = await app.db.raw(queries.categoryWithChildren, 1)
      const cods = financas.rows.map(c => c.cod)

      app.db({ m: 'montantes', f: 'financas' })
         .select('m.cod', 'm.pagamento', 'm.dt_vencimento', 'm.valor', { financa: 'f.descricao' })
         .whereRaw('?? = ??', ['m.codfinanca', 'f.cod'])
         .where({ 'm.codfamilia': req.params.cod })
         .whereIn('parentcod', cods)
         .orderBy('m.cod', 'desc')
         .then(financas => res.json(financas))
         .catch(err => res.status(500).send(err.message))
   }
   const getByReceitas = async (req, res) => {
      const financas = await app.db.raw(queries.categoryWithChildren, 2)
      const cods = financas.rows.map(c => c.cod)

      app.db({ m: 'montantes', f: 'financas' })
         .select('m.cod', 'm.pagamento', 'm.dt_vencimento', 'm.valor', { financa: 'f.descricao' })
         .whereRaw('?? = ??', ['m.codfinanca', 'f.cod'])
         .where({ 'm.codusuario': req.params.cod })
         .whereIn('parentcod', cods)
         .orderBy('m.cod', 'desc')
         .then(financas => res.json(financas))
         .catch(err => res.status(500).send(err.message))
   }
   return { save, update, remove, getByMontantes, getFamilia, getById, getByUser, getByMontantes, getFamiliaMontantes, getUsuarioFamilia }
}