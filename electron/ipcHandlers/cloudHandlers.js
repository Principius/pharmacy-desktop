// userHandlers.js
import loginAndSync from '../../logic/cloudLogic.js' // Adjust path
import db from '../../electron/db/connection.js'
import sessions from '../../electron/db/queries/sessions.js'

export default function cloudUserHandlers(ipcMain) {
  ipcMain.handle('cloud-login-user', async (event, { email, password, deviceName, tenantSubdomain }) => {
    if (!email || !password || !tenantSubdomain || !deviceName) {
      throw new Error('Missing required login parameters')
    }

    try {
      const result = await loginAndSync({ email, password, deviceName, tenantSubdomain })

      // Save or update session info locally in SQLite (inside loginAndSync or here)
      await sessions(db).createOrUpdate({
        tenant_id: result.tenant_id,
        device_id: result.device_id,
        access_token: result.access_token,
        tenant_url: result.tenant_url,
      })

      return result
    } catch (error) {
      throw new Error(error.message || 'Login failed')
    }
  })

  // Add other user-related handlers if needed...
}
