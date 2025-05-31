const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {

  restartApp: () => ipcRenderer.invoke('restart-app'),
  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
  onUpdateProgress: (callback) => ipcRenderer.on('update-download-progress', callback),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
  requestUpdateDownload: () => ipcRenderer.send('start-update-download'),

  addPharmacy: (formData) => ipcRenderer.invoke('add-pharmacy', formData),
  pharmacyGetInfo: () => ipcRenderer.invoke('pharmacy:get-info'),
  getPharmacyData: () => ipcRenderer.invoke('get-pharmacy-data'),
  // USER CRUD
  getUsers: () => ipcRenderer.invoke('users:getAll'),
  getUser: (id) => ipcRenderer.invoke('users:getById', id),
  createUser: (user) => ipcRenderer.invoke('users:create', user),
  updateUser: (id, data) => ipcRenderer.invoke('users:update', id, data),
  deleteUser: (id) => ipcRenderer.invoke('users:delete', id),
  updateUserPermissions: (id, permissions) => ipcRenderer.invoke('updateUserPermissions', id, permissions),

  cloudUser: async (credentials) => ipcRenderer.invoke('cloud-login-user', credentials),
  registerUser: async (userData) => ipcRenderer.invoke('register-user', userData),
  loginUser: async (credentials) => ipcRenderer.invoke('login-user', credentials),
  getLoggedInUser: () => ipcRenderer.invoke('get-logged-in-user'),
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),

  createProduct: async (productData) => ipcRenderer.invoke('create-product', productData),
  readProducts: async () => ipcRenderer.invoke('read-products'),
  updateProduct: async (id, updates) => ipcRenderer.invoke('update-product', { id, updates }),
  deleteProduct: async (id) => ipcRenderer.invoke('delete-product', id),
  getExpiredProducts: () => ipcRenderer.invoke('getExpiredProducts'),
  getExpiringSoonProducts: () => ipcRenderer.invoke('getExpiringSoonProducts'),
  readDonutProducts: async () => ipcRenderer.invoke('product:get-expiry-stats'),

  // Sales
  createSale: async (salesData) => ipcRenderer.invoke('sales:create', salesData),
  getSales: async (filterOptions) => ipcRenderer.invoke('sales:get', filterOptions),
  updateSale: async (saleId, updatedData) => ipcRenderer.invoke('sales:update', saleId, updatedData),
  deleteSale: async (saleId) => ipcRenderer.invoke('sales:delete', saleId),
  getSaleById: async (id) => ipcRenderer.invoke('sales:getById', id),
  syncSalesToCloud: () => ipcRenderer.invoke('sales:sync-to-cloud'),
  getGraphSalesStats: () => ipcRenderer.invoke('sales:get-graph-stats'),
  getMonthlyRevenueStats: () => ipcRenderer.invoke('sales:get-monthly-revenue-stats'),

  // Products sync from cloud
  syncProductsFromCloud: () => ipcRenderer.invoke('products:sync-from-cloud'),
  syncSummariesFromCloud: () => ipcRenderer.invoke('summaries:sync-from-cloud'),
  getLatest: () => ipcRenderer.invoke('summaries:get-latest'),

  syncFinancialSummaries: () => ipcRenderer.invoke('financials:sync-from-cloud'),
  getLatestFinancials: () => ipcRenderer.invoke('financials:get-latest'),

  syncProfitSales: () => ipcRenderer.invoke('product-profits:sync'),
  getProfitSales: () => ipcRenderer.invoke('product-profits:get-products'),
  getSalesProfitSummary: () => ipcRenderer.invoke('product-profits:get-summary'),

  getStockTransfers: () => ipcRenderer.invoke('transfer:sync-from-cloud'),
   rejectStockTransfer: (id) => ipcRenderer.invoke('reject-stock-transfer', id),
  approveStockTransfer: (id) => ipcRenderer.invoke('approve-stock-transfer', id),
  getPendingStockTransfers: () => ipcRenderer.invoke('transfer:transfer-pending'),
  getStockTransferHistory: () => ipcRenderer.invoke('transfer:transfer-history'),
   submitStockTransfer: (payload) => ipcRenderer.invoke('transfer:submit-stock-transfer', payload),

  //Inventory
  getGroupedInventory: () => ipcRenderer.invoke('getGroupedInventory'),

  //Low Stock Drugs
  getLowStockProducts: () => ipcRenderer.invoke('getLowStockProducts'),

  //CRUD Expenses
  createExpense: async (expenseData) => ipcRenderer.invoke('expenses:create', expenseData),
  readExpenses: async () => ipcRenderer.invoke('expenses:read'),
  updateExpense: async (expenseUuid, updates) => ipcRenderer.invoke('expenses:update', expenseUuid, updates),
  deleteExpense: async (expenseUuid) => ipcRenderer.invoke('expenses:delete', expenseUuid),

  syncExpensesToCloud: () => ipcRenderer.invoke('expenses:sync-to-cloud'),

  getCurrentSession: () => ipcRenderer.invoke('get-current-session'),
  openExternalLink: (url) => ipcRenderer.invoke('open-external-link', url),

  createDebtor: (data) => ipcRenderer.invoke('debtors:create', data),
  readDebtors: () => ipcRenderer.invoke('debtors:read'),
  updateDebtor: (id, updates) => ipcRenderer.invoke('debtors:update', { id, updates }),
  deleteDebtor: (id) => ipcRenderer.invoke('debtors:delete', id),
  createDebtorWithProducts: (data) => ipcRenderer.invoke('debtors:createWithProducts', data),
  getDebtorProducts: (debtorId) => ipcRenderer.invoke('debtor:products', debtorId),
  syncDebtorsToCloud: () => ipcRenderer.invoke('debtors:sync-to-cloud'),
})
