
exports.up = function (knex) {
   return knex.schema.createTable('status', table => {
      table.increments('cod').primary()
      table.string('descricao').notNull()
   })
      .then(function (rows) {
         return knex('status').insert([{ descricao: 'Pedente' }, { descricao: 'Aceito' }, { descricao: 'Recusado' }])
      })
      .catch(function (error) { console.error(error); });
}

exports.down = function (knex) {
   return knex.schema.dropTable('status')
};
