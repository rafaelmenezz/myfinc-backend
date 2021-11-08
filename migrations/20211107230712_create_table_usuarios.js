
exports.up = function (knex) {

   return knex.schema.createTable('usuarios', table => {
      table.increments('cod').primary()
      table.string('nome').notNull()
      table.string('telefone')
      table.string('email').notNull()
      table.string('senha').notNull()
   })
};

exports.down = function (knex) {
   return knex.schema.dropTable('usuarios')
};