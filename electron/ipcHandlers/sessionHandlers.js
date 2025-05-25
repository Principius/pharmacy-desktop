import { shell } from 'electron'

export default function registerSessionHandlers(ipcMain, sessionService) {
  ipcMain.handle('get-current-session', async () => {
    try {
      const session = await sessionService.getCurrent()
      return session
    } catch (error) {
      console.error('Failed to retrieve session:', error)
      return null
    }
  })

  ipcMain.handle('open-external-link', async (_event, url) => {
    if (url) {
      await shell.openExternal(url)
    }
  })
}
