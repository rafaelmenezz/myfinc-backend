module.exports = {
   categoryWithChildren: `
       WITH RECURSIVE subfinancas (cod) AS (
           SELECT cod FROM financas WHERE cod = ?
           UNION ALL
           SELECT f.cod FROM subfinancas, financas f
               WHERE "parentcod" = subfinancas.cod
       )
       SELECT cod FROM subfinancas
   `
}