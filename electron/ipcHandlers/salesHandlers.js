import createSales from '../../logic/sales/createSales.js'
import updateSale from '../../logic/sales/updateSale.js'
import deleteSale from '../../logic/sales/deleteSale.js'
import getSales from '../../logic/sales/getSales.js'
import getSaleById from '../../logic/sales/getSaleById.js'
import syncSalesToCloud from '../../logic/sales/syncSalesToCloud.js'
import getSalesStats from '../../logic/sales/getSalesStats.js'
import db from '../db/connection.js'
import getGraphSalesStats from '../../logic/sales/getGraphSalesStats.js'
import getMonthlyRevenueStats from '../../logic/sales/revenueMonths.js'


export default function registerSalesHandlers(ipcMain) {
  ipcMain.handle('pharmacy:get-info', async () => {
    // Just fetch pharmacy info from DB once
    const pharmacyInfo = await db('pharmacy_data').first()
    return pharmacyInfo
  })

  ipcMain.handle('sales:create', async (event, salesData) => {
    return await createSales(salesData)
  })

  ipcMain.handle('sales:getById', async (event, id) => {
    return await getSaleById(id)
  })

  ipcMain.handle('sales:update', async (event, saleId, updatedData) => {
    return await updateSale(saleId, updatedData)
  })

  ipcMain.handle('sales:delete', async (event, saleId) => {
    return await deleteSale(saleId)
  })

  ipcMain.handle('sales:get', async (event, filterOptions) => {
    return await getSales(filterOptions)
  })

  ipcMain.handle('sales:sync-to-cloud', async () => {
    return await syncSalesToCloud() // ✅ Call extracted logic
  })

  ipcMain.handle('sales:get-stats', async () => {
    return await getSalesStats()
  })

  ipcMain.handle('sales:get-graph-stats', async () => {
    return await getGraphSalesStats()
  })

  ipcMain.handle('sales:get-monthly-revenue-stats', async () => {
  return await getMonthlyRevenueStats()
})

}
