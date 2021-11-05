
exports.up = function(knex) {
   return knex.schema.createTable('contas', table => {
      table.increments('cod').primary()
      table.string('nome').notNull()
  })
};

exports.down = function(knex) {
   return knex.schema.dropTable('contas')
};