import path from 'path'
import { fileURLToPath } from 'url'
import knex from 'knex'
import { app } from 'electron'

// Emulate __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Get Electron's userData path (safe for read/write)
const userDataPath = app.getPath('userData')

// Path to the SQLite file inside the userData directory
const dbPath = path.join(userDataPath, 'pharmacy.db')

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.join(__dirname, 'migrations'),
  },
})

db.migrate
  .latest()
  .then(() => console.log('Migrations completed.'))
  .catch((err) => console.error('Migration error:', err))

export default db
