import { ipcMain } from 'electron'
import getStockTransfers from '../../logic/getStockTransfers.js';
import submitStockTransfer from '../../logic/submitStockTransfer.js';
import getStockTransferHistory from '../../logic/getStockTransfersHistory.js';
import getPendingStockTransfers from '../../logic/getPendingStockTransfers.js';
import approveStockTransfer from '../../logic/approveStockTransfer.js';
import rejectStockTransfer from '../../logic/rejectStockTransfer.js';
import getRejectedStockTransfers from '../../logic/getRejectedStockTransfers.js';
import returnRejectedStockTransfer from '../../logic/returnRejectedStockTransfer.js';
import downloadProductTemplate from '../../logic/downloadProductTemplate.js';
import importProducts from '../../logic/importProducts.js';
import syncProductsToSheet from '../../logic/syncProductsToSheet.js';
import getGoogleSheetLink from '../../logic/getGoogleSheetLink.js';
import syncSheetToProducts from '../../logic/syncSheetToProducts.js';

export default function registerStockTransfersHandlers() {

  ipcMain.handle('transfer:sync-from-cloud', async () => {
    return await getStockTransfers()
  })

  ipcMain.handle('transfer:transfer-history', async () => {
    return await getStockTransferHistory()
  })

  ipcMain.handle('approve-stock-transfer', async (event, id) => {
    return await approveStockTransfer(id);
  });

  ipcMain.handle('reject-stock-transfer', async (event, id) => {
    return await rejectStockTransfer(id);
  });

  ipcMain.handle('transfer:transfer-pending', async () => {
    return await getPendingStockTransfers()
  })

  ipcMain.handle('transfer:transfer-rejected', async () => {
    return await getRejectedStockTransfers()
  })

  ipcMain.handle('transfer:transfer-restore', async (event, id) => {
    return await returnRejectedStockTransfer()
  })

  ipcMain.handle('download-product-template', async (event, id) => {
    return await downloadProductTemplate()
  })

  ipcMain.handle('import-products', async (event, fileObj) => {
    return await importProducts(fileObj);
  });

  ipcMain.handle('transfer:submit-stock-transfer', async (_event, payload) => {
    return await submitStockTransfer(payload); // 👈 make sure `payload` is passed
  });

  ipcMain.handle('sync-products-to-sheet', async () => {
    return await syncProductsToSheet();
  });

  ipcMain.handle('open-google-sheet', async () => {
    return await getGoogleSheetLink();
  });

  ipcMain.handle('sync-sheet-to-products', async () => {
    return await syncSheetToProducts();
  });
}
