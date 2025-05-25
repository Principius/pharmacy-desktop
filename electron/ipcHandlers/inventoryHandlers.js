// inventoryHandlers.js
import { getGroupedInventory } from '../../logic/inventoryLogic.js'
import db from '../../electron/db/connection.js'

export default function registerInventoryHandlers(ipcMain) {
  ipcMain.handle('getGroupedInventory', async () => {
    return getGroupedInventory(db)
  })
}
