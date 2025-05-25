export default function users(db) {
  return {
    async findByEmail(email) {
      const user = await db('users').where({ email }).first()
      return user
    },

    async create({ name, email, phone, role, password }) {
      const [id] = await db('users').insert({
        name,
        email,
        phone,
        role,
        password
      })
      return { id }
    },
  }
}
