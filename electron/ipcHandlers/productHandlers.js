import { ipcMain } from 'electron'
import * as productLogic from '../../logic/productLogic.js'  // adjust path accordingly
import syncProductsFromCloud from '../../logic/syncProductsFromCloud.js'
import db from '../db/connection.js';
import { differenceInDays, differenceInMonths, formatISO } from 'date-fns'

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

  ipcMain.handle('getExpiredProducts', async () => {
    try {
      const today = new Date().toISOString() // make sure to compare properly in SQLite
      const results = await db('products')
        .where('expire_date', '<', today)
        .andWhere('quantity_remained', '>', 0)
        .orderBy('expire_date', 'asc')

      return results
    } catch (error) {
      console.error('Failed to fetch expired products:', error)
      throw new Error('Failed to fetch expired products.')
    }
  })

  ipcMain.handle('getExpiringSoonProducts', async () => {
  try {
    const today = new Date()
    const limitDate = new Date()
    limitDate.setDate(today.getDate() + 120) // 120 days from today

    const results = await db('products')
      .where('expire_date', '>=', formatISO(today, { representation: 'date' }))
      .andWhere('expire_date', '<=', formatISO(limitDate, { representation: 'date' }))
      .andWhere('quantity_remained', '>', 0)
      .orderBy('expire_date', 'asc')

    // Add days/months left until expiration
    const enrichedResults = results.map(product => {
      const expireDate = new Date(product.expire_date)
      const totalDays = differenceInDays(expireDate, today)
      const monthsLeft = Math.floor(totalDays / 30)
      const daysLeft = totalDays % 30

      return {
        ...product,
        monthsLeft,
        daysLeft,
        expiresIn: `${monthsLeft} month(s) ${daysLeft} day(s)`,
      }
    })

    return enrichedResults
  } catch (error) {
    console.error('Failed to fetch expiring products:', error)
    throw new Error('Failed to fetch expiring soon products.')
  }
})

}
