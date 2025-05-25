/**
 * @type { import('knex').Knex.Config }
 */
const config = {
  development: {
    client: 'sqlite3', // better-sqlite3-compatible
    connection: {
      filename: './electron/pharmacy.db'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './electron/db/migrations'
    }
  },

  staging: {
    client: 'sqlite3',
    connection: {
      filename: './staging.sqlite3'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './electron/db/migrations'
    }
  },

  production: {
    client: 'sqlite3',
    connection: {
      filename: './prod.sqlite3'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './electron/db/migrations'
    }
  }
}

export default config
