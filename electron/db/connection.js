import path from 'path'
import { fileURLToPath } from 'url'
import knex from 'knex'

// Emulate __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, '..', 'pharmacy.db'),
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.join(__dirname, 'migrations'),
  },
})

// Automatically run latest migrations
db.migrate
  .latest()
  .then(() => console.log('Migrations completed.'))
  .catch((err) => console.error('Migration error:', err))

export default db
