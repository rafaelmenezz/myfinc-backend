
exports.up = function (knex) {

   return knex.schema.createTable('financas', table => {
      table.increments('cod').primary()
      table.string('descricao').notNull()
      table.integer('parentcod').references('cod')
         .inTable('financas')
      table.integer('codfamilia')
      table.integer('codusuario')
      table.foreign('codfamilia').references('familias.cod')
      table.foreign('codusuario').references('usuarios.cod')
   })
      .then(function (rows) {
         return knex('financas').insert([{ descricao: 'Despesas' }, { descricao: 'Receitas' }])
      })
      .catch(function (error) { console.error(error); });
};

exports.down = function (knex) {
   return knex.schema.dropTable('financas')
};
