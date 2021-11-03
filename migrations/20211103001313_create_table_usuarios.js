exports.up = function (knex) {
   return knex.schema.createTable('usuarios', table => {
      table.increments('codusuario').primary()
      table.string('nome').notNull()
      table.string('email').notNull()
      table.string('telefone')
      table.string('login').notNull()
      table.string('senha').notNull()
   })
};

exports.down = function (knex) {
   return knex.schema.dropTable('usuarios')
};
