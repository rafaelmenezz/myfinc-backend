
exports.up = function(knex) {
   
   return knex.schema.createTable('familias', table => {
      table.increments('cod').primary()
      table.string('nome').notNull()
  })
};

exports.down = function(knex) {
   return knex.schema.dropTable('familias')
};