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

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/register', name: 'Register', component: Register },
  { path: '/login', name: 'Login', component: Login },
  { path: '/dashboard/:name', name: 'Dashboard', component: Dashboard },
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
];

const router = createRouter({
  history: createWebHashHistory(), // ← IMPORTANT: Hash mode works best in Electron
  routes,
});

export default router;
