import { getLowStockProducts } from '../../logic/lowStockLogic.js'
import db  from '../../electron/db/connection.js'

export default function registerLowStockHandlers(ipcMain) {
  ipcMain.handle('getLowStockProducts', async () => {
    return getLowStockProducts(db)
  })
}
