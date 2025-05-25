// ipcHandlers.js
import { ipcMain } from 'electron';
import registerUserHandlers from './userHandlers.js';
import registerProductHandlers from './productHandlers.js';
import registerSalesHandlers from './salesHandlers.js';
import cloudUserHandlers from './cloudHandlers.js';
import registerInventoryHandlers from './inventoryHandlers.js';
import registerLowStockHandlers from './lowStockHandlers.js';
import registerExpensesHandlers from './expensesHandlers.js';
import db from '../db/connection.js';
import sessions from '../../electron/db/queries/sessions.js'
import registerSessionHandlers from './sessionHandlers.js';

export default function registerIpcHandlers() {
  const sessionService = sessions(db)

  registerUserHandlers(ipcMain);
  registerProductHandlers(ipcMain);
  registerSalesHandlers(ipcMain);
  cloudUserHandlers(ipcMain);
  registerInventoryHandlers(ipcMain);
  registerLowStockHandlers(ipcMain);
  registerExpensesHandlers(ipcMain, db);
   registerSessionHandlers(ipcMain, sessionService)
}
