 
// Update with your config settings.
const { db } = require('./.env')

module.exports = {
  client: 'postgresql',
  version: '8.6.0',
  connection: db,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};