

module.exports = {
    categoryWithChildren: `
       WITH RECURSIVE subfinancas (cod) AS (
           SELECT cod FROM financas WHERE cod = ?
           UNION ALL
           SELECT f.cod FROM subfinancas, financas f
               WHERE "parentcod" = subfinancas.cod
       )
       SELECT cod FROM subfinancas`,

    montantesAno: `SELECT
    (SELECT sum(m.valor) FROM montantes m
    INNER JOIN
    financas f on m.codfinanca = f.cod
     WHERE 
    EXTRACT(year FROM dt_vencimento ) =  ?  AND EXTRACT(month FROM dt_vencimento ) = ? 
    AND f.parentcod = 1 ) as despesas,
    (SELECT sum(m.valor) FROM montantes m
    INNER JOIN
    financas f on m.codfinanca = f.cod
     WHERE 
    EXTRACT(year FROM dt_vencimento ) =  ?  AND EXTRACT(month FROM dt_vencimento ) = ? 
    AND f.parentcod = 2) as Receitas`,

    totalMes: `SELECT SUM(M.valor) as Total FROM montantes M 
   INNER JOIN  
   financas F on M.codfinanca = F.cod
   WHERE EXTRACT(year FROM dt_vencimento) = ? AND EXTRACT(month FROM dt_vencimento ) = ? 
   AND F.codusuario = ? 
   AND F.parentcod = ?`


}