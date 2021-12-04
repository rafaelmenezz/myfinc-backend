exports.up = function (knex) {
   return knex.schema.createTable('convites', table => {
      table.increments('cod').primary()
      table.integer('status').notNull()
      table.integer('codusuario')
      table.integer('codfamilia')
      table.string('email')
      table.foreign('codusuario').references('usuarios.cod')
      table.foreign('codfamilia').references('familias.cod')
      table.foreign('status').references('status.cod')
   })
};

exports.down = function (knex) {
   return knex.schema.dropTable('convites')
};