<script setup>
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import Back from '@/components/Back.vue'

const products = ref([])
const searchQuery = ref('')
const loading = ref(false)

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString()
}

async function confirmInternetAction(callback) {
  const { isConfirmed } = await Swal.fire({
    title: 'Internet Required',
    text: 'This action requires an internet connection. Do you want to continue?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, continue',
    cancelButtonText: 'Cancel'
  });

  if (isConfirmed) {
    callback();
  }
}

async function loadProducts() {
  loading.value = true
  try {
    const response = await window.electronAPI.readProducts()
    if (response.success) {
      products.value = response.products
    } else {
      Swal.fire('Error', response.error || 'Failed to load products', 'error')
    }
  } catch (error) {
    Swal.fire('Error', error.message || 'Unexpected error', 'error')
  } finally {
    loading.value = false
  }
}

function syncFromCloud() {
  confirmInternetAction(async () => {
    loading.value = true;
    try {
      const result = await window.electronAPI.syncProductsFromCloud();

      if (result.status === 'success') {
        await loadProducts();
        Swal.fire('Success', `Synced ${result.synced} products from cloud.`, 'success');
      } else {
        Swal.fire('Info', result.message || 'No new products to sync.', 'info');
      }
    } catch (error) {
      Swal.fire('Error', error.message || 'Failed to sync from cloud', 'error');
    } finally {
      loading.value = false;
    }
  });
}


const filteredProducts = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return products.value.filter(p =>
    p.name?.toLowerCase().includes(query) ||
    p.brand?.toLowerCase().includes(query) ||
    p.category?.toLowerCase().includes(query)
  )
})

const downloadTemplate = () => {
  confirmInternetAction(async () => {
    const result = await window.electronAPI.downloadProductTemplate();
    if (result.status === 'success') {
      Swal.fire('Downloaded', 'Template downloaded to: ' + result.path, 'success');
    } else if (result.status !== 'cancelled') {
      Swal.fire('Failed', 'Failed to download template: ' + result.message, 'error');
    }
  });
};


onMounted(() => {
  loadProducts()
})
</script>
<template>
  <div class="px-4 py-3 mx-auto transition-colors duration-300 bg-white rounded-lg shadow max-w-7xl dark:bg-gray-900">
    <Back />
    <button
      class="fixed z-50 px-6 py-3 mt-48 font-semibold text-white transition-all bg-purple-600 rounded-full shadow-lg right-6 hover:bg-purple-700"
      @click="$router.push('/latest')">
      Edit Products
    </button>
    <div class="flex flex-col items-center justify-between gap-4 mb-6 md:flex-row md:items-center">
      <div class="flex items-center justify-center w-full space-x-4 md:w-auto md:justify-start">
        <h2 class="text-3xl font-extrabold text-center text-gray-800 dark:text-white">
          Products List
        </h2>
      </div>
      <button @click="$router.push('/sheet')"
        class="flex items-center px-4 py-2 font-medium text-white transition-transform duration-300 rounded-lg shadow-md bg-gradient-to-r from-indigo-500 to-indigo-600 hover:scale-105">
        Live Stock-Taking
      </button>
      <div class="flex flex-col items-center justify-end w-full gap-2 md:flex-row md:w-auto">
        <button @click="downloadTemplate"
          class="px-6 py-3 font-semibold text-white transition bg-green-600 rounded-lg hover:bg-green-700">
          Download Product Excel Template
        </button>
        <button @click="$router.push('/import')"
          class="flex items-center px-4 py-2 font-medium text-white transition-transform duration-300 rounded-lg shadow-md bg-gradient-to-r from-indigo-500 to-indigo-600 hover:scale-105">
          Import Excel
        </button>
        <input v-model="searchQuery" type="text" placeholder="Search by name, brand, category..."
          class="w-full px-4 py-2 text-sm text-gray-800 bg-white border rounded-md shadow-sm dark:text-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 md:w-72" />
        <button @click="syncFromCloud" :disabled="loading"
          class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-colors bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
          <svg v-if="loading" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>Sync From Cloud</span>
        </button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
        <thead class="bg-gray-100 border-b dark:bg-gray-800 dark:text-gray-200">
          <tr>
            <th class="px-4 py-3 font-medium">Name</th>
            <th class="px-4 py-3 font-medium">Brand</th>
            <th class="px-4 py-3 font-medium">Category</th>
            <th class="px-4 py-3 font-medium">Expire Date</th>
            <th class="px-4 py-3 font-medium">Batch No.</th>
            <th class="px-4 py-3 font-medium">Qty Remained</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id"
            class="transition border-b border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600">
            <td class="px-4 py-3">{{ product.name }}</td>
            <td class="px-4 py-3">{{ product.brand }}</td>
            <td class="px-4 py-3">{{ product.category }}</td>
            <td class="px-4 py-3">{{ formatDate(product.expire_date) }}</td>
            <td class="px-4 py-3">{{ product.batch_no }}</td>
            <td class="px-4 py-3">{{ product.quantity_remained }}</td>
          </tr>
          <tr v-if="filteredProducts.length === 0">
            <td colspan="6" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
              No matching products found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
