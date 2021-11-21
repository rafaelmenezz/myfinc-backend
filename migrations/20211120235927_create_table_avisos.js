
exports.up = function (knex) {
   return knex.schema.createTable('avisos', table => {
      table.increments('cod').primary()
      table.integer('tipo').notNull()
      table.integer('codusuario')
      table.integer('codfamilia')
      table.boolean('lida')
      table.string('mensagem')
      table.string('email')
      table.foreign('codusuario').references('usuarios.cod')
      table.foreign('codfamilia').references('familias.cod')
      table.foreign('tipo').references('tpavisos.cod')
   })
};

exports.down = function (knex) {
   return knex.schema.dropTable('avisos')
};
