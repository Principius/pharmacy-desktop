import loginUser from '../../logic/loginUser.js'

let currentLoggedInUser = null

export default function authHandlers(ipcMain) {
  ipcMain.handle('login-user', async (_event, credentials) => {
    try {
      const result = await loginUser(credentials)
      currentLoggedInUser = result.user
      return { success: true, user: result.user }
    } catch (err) {
      return { success: false, error: err.message }
    }
  })

  ipcMain.handle('get-logged-in-user', async () => {
    return currentLoggedInUser
  })
}
