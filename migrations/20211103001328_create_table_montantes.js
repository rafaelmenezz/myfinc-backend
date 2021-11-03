
exports.up = function (knex) {

   return knex.schema.createTable('montantes', table => {
      table.increments('codmontante').primary()
      table.string('formapagamento').notNull()
      table.date('vencimento').notNull().defaultTo(knex.raw('CURRENT_DATE'))
      table.decimal('valor').notNull()
      table.integer('codfinanca').notNull()
      table.foreign('codfinanca').references('financas.codfinanca')

   })

};

exports.down = function (knex) {
   return knex.schema.dropTable('montantes')
};
