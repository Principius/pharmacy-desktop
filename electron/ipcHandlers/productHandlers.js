import { ipcMain } from 'electron'
import * as productLogic from '../../logic/productLogic.js'  // adjust path accordingly
import syncProductsFromCloud from '../../logic/syncProductsFromCloud.js'
import db from '../db/connection.js';
import { differenceInDays, differenceInMonths, formatISO } from 'date-fns'
import { isAfter, isBefore, addDays } from 'date-fns'
import syncSummariesFromCloud from '../../logic/syncSummariesFromCloud.js';
import syncFinancialSummaries from '../../logic/syncFinancialSummaries.js';
import syncProductProfits from '../../logic/syncProductProfits.js';
import getLatestProducts from '../../logic/getLatestProducts.js';
import changeProduct from '../../logic/updateProducts.js';

export default function registerProductHandlers() {
  ipcMain.handle('create-product', async (_event, productData) => {
    try {
      const result = await productLogic.createProduct(productData)
      return { success: true, productId: result.productId }
    } catch (err) {
      return { success: false, error: err.message }
    }
  })

  ipcMain.handle('product:get-expiry-stats', async () => {
    const now = new Date().toISOString()

    const [expired] = await db('products')
      .whereNotNull('expire_date')
      .where('expire_date', '<', now)
      .count('id as count')

    const [available] = await db('products')
      .where(builder => {
        builder.whereNull('expire_date').orWhere('expire_date', '>=', now)
      })
      .count('id as count')

    return {
      expired: expired.count || 0,
      available: available.count || 0,
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

  ipcMain.handle('summaries:sync-from-cloud', async () => {
    return await syncSummariesFromCloud()
  })

  ipcMain.handle('financials:sync-from-cloud', async () => {
    return await syncFinancialSummaries()
  })

  ipcMain.handle('financials:get-latest', async () => {
    return await db('financial_summaries')
      .orderBy('sync_at', 'desc')
      .first()
  })

  ipcMain.handle('summaries:get-latest', async () => {
    return await db('summaries')
      .orderBy('synced_at', 'desc')
      .first()
  })

  ipcMain.handle('product-profits:get-latest', async () => {
    return await db('product_profits')
      .orderBy('updated_at', 'desc')
      .first()
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

  ipcMain.handle('products:get-dashboard-stats', async () => {
    try {
      const today = new Date()
      const todayStr = today.toISOString()
      const futureDate = addDays(today, 180).toISOString()

      // Available (not expired and in stock)
      const available = await db('products')
        .where('expire_date', '>=', todayStr)
        .andWhere('quantity_remained', '>', 0)
        .count('id as count')
        .first()

      // Expired
      const expired = await db('products')
        .where('expire_date', '<', todayStr)
        .andWhere('quantity_remained', '>', 0)
        .count('id as count')
        .first()

      // Low Stock
      const lowStock = await db('products')
        .whereRaw('quantity_remained <= minimum_stock')
        .andWhere('quantity_remained', '>', 0)
        .count('id as count')
        .first()

      // Expiring in 180 days
      const expiringSoon = await db('products')
        .where('expire_date', '>=', todayStr)
        .andWhere('expire_date', '<=', futureDate)
        .andWhere('quantity_remained', '>', 0)
        .count('id as count')
        .first()

      return {
        availableProducts: available.count || 0,
        expiredProducts: expired.count || 0,
        lowStockDrugs: lowStock.count || 0,
        expiringSoonProducts: expiringSoon.count || 0
      }
    } catch (error) {
      console.error('Failed to fetch product dashboard stats:', error)
      throw new Error('Error getting dashboard product stats.')
    }
  })

  ipcMain.handle('product-profits:sync', async () => {
    return await syncProductProfits()
  });

  ipcMain.handle('product-profits:get-summary', async () => {
    const summary = await db('product_profits_summary').first();
    return summary;
  });

  ipcMain.handle('product-profits:get-products', async () => {
    return await db('product_profits').select();
  });

  ipcMain.handle('get-latest-products', async () => {
    return await getLatestProducts()
  })

  ipcMain.handle('change-product', async (_event, product) => {
  return await changeProduct(product)
})
}
