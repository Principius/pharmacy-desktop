import { ipcMain } from 'electron'
import * as productLogic from '../../logic/productLogic.js'  // adjust path accordingly
import syncProductsFromCloud from '../../logic/syncProductsFromCloud.js'

export default function registerProductHandlers() {
  ipcMain.handle('create-product', async (_event, productData) => {
    try {
      const result = await productLogic.createProduct(productData)
      return { success: true, productId: result.productId }
    } catch (err) {
      return { success: false, error: err.message }
    }
  })

  ipcMain.handle('read-products', async () => {
    try {
      const products = await productLogic.getProducts()
      return { success: true, products }
    } catch (err) {
      return { success: false, error: err.message }
    }
  })

  ipcMain.handle('update-product', async (_event, { id, updates }) => {
    try {
      const result = await productLogic.updateProduct(id, updates)
      return { success: true, changes: result.changes }
    } catch (err) {
      return { success: false, error: err.message }
    }
  })

  ipcMain.handle('delete-product', async (_event, id) => {
    try {
      const result = await productLogic.deleteProduct(id)
      return { success: true, changes: result.changes }
    } catch (err) {
      return { success: false, error: err.message }
    }
  })

  ipcMain.handle('products:sync-from-cloud', async () => {
  return await syncProductsFromCloud()
})
}
