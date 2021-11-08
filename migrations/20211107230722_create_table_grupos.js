
exports.up = function (knex) {
   
   return knex.schema.createTable('grupos', table => {
      table.integer('codfamilia').notNull()
      table.integer('codusuario').notNull()
      table.boolean('admin').notNull()
      table.foreign('codfamilia').references('familias.cod')
      table.foreign('codusuario').references('usuarios.cod')
   })
};

exports.down = function (knex) {
   return knex.schema.dropTable('grupos')
};