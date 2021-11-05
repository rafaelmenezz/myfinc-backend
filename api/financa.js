

module.exports = app => {
   const { existsOrError, notExistsOrError } = app.api.validator


   //metodo post
   const save = async (req, res) => {
      const financa = { ...req.body }
      if (req.params.cod) financa.cod = req.params.cod

      if (financa.cod) {
         try {
            existsOrError(financa.descricao, "Descrição não informado!")
            existsOrError(financa.codusuario, "Usuário não informado!")
         } catch (msg) {
            return res.status(400).send(msg)
         }
         app.db('financas')
            .update({
               descricao: financa.descricao,
               parentcod: financa.parentcod,
               codconta: financa.codconta,
               codusuario: financa.codusuario
            })
            .where({ cod: financa.cod })
            .then(_ => res.status(200).send('Dados da finanças alterado com sucesso!'))
            .catch(err => res.status(500).send(err.message))
      } else {
         try {
            existsOrError(financa.descricao, "Descricao não informado!")
            existsOrError(financa.codusuario, "Usuário não informado!")
         } catch (msg) {
            return res.status(400).send(msg)
         }

         app.db('financas')
            .insert(financa)
            .then(_ => res.status(200).send('Finança ' + financa.descricao + ' cadastrada com sucesso!'))
            .catch(err => res.status(500).send(err.message))
      }

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

   const get = (req, res) => {
      app.db('financas')
         .then(financas => res.json(withPath(financas)))
         .catch(err => res.status(500).send(err))
   }

   const getById = (req, res) => {
      app.db('financas')
         .where({ cod: req.params.cod })
         .first()
         .then(financa => res.json(financa))
         .catch(err => res.status(500).send(err))
   }
   return { save, remove, get, getById }
}