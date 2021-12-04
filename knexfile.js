
//  Update with your config settings.
const { db } = require('./.env')

module.exports = {

  development: {
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
  },
  production: {
    client: 'postgresql',
    version: '8.6.0',
    connection: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }


};