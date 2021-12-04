
exports.up = function (knex) {

   return knex.schema.createTable('montantes', table => {
      table.increments('cod').primary()
      table.string('pagamento').notNull()
      table.date('dt_vencimento').notNull().defaultTo(knex.raw('CURRENT_DATE'))
      table.decimal('valor').notNull()
      table.integer('codfinanca').notNull()
      table.foreign('codfinanca').references('financas.cod')


   })

};

exports.down = function (knex) {
   return knex.schema.dropTable('montantes')
}