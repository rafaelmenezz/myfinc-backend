exports.up = function (knex) {
   return knex.schema.createTable('financas', table => {
      table.increments('cod').primary()
      table.string('descricao').notNull()
      table.integer('financa_pai')
      table.integer('codconta').notNull()
      table.integer('codusuario').notNull()
      table.foreign('codconta').references('contas.cod')
      table.foreign('codusuario').references('usuarios.cod')

   })
};

exports.down = function (knex) {
   return knex.schema.dropTable('financas')
};