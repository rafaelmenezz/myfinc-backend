const queries = require('./queries')

module.exports = app => {
   const { existsOrError, notExistsOrError, equalsOrError } = app.api.validator
   //metodo post
   const save = async (req, res) => {
      const montante = { ...req.body }
      if (req.params.cod) montante.cod = req.params.cod

      if (montante.cod) {
         try {

            existsOrError(montante.codfinanca, "Finança não informado!")
            existsOrError(montante.pagamento, "Forma de pagamento não informado!")
            existsOrError(montante.valor, "Valor não informado!")

         } catch (msg) {
            return res.status(400).send(msg)
         }
         app.db('montantes')
            .update({
               cod: montante.cod,
               codfinanca: montante.codfinanca,
               dt_vencimento: montante.dt_vencimento,
               pagamento: montante.pagamento,
               valor: montante.valor
            })
            .where({ cod: montante.cod })
            .then(_ => res.status(200).send('Montante alterado com sucesso!'))
            .catch(err => res.status(500).send(err.message))
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
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err.message))
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
   const getUsuarioFamiliaMes = async (req, res) => {
      let ano = ''
      let mes = ''
      if (req.params.data) {
         data = req.params.data.split('-')
         ano = data[0]
         mes = data[1]
      } else {
         data = new Date()
         ano = data.getFullYear()
         mes = data.getMonth() + 1
      }

      let financas = {}
      financas.despesas = await app.db({ m: 'montantes' })
         .join({ f: 'financas' }, 'm.codfinanca', 'f.cod')
         .select('m.cod as codmontante', 'f.cod as codfinanca', 'f.descricao', 'm.pagamento', 'm.dt_vencimento', 'm.valor')
         .whereRaw('EXTRACT(year FROM m.dt_vencimento) = ? AND EXTRACT(month FROM m.dt_vencimento ) = ?', [ano, mes])
         .andWhere({ 'f.codusuario': req.params.cod }).andWhere({ 'f.codfamilia': req.params.codfamilia })
         .andWhere({ 'f.parentcod': 1 })
         .catch(err => res.status(500).send(err.message))

      financas.totaldespesas = await app.db({ m: 'montantes' })
         .join({ f: 'financas' }, 'm.codfinanca', 'f.cod')
         .sum(`m.valor as valor`)
         .whereRaw('EXTRACT(year FROM m.dt_vencimento) = ? AND EXTRACT(month FROM m.dt_vencimento ) = ?', [ano, mes])
         .andWhere({ 'f.codusuario': req.params.cod }).andWhere({ 'f.codfamilia': req.params.codfamilia })
         .andWhere({ 'f.parentcod': 1 }).first()
         .catch(err => res.status(500).send(err.message))


      financas.receitas = await app.db({ m: 'montantes' })
         .join({ f: 'financas' }, 'm.codfinanca', 'f.cod')
         .select('m.cod as codmontante', 'f.cod as codfinanca', 'f.descricao', 'm.pagamento', 'm.dt_vencimento', 'm.valor')
         .whereRaw('EXTRACT(year FROM m.dt_vencimento) = ? AND EXTRACT(month FROM m.dt_vencimento ) = ?', [ano, mes])
         .andWhere({ 'f.codusuario': req.params.cod }).andWhere({ 'f.codfamilia': req.params.codfamilia })
         .andWhere({ 'f.parentcod': 2 })
         .catch(err => res.status(500).send(err.message))

      financas.totalreceitas = await app.db({ m: 'montantes' })
         .join({ f: 'financas' }, 'm.codfinanca', 'f.cod')
         .sum(`m.valor as valor`)
         .whereRaw('EXTRACT(year FROM m.dt_vencimento) = ? AND EXTRACT(month FROM m.dt_vencimento ) = ?', [ano, mes])
         .andWhere({ 'f.codusuario': req.params.cod }).andWhere({ 'f.codfamilia': req.params.codfamilia })
         .andWhere({ 'f.parentcod': 2 }).first()
         .catch(err => res.status(500).send(err.message))

      res.status(200).send(financas)
   }
   const getUsuarioMes = async (req, res) => {
      let ano = ''
      let mes = ''
      if (req.params.data) {
         data = req.params.data.split('-')
         ano = data[0]
         mes = data[1]
      } else {
         data = new Date()
         ano = data.getFullYear()
         mes = data.getMonth() + 1
      }

      let financas = {}
      financas.despesas = await app.db({ m: 'montantes' })
         .join({ f: 'financas' }, 'm.codfinanca', 'f.cod')
         .select('m.cod as codmontante', 'f.cod as codfinanca', 'f.descricao', 'm.pagamento', 'm.dt_vencimento', 'm.valor')
         .whereRaw('EXTRACT(year FROM m.dt_vencimento) = ? AND EXTRACT(month FROM m.dt_vencimento ) = ?', [ano, mes])
         .andWhere({ 'f.codusuario': req.params.cod }).andWhere({ 'f.codfamilia': null })
         .andWhere({ 'f.parentcod': 1 })
         .catch(err => res.status(500).send(err.message))

      financas.totaldespesas = await app.db({ m: 'montantes' })
         .join({ f: 'financas' }, 'm.codfinanca', 'f.cod')
         .sum(`m.valor as valor`)
         .whereRaw('EXTRACT(year FROM m.dt_vencimento) = ? AND EXTRACT(month FROM m.dt_vencimento ) = ?', [ano, mes])
         .andWhere({ 'f.codusuario': req.params.cod }).andWhere({ 'f.codfamilia': null })
         .andWhere({ 'f.parentcod': 1 }).first()
         .catch(err => res.status(500).send(err.message))


      financas.receitas = await app.db({ m: 'montantes' })
         .join({ f: 'financas' }, 'm.codfinanca', 'f.cod')
         .select('m.cod as codmontante', 'f.cod as codfinanca', 'f.descricao', 'm.pagamento', 'm.dt_vencimento', 'm.valor')
         .whereRaw('EXTRACT(year FROM m.dt_vencimento) = ? AND EXTRACT(month FROM m.dt_vencimento ) = ?', [ano, mes])
         .andWhere({ 'f.codusuario': req.params.cod }).andWhere({ 'f.codfamilia': null })
         .andWhere({ 'f.parentcod': 2 })
         .catch(err => res.status(500).send(err.message))

      financas.totalreceitas = await app.db({ m: 'montantes' })
         .join({ f: 'financas' }, 'm.codfinanca', 'f.cod')
         .sum(`m.valor as valor`)
         .whereRaw('EXTRACT(year FROM m.dt_vencimento) = ? AND EXTRACT(month FROM m.dt_vencimento ) = ?', [ano, mes])
         .andWhere({ 'f.codusuario': req.params.cod }).andWhere({ 'f.codfamilia': null })
         .andWhere({ 'f.parentcod': 2 }).first()
         .catch(err => res.status(500).send(err.message))

      res.status(200).send(financas)
   }


   const getUsuarioAno = async (req, res) => {

      const dt = new Date()
      let financas ={}
   
      financas.totalreceitas = await app.db({ m: 'montantes' })
         .join({ f: 'financas' }, 'm.codfinanca', 'f.cod')
         .sum('m.valor as total')
         .whereRaw('EXTRACT(year FROM dt_vencimento ) = ' + dt.getFullYear()).andWhere({ 'f.parentcod': 2 }).first()

      financas.totaldespesas = await app.db({ m: 'montantes' })
         .join({ f: 'financas' }, 'm.codfinanca', 'f.cod')
         .sum('m.valor as total')
         .whereRaw('EXTRACT(year FROM dt_vencimento ) = ' + dt.getFullYear()).andWhere({ 'f.parentcod': 1 }).first()

      res.status(200).send(financas)
   }

   const getFamiliaMes = async (req, res) => {


      let data = ''
      if (req.params.data) {
         data = new Date(req.params.data)
      } else {
         data = new Date()
      }

      let financas = {}
      financas.despesas = await app.db({ m: 'montantes' })
         .join({ f: 'financas' }, 'm.codfinanca', 'f.cod')
         .select('m.cod as codmontante', 'f.cod as codfinanca', 'f.descricao', 'm.pagamento', 'm.dt_vencimento', 'm.valor')
         .whereRaw('EXTRACT(year FROM m.dt_vencimento) = ? AND EXTRACT(month FROM m.dt_vencimento ) = ?', [data.getFullYear(), data.getMonth() + 1])
         .andWhere({ 'f.codfamilia': req.params.cod })
         .andWhere({ 'f.parentcod': 1 })

      financas.totaldespesas = await app.db({ m: 'montantes' })
         .join({ f: 'financas' }, 'm.codfinanca', 'f.cod')
         .sum(`m.valor as valor`)
         .whereRaw('EXTRACT(year FROM m.dt_vencimento) = ? AND EXTRACT(month FROM m.dt_vencimento ) = ?', [hoje.getFullYear(), data.getMonth() + 1])
         .andWhere({ 'f.codfamilia': req.params.cod })
         .andWhere({ 'f.parentcod': 1 }).first()

      financas.receitas = await app.db({ m: 'montantes' })
         .join({ f: 'financas' }, 'm.codfinanca', 'f.cod')
         .select('m.cod as codmontante', 'f.cod as codfinanca', 'f.descricao', 'm.pagamento', 'm.dt_vencimento', 'm.valor')
         .whereRaw('EXTRACT(year FROM m.dt_vencimento) = ? AND EXTRACT(month FROM m.dt_vencimento ) = ?', [data.getFullYear(), data.getMonth() + 1])
         .andWhere({ 'f.codfamilia': req.params.cod })
         .andWhere({ 'f.parentcod': 2 })

      financas.totalreceitas = await app.db({ m: 'montantes' })
         .join({ f: 'financas' }, 'm.codfinanca', 'f.cod')
         .sum(`m.valor as valor`)
         .whereRaw('EXTRACT(year FROM m.dt_vencimento) = ? AND EXTRACT(month FROM m.dt_vencimento ) = ?', [hoje.getFullYear(), data.getMonth() + 1])
         .andWhere({ 'f.codfamilia': req.params.cod })
         .andWhere({ 'f.parentcod': 2 }).first()

      res.status(200).send(financas)
   }
   const getFamiliaAno = async (req, res) => {

      const month = new Array();
      month[0] = "Janeiro";
      month[1] = "Fevereiro";
      month[2] = "Março";
      month[3] = "Abril";
      month[4] = "Maio";
      month[5] = "Junho";
      month[6] = "Julho";
      month[7] = "Agosto";
      month[8] = "Setembro";
      month[9] = "Outubro";
      month[10] = "Novembro";
      month[11] = "Dezembro";

      const montante = { ...req.body }
      const dt = new Date(montante.data)
      let financas = {}
      for (let i = 0; i < month.length; i++) {
         let valor = await app.db.raw(
            `SELECT
               (SELECT sum(m.valor) 
               FROM montantes m INNER JOIN financas f 
               on m.codfinanca = f.cod
               WHERE 
               EXTRACT(year FROM dt_vencimento ) =  `+ dt.getFullYear() + `  
                  AND EXTRACT(month FROM dt_vencimento ) = `+ (i + 1) + ` 
                  AND f.parentcod = 1 AND codfamilia = `+ montante.codfamilia + ` ) 
                  as despesas,
               (SELECT sum(m.valor) FROM montantes m
               INNER JOIN
               financas f on m.codfinanca = f.cod
               WHERE 
               EXTRACT(year FROM m.dt_vencimento ) =  `+ dt.getFullYear() + `  
               AND EXTRACT(month FROM m.dt_vencimento ) = `+ (i + 1) + ` 
               AND f.parentcod = 2 AND f.codfamilia =  `+ montante.codfamilia + ` )
               as receitas`
         )

         financas[month[i]] = valor.rows[0]

      }

      res.status(200).send(financas)
   }

   return { save, remove, getUsuarioMes, getUsuarioFamiliaMes, getUsuarioAno, getFamiliaMes, getFamiliaAno }
}