exports.up = function (knex) {
   return knex.schema.createTable('financas', table => {
      table.increments('codfinanca').primary()
      table.string('descricao').notNull()
      table.integer('financa')
      table.integer('codfamilia').notNull()
      table.integer('codusuario').notNull()
      table.foreign('codfamilia').references('familias.codfamilia')
      table.foreign('codusuario').references('usuarios.codusuario')

   })
};

exports.down = function (knex) {
   return knex.schema.dropTable('financas')
};