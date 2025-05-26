import { app, BrowserWindow, dialog } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { autoUpdater } from 'electron-updater'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function start() {
  // Dynamically import and run IPC handlers setup
  const ipcHandlersModule = await import('./ipcHandlers/ipcHandlers.js')
  ipcHandlersModule.default()

  let win

  function createWindow() {
    win = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true
      }
    })

    win.loadURL('http://localhost:5173')

    // Optional: Open dev tools automatically in dev mode
    // win.webContents.openDevTools()
  }

  // Auto-updater setup
  function setupAutoUpdater() {
    autoUpdater.autoDownload = false // Set to true if you want auto-download

    autoUpdater.on('checking-for-update', () => {
      console.log('Checking for updates...')
    })

    autoUpdater.on('update-available', (info) => {
      console.log('Update available:', info.version)
      // Prompt user to download update
      dialog.showMessageBox(win, {
        type: 'info',
        title: 'Update Available',
        message: `Version ${info.version} is available. Do you want to download it now?`,
        buttons: ['Yes', 'Later']
      }).then(result => {
        if (result.response === 0) {
          autoUpdater.downloadUpdate()
        }
      })
    })

    autoUpdater.on('update-not-available', () => {
      console.log('No updates available')
    })

    autoUpdater.on('error', (err) => {
      console.error('Error in auto-updater:', err)
    })

    autoUpdater.on('download-progress', (progressObj) => {
      let log_message = `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${Math.round(progressObj.percent)}% (${progressObj.transferred}/${progressObj.total})`
      console.log(log_message)
      // Optionally send this progress to renderer process if you want UI feedback
    })

    autoUpdater.on('update-downloaded', () => {
      console.log('Update downloaded')
      dialog.showMessageBox(win, {
        type: 'info',
        title: 'Update Ready',
        message: 'Update downloaded, application will quit and install now.',
        buttons: ['Restart']
      }).then(() => {
        setImmediate(() => autoUpdater.quitAndInstall())
      })
    })
  }

  app.whenReady().then(() => {
    createWindow()
    setupAutoUpdater()

    // Check for updates after the app is ready
    autoUpdater.checkForUpdates()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}

start()
