
exports.up = function (knex) {
   return knex.schema.createTable('familias', table => {
      table.integer('codconta').notNull()
      table.integer('codusuario').notNull()
      table.boolean('admin').notNull()
      table.foreign('codconta').references('contas.cod')
      table.foreign('codusuario').references('usuarios.cod')
   })
};

exports.down = function (knex) {
   return knex.schema.dropTable('familias')
};