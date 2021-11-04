exports.up = function(knex) {
   return knex.schema.createTable('familias', table => {
      table.increments('codfamilia').primary()
      table.string('nomefamilia').notNull()
  })
};

exports.down = function(knex) {
   return knex.schema.dropTable('familias')
};