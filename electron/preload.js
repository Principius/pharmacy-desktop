const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  restartApp: () => ipcRenderer.invoke("restart-app"),
  onUpdateAvailable: (callback) => ipcRenderer.on("update-available", callback),
  onUpdateProgress: (callback) =>
    ipcRenderer.on("update-download-progress", callback),
  onUpdateDownloaded: (callback) =>
    ipcRenderer.on("update-downloaded", callback),
  requestUpdateDownload: () => ipcRenderer.send("start-update-download"),

  addPharmacy: (formData) => ipcRenderer.invoke("add-pharmacy", formData),
  pharmacyGetInfo: () => ipcRenderer.invoke("pharmacy:get-info"),
  getPharmacyData: () => ipcRenderer.invoke("get-pharmacy-data"),
  // USER CRUD
  getUsers: () => ipcRenderer.invoke("users:getAll"),
  getUser: (id) => ipcRenderer.invoke("users:getById", id),
  createUser: (user) => ipcRenderer.invoke("users:create", user),
  updateUser: (id, data) => ipcRenderer.invoke("users:update", id, data),
  deleteUser: (id) => ipcRenderer.invoke("users:delete", id),
  updateUserPermissions: (id, permissions) =>
    ipcRenderer.invoke("updateUserPermissions", id, permissions),

  cloudUser: async (credentials) =>
    ipcRenderer.invoke("cloud-login-user", credentials),
  registerUser: async (userData) =>
    ipcRenderer.invoke("register-user", userData),
  loginUser: async (credentials) =>
    ipcRenderer.invoke("login-user", credentials),
  getLoggedInUser: () => ipcRenderer.invoke("get-logged-in-user"),
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  logoutUser: () => ipcRenderer.invoke("logout-user"),

  createProduct: async (productData) =>
    ipcRenderer.invoke("create-product", productData),
  readProducts: async () => ipcRenderer.invoke("read-products"),
  readProductsPending: async (search) =>
    ipcRenderer.invoke("read-products_pending", search),
  updateProduct: async (id, updates) =>
    ipcRenderer.invoke("update-product", { id, updates }),
  deleteProduct: async (id) => ipcRenderer.invoke("delete-product", id),
  getExpiredProducts: () => ipcRenderer.invoke("getExpiredProducts"),
  getExpiringSoonProducts: () => ipcRenderer.invoke("getExpiringSoonProducts"),
  readDonutProducts: async () => ipcRenderer.invoke("product:get-expiry-stats"),

  // Sales
  createSale: async (salesData) =>
    ipcRenderer.invoke("sales:create", salesData),
  getPaymentMethods: async () => ipcRenderer.invoke("paymentMethods:get"),
  getSales: async (filterOptions) =>
    ipcRenderer.invoke("sales:get", filterOptions),
  updateSale: async (saleId, updatedData) =>
    ipcRenderer.invoke("sales:update", saleId, updatedData),
  deleteSale: async (saleId) => ipcRenderer.invoke("sales:delete", saleId),
  getSaleById: async (id) => ipcRenderer.invoke("sales:getById", id),
  syncSalesToCloud: () => ipcRenderer.invoke("sales:sync-to-cloud"),
  getGraphSalesStats: () => ipcRenderer.invoke("sales:get-graph-stats"),
  getMonthlyRevenueStats: () =>
    ipcRenderer.invoke("sales:get-monthly-revenue-stats"),

  // Products sync from cloud
  syncProductsFromCloud: () => ipcRenderer.invoke("products:sync-from-cloud"),
  syncSummariesFromCloud: () => ipcRenderer.invoke("summaries:sync-from-cloud"),
  getLatest: () => ipcRenderer.invoke("summaries:get-latest"),

  syncFinancialSummaries: () =>
    ipcRenderer.invoke("financials:sync-from-cloud"),
  getLatestFinancials: () => ipcRenderer.invoke("financials:get-latest"),

  syncProfitSales: () => ipcRenderer.invoke("product-profits:sync"),
  getProfitSales: () => ipcRenderer.invoke("product-profits:get-products"),
  getSalesProfitSummary: () =>
    ipcRenderer.invoke("product-profits:get-summary"),

  getStockTransfers: () => ipcRenderer.invoke("transfer:sync-from-cloud"),
  rejectStockTransfer: (id) => ipcRenderer.invoke("reject-stock-transfer", id),
  approveStockTransfer: (id) =>
    ipcRenderer.invoke("approve-stock-transfer", id),
  returnRejectedStockTransfer: (id) =>
    ipcRenderer.invoke("transfer:transfer-restore", id),
  getPendingStockTransfers: () =>
    ipcRenderer.invoke("transfer:transfer-pending"),
  getStockTransferHistory: () =>
    ipcRenderer.invoke("transfer:transfer-history"),
  getRejectedStockTransfers: () =>
    ipcRenderer.invoke("transfer:transfer-rejected"),
  submitStockTransfer: (payload) =>
    ipcRenderer.invoke("transfer:submit-stock-transfer", payload),

  //Products
  downloadProductTemplate: () =>
    ipcRenderer.invoke("download-product-template"),
  importProducts: (fileObj) => ipcRenderer.invoke("import-products", fileObj),
  syncProductsToSheet: () => ipcRenderer.invoke("sync-products-to-sheet"),
  openGoogleSheet: () => ipcRenderer.invoke("open-google-sheet"),
  syncSheetToProducts: () => ipcRenderer.invoke("sync-sheet-to-products"),

  getLatestProducts: () => ipcRenderer.invoke("get-latest-products"),
  changeProduct: (product) => ipcRenderer.invoke("change-product", product),
  syncEditedProductsToCloud: () => ipcRenderer.invoke("products:sync-to-cloud"),

  //Inventory
  getGroupedInventory: () => ipcRenderer.invoke("getGroupedInventory"),

  //Low Stock Drugs
  getLowStockProducts: () => ipcRenderer.invoke("getLowStockProducts"),

  //CRUD Expenses
  createExpense: async (expenseData) =>
    ipcRenderer.invoke("expenses:create", expenseData),
  readExpenses: async () => ipcRenderer.invoke("expenses:read"),
  updateExpense: async (expenseUuid, updates) =>
    ipcRenderer.invoke("expenses:update", expenseUuid, updates),
  deleteExpense: async (expenseUuid) =>
    ipcRenderer.invoke("expenses:delete", expenseUuid),

  syncExpensesToCloud: () => ipcRenderer.invoke("expenses:sync-to-cloud"),

  getCurrentSession: () => ipcRenderer.invoke("get-current-session"),
  openExternalLink: (url) => ipcRenderer.invoke("open-external-link", url),

  createDebtor: (data) => ipcRenderer.invoke("debtors:create", data),
  readDebtors: () => ipcRenderer.invoke("debtors:read"),
  updateDebtor: (id, updates) =>
    ipcRenderer.invoke("debtors:update", { id, updates }),
  deleteDebtor: (id) => ipcRenderer.invoke("debtors:delete", id),
  createDebtorWithProducts: (data) =>
    ipcRenderer.invoke("debtors:createWithProducts", data),
  getDebtorProducts: (debtorId) =>
    ipcRenderer.invoke("debtor:products", debtorId),
  syncDebtorsToCloud: () => ipcRenderer.invoke("debtors:sync-to-cloud"),

  // Pending Products CRUD and Sync
  createPendingProduct: (productData) =>
    ipcRenderer.invoke("pendingProducts:create", productData),
  readPendingProducts: () => ipcRenderer.invoke("pendingProducts:read"),
  updatePendingProduct: (id, updates) =>
    ipcRenderer.invoke("pendingProducts:update", { id, updates }),
  deletePendingProduct: (id) =>
    ipcRenderer.invoke("pendingProducts:delete", id),
  syncPendingProductsToCloud: () =>
    ipcRenderer.invoke("pendingProducts:sync-to-cloud"),

  // Customer Suggestions
  createCustomerSuggestion: (suggestion) =>
    ipcRenderer.invoke("customerSuggestions:create", suggestion),

  readCustomerSuggestions: () => ipcRenderer.invoke("customerSuggestions:read"),

  updateCustomerSuggestion: (id, updates) =>
    ipcRenderer.invoke("customerSuggestions:update", { id, updates }),

  deleteCustomerSuggestion: (id) =>
    ipcRenderer.invoke("customerSuggestions:delete", id),

  syncCustomerSuggestionsToCloud: () =>
    ipcRenderer.invoke("customerSuggestions:sync-to-cloud"),
});
