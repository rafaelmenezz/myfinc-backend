exports.up = function(knex) {
   return knex.schema.createTable('contas', table => {
      table.increments('codconta').primary()
      table.string('nomeconta').notNull()
  })
};

exports.down = function(knex) {
   return knex.schema.dropTable('contas')
};
