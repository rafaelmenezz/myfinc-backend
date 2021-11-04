exports.up = function (knex) {
   return knex.schema.createTable('familias_usuarios', table => {
      table.integer('codfamilia').notNull()
      table.integer('codusuario').notNull()
      table.boolean('admin').notNull()
      table.foreign('codfamilia').references('familias.codfamilia')
      table.foreign('codusuario').references('usuarios.codusuario')
   })
};

exports.down = function (knex) {
   return knex.schema.dropTable('familias')
};