import users from '../electron/db/queries/users.js'
import db from '../electron/db/connection.js'
import bcrypt from 'bcryptjs'

export default async function loginUser({ email, password }) {
  if (!email || !password) throw new Error('Email and Password are required')

  const user = await users(db).findByEmail(email)
  if (!user) throw new Error('No user found with this email')

  const valid = bcrypt.compareSync(password, user.password)
  if (!valid) throw new Error('Incorrect password')

  return { success: true, user }
}
