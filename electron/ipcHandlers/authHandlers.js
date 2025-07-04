// authHandlers.js
import loginUser from '../../logic/loginUser.js'

let currentLoggedInUser = null

export default function authHandlers(ipcMain) {
  ipcMain.handle('login-user', async (_event, credentials) => {
    try {
      const result = await loginUser(credentials)

      // Sanitize what's stored as session user
      currentLoggedInUser = {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        permissions: result.user.permissions || [],
        role: result.user.role
      }

      return { success: true, user: currentLoggedInUser }
    } catch (err) {
      return { success: false, error: err.message }
    }
  })

  ipcMain.handle('get-logged-in-user', async () => {
    return currentLoggedInUser
  })
}
