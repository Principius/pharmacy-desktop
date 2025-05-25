import db from '../electron/db/connection.js'
import users from '../electron/db/queries/users.js'
import bcrypt from 'bcryptjs'

export default async function registerUser({ name, email, phone, role, password }) {
  if (!name || !email || !password) {
    throw new Error('Name, Email, and Password are required')
  }

  const existing = await users(db).findByEmail(email)
  if (existing) {
    throw new Error('Email already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await users(db).create({ name, email, phone, role, password: hashedPassword })

  return { success: true }
}
