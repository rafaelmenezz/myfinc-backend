
exports.up = function (knex) {

   return knex.schema.createTable('financas', table => {
      table.increments('cod').primary()
      table.string('descricao').notNull()
      table.integer('parentcod').references('cod')
         .inTable('financas')
      table.integer('codfamilia')
      table.integer('codusuario').notNull()
      table.foreign('codfamilia').references('familias.cod')
      table.foreign('codusuario').references('usuarios.cod')

   })
};

exports.down = function (knex) {
   return knex.schema.dropTable('financas')
};
