exports.up = function (knex) {
   return knex.schema.createTable('financas', table => {
      table.increments('codfinanca').primary()
      table.string('descricao').notNull()
      table.integer('financa')
      table.integer('codconta').notNull()
      table.integer('codusuario').notNull()
      table.foreign('codconta').references('contas.codconta')
      table.foreign('codusuario').references('usuarios.codusuario')

   })
};

exports.down = function (knex) {
   return knex.schema.dropTable('financas')
};
