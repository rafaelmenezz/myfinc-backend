exports.up = function (knex) {
   return knex.schema.createTable('familias', table => {
      table.integer('codconta').notNull()
      table.integer('codusuario').notNull()
      table.boolean('admin').notNull()
      table.foreign('codconta').references('contas.codconta')
      table.foreign('codusuario').references('usuarios.codusuario')
   })
};

exports.down = function (knex) {
   return knex.schema.dropTable('familias')
};