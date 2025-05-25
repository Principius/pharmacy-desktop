<template>
  <div class="max-w-6xl p-6 mx-auto bg-white rounded shadow dark:bg-gray-900 dark:text-white">
    <!-- Header Section -->
    <div class="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
      <div class="flex items-center gap-4">
        <Back />
        <h2 class="text-3xl font-bold text-gray-800 dark:text-white">Select Products to Sell</h2>
      </div>

      <router-link to="/sales" class="px-4 py-2 text-white transition bg-gray-700 rounded hover:bg-gray-800">
        View Sales
      </router-link>
    </div>

    <!-- Search Bar -->
    <div class="mb-4">
      <input v-model="searchTerm" type="text" placeholder="Search products..."
        class="w-full px-4 py-2 text-sm border rounded shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
    </div>

    <!-- Product Table -->
    <div class="overflow-x-auto rounded-lg shadow">
      <table class="min-w-full text-sm text-left text-gray-800 bg-white dark:text-gray-200 dark:bg-gray-900">
        <thead class="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th class="px-4 py-3 font-semibold border-b dark:border-gray-700">Select</th>
            <th class="px-4 py-3 font-semibold border-b dark:border-gray-700">Name</th>
            <th class="px-4 py-3 font-semibold border-b dark:border-gray-700">Brand</th>
            <th class="px-4 py-3 font-semibold border-b dark:border-gray-700">Batch No.</th>
            <th class="px-4 py-3 font-semibold border-b dark:border-gray-700">Qty Left</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id"
            class="transition-colors border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
            <td class="px-4 py-3 text-center">
              <input type="checkbox" v-model="selected" :value="product" class="accent-purple-600" />
            </td>
            <td class="px-4 py-3">{{ product.name }}</td>
            <td class="px-4 py-3">{{ product.brand }}</td>
            <td class="px-4 py-3">{{ product.batch_no }}</td>
            <td class="px-4 py-3">{{ product.quantity_remained }}</td>
          </tr>

          <tr v-if="filteredProducts.length === 0">
            <td colspan="5" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
              No products found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Floating Make Sale Button with Count -->
    <div class="fixed z-50 top-32 right-6">
      <button @click="proceedToSale" :disabled="selected.length === 0"
        class="px-6 py-3 font-semibold text-white transition-all bg-purple-600 rounded-full shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-400 dark:focus:ring-purple-700 disabled:opacity-50 disabled:cursor-not-allowed">
        Make Sale
        <span v-if="selected.length > 0"
          class="inline-flex items-center justify-center px-2 py-1 ml-2 text-xs font-bold leading-none text-purple-800 bg-white rounded-full">
          {{ selected.length }}
        </span>
      </button>
    </div>


  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import Back from '@/components/Back.vue'

const products = ref([])
const selected = ref([])
const searchTerm = ref('')
const router = useRouter()

// Load products
async function loadProducts() {
  try {
    const response = await window.electronAPI.readProducts()
    if (response.success) {
      products.value = response.products
    } else {
      Swal.fire('Error', response.error || 'Failed to load products', 'error')
    }
  } catch (error) {
    Swal.fire('Error', error.message || 'Unexpected error', 'error')
  }
}

// Filter products based on search
const filteredProducts = computed(() => {
  if (!searchTerm.value.trim()) return products.value
  return products.value.filter(product =>
    [product.name, product.brand, product.batch_no]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.value.toLowerCase())
  )
})

// Proceed to sale
const proceedToSale = () => {
  router.push({ name: 'SalesCreate', query: { selected: JSON.stringify(selected.value) } })
}

onMounted(() => {
  loadProducts()
})
</script>
