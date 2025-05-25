const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  cloudUser: async (credentials) => ipcRenderer.invoke('cloud-login-user', credentials),
  registerUser: async (userData) => ipcRenderer.invoke('register-user', userData),
  loginUser: async (credentials) => ipcRenderer.invoke('login-user', credentials),
  createProduct: async (productData) => ipcRenderer.invoke('create-product', productData),
  readProducts: async () => ipcRenderer.invoke('read-products'),
  updateProduct: async (id, updates) => ipcRenderer.invoke('update-product', { id, updates }),
  deleteProduct: async (id) => ipcRenderer.invoke('delete-product', id),

  // Sales
  createSale: async (salesData) => ipcRenderer.invoke('sales:create', salesData),
  getSales: async (filterOptions) => ipcRenderer.invoke('sales:get', filterOptions),
  updateSale: async (saleId, updatedData) => ipcRenderer.invoke('sales:update', saleId, updatedData),
  deleteSale: async (saleId) => ipcRenderer.invoke('sales:delete', saleId),
  getSaleById: async (id) => ipcRenderer.invoke('sales:getById', id),
  syncSalesToCloud: () => ipcRenderer.invoke('sales:sync-to-cloud'),

  // Products sync from cloud
  syncProductsFromCloud: () => ipcRenderer.invoke('products:sync-from-cloud'),

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
})
