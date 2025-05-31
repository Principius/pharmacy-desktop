import { ipcMain } from 'electron'
import getStockTransfers from '../../logic/getStockTransfers.js';
import submitStockTransfer from '../../logic/submitStockTransfer.js';
import getStockTransferHistory from '../../logic/getStockTransfersHistory.js';
import getPendingStockTransfers from '../../logic/getPendingStockTransfers.js';
import approveStockTransfer from '../../logic/approveStockTransfer.js';
import rejectStockTransfer from '../../logic/rejectStockTransfer.js';

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

  ipcMain.handle('transfer:submit-stock-transfer', async (_event, payload) => {
    return await submitStockTransfer(payload); // 👈 make sure `payload` is passed
  });
}
