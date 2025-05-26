<template>
  <div class="max-w-6xl p-6 mx-auto">
    <Back />

    <div class="flex items-center justify-between mt-8 mb-4">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-black">
        Expired Products (In Stock)
      </h2>
      <input v-model="search" type="text" placeholder="Search by name, brand or batch no..."
        class="px-4 py-2 text-sm border rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-200" />
    </div>

    <div v-if="filteredExpiredProducts.length"
      class="overflow-x-auto border border-gray-200 rounded shadow dark:border-gray-700">
      <table class="min-w-full text-sm text-left table-auto">
        <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-300">
          <tr>
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3">Brand</th>
            <th class="px-4 py-3">Batch No</th>
            <th class="px-4 py-3">Expire Date</th>
            <th class="px-4 py-3">Quantity Left</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900">
          <tr v-for="product in filteredExpiredProducts" :key="product.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300">
            <td class="px-4 py-2">{{ product.name }}</td>
            <td class="px-4 py-2">{{ product.brand }}</td>
            <td class="px-4 py-2">{{ product.batch_no }}</td>
            <td class="px-4 py-2 text-red-600 dark:text-red-400">
              {{ formatDate(product.expire_date) }}
            </td>
            <td class="px-4 py-2 font-semibold">
              {{ product.quantity_remained }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else class="text-gray-600 dark:text-gray-600">No expired products with remaining quantity found.</p>
  </div>
</template>
<script setup>
import Back from '@/components/Back.vue'
import { ref, computed, onMounted } from 'vue'

const expiredProducts = ref([])
const search = ref('')

const formatDate = (dateStr) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString(undefined, options)
}

const filteredExpiredProducts = computed(() => {
  const term = search.value.toLowerCase()
  return expiredProducts.value.filter(product =>
    product.name.toLowerCase().includes(term) ||
    product.brand.toLowerCase().includes(term) ||
    product.batch_no.toLowerCase().includes(term)
  )
})

onMounted(async () => {
  try {
    expiredProducts.value = await window.electronAPI.getExpiredProducts()
  } catch (error) {
    console.error('Error loading expired products:', error)
  }
})
</script>
