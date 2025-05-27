import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import pkg from 'electron-updater'
const { autoUpdater } = pkg

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ✅ Set userData path BEFORE app is ready
app.setPath('userData', path.join(app.getPath('appData'), 'AfyaTrack'))

// ✅ Redirect cache path to a writable location inside userData
const userDataPath = app.getPath('userData')
app.setPath('cache', path.join(userDataPath, 'cache'))

async function start() {
  // Dynamic import of other handlers
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

    if (process.env.NODE_ENV === 'development') {
      win.loadURL('http://localhost:5173')
    } else {
      win.loadFile(path.join(__dirname, '../dist/index.html'))
    }
  }

  function setupAutoUpdater() {
    autoUpdater.autoDownload = false

    autoUpdater.on('checking-for-update', () => {
      console.log('Checking for updates...')
    })

    autoUpdater.on('update-available', (info) => {
      console.log('Update available:', info.version)
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
      const log_message = `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${Math.round(progressObj.percent)}% (${progressObj.transferred}/${progressObj.total})`
      console.log(log_message)
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
    autoUpdater.checkForUpdates()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

  // ✅ IPC handler to restart the app (proper relaunch)
  ipcMain.handle('restart-app', () => {
    app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
    app.exit(0)
  })
}

start()
