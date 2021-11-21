
exports.up = function (knex) {
   return knex.schema.createTable('tpavisos', table => {
      table.increments('cod').primary()
      table.string('descricao').notNull()
   })
      .then(function (rows) {
         return knex('tpavisos').insert([{ descricao: 'Sistema' }, { descricao: 'Mensagem' }, { descricao: 'Convites' }])
      })
      .catch(function (error) { console.error(error); });
}

exports.down = function (knex) {
   return knex.schema.dropTable('tpavisos')
};
