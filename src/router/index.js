// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/Pages/Home.vue';
import Register from '@/Pages/Register.vue';
import Login from '@/Pages/Login.vue';
import Dashboard from '@/Pages/Dashboard.vue';
import Index from '@/Pages/Products/Index.vue';
import Create from '@/Pages/Products/Create.vue';
import List from '@/Pages/Sales/List.vue';
import SalesCreate from '@/Pages/Sales/Create.vue';
import Selector from '@/Pages/Sales/Selector.vue';
import SalesEdit from '@/Pages/Sales/Edit.vue';
import Cloud from '@/Pages/Cloud.vue';
import Inventory from '@/Pages/Products/Inventory.vue';
import LowStock from '@/Pages/Products/LowStock.vue';
import IndexExpenses from '@/Pages/Expenses/Index.vue';
import OfflineNotice from '@/Pages/OfflineNotice.vue';
import DebtorIndex from '@/Pages/Debtors/Index.vue';
import UsersCreate from '@/Pages/Users/Create.vue';
import Permissions from '@/Pages/Users/Permissions.vue';
import Expired from '@/Pages/Products/Expired.vue';
import ExpiringSoon from '@/Pages/Products/ExpiringSoon.vue';
import Pharmacy from '@/Pages/Pharmacy.vue';
import Order from '@/Pages/Products/Order.vue';

async function hasPharmacyData() {
  try {
    const data = await window.electronAPI.getPharmacyData(); // Or your actual data method
    return Array.isArray(data) ? data.length > 0 : !!data;
  } catch (error) {
    console.error('Error checking pharmacy data:', error);
    return false;
  }
}

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
 { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/products', name: 'Products', component: Index },
  { path: '/products/create', name: 'ProductsCreate', component: Create },
  { path: '/sales', name: 'Sales', component: List },
  { path: '/sales/create', name: 'SalesCreate', component: SalesCreate },
  { path: '/sales/select', name: 'SalesSelect', component: Selector },
  { path: '/sales/edit', name: 'SalesEdit', component: SalesEdit },
  { path: '/cloud', name: 'Cloud', component: Cloud },
  { path: '/inventory', name: 'Inventory', component: Inventory },
  { path: '/lowstock', name: 'LowStock', component: LowStock },
  { path: '/expenses', name: 'IndexExpenses', component: IndexExpenses },
  { path: '/offline', name: 'Offline', component: OfflineNotice },
  { path: '/debtors', name: 'Debtors', component: DebtorIndex },
  { path: '/users/create', name: 'UsersCreate', component: UsersCreate },
   { path: '/permissions', name: 'Permissions', component: Permissions },
   { path: '/expired', name: 'Expired', component: Expired },
   { path: '/expired/soon', name: 'ExpiredSoon', component: ExpiringSoon },
   { path: '/pharmacy', name: 'Pharmacy', component: Pharmacy },
   { path: '/order', name: 'Order', component: Order },
];

const router = createRouter({
  history: createWebHashHistory(), // ← IMPORTANT: Hash mode works best in Electron
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.path === '/') {
    const exists = await hasPharmacyData();
    if (!exists) {
      return next('/pharmacy');
    }
  }
  next();
});

export default router;
