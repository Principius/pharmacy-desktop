<template>
    <div class="max-w-6xl px-4 py-8 mx-auto">
        <Back />
        <h1 class="mb-6 text-3xl font-bold text-center text-red-700 dark:text-red-400">
            ⚠️ Low Stock Products
        </h1>

        <!-- Search and Sort -->
        <div class="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
            <input v-model="search" type="text" placeholder="Search products..."
                class="w-full px-4 py-2 text-sm text-gray-800 bg-white border rounded-md shadow-sm dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400" />

            <div class="flex gap-2">
                <button @click="toggleSort('name')"
                    class="px-4 py-2 text-sm font-medium text-white transition bg-red-500 rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700">
                    Sort by Name
                </button>
                <button @click="toggleSort('stock')"
                    class="px-4 py-2 text-sm font-medium text-white transition bg-red-500 rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700">
                    Sort by Stock
                </button>
            </div>
        </div>

        <!-- No Products -->
        <div v-if="filteredProducts.length === 0" class="text-center text-gray-600 dark:text-gray-300">
            All products are sufficiently stocked ✅
        </div>

        <!-- Products Table -->
        <div v-else class="overflow-x-auto rounded-lg shadow">
            <table class="min-w-full text-sm border divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="sticky top-0 z-10 bg-red-100 dark:bg-red-900">
                    <tr>
                        <th class="px-4 py-2 text-left text-gray-800 dark:text-gray-200">#</th>
                        <th class="px-4 py-2 text-left text-gray-800 dark:text-gray-200">Name</th>
                        <th class="px-4 py-2 text-left text-gray-800 dark:text-gray-200">Brand</th>
                        <th class="px-4 py-2 text-left text-gray-800 dark:text-gray-200">Batch No</th>
                        <th class="px-4 py-2 text-left text-gray-800 dark:text-gray-200">Stock</th>
                        <th class="px-4 py-2 text-left text-gray-800 dark:text-gray-200">Minimum</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    <tr v-for="(product, index) in filteredProducts" :key="product.id"
                        class="hover:bg-red-50 dark:hover:bg-red-800">
                        <td class="px-4 py-2 text-gray-800 dark:text-gray-100">{{ index + 1 }}</td>
                        <td class="px-4 py-2 text-gray-800 dark:text-gray-100">{{ product.name }}</td>
                        <td class="px-4 py-2 text-gray-700 dark:text-gray-300">{{ product.brand }}</td>
                        <td class="px-4 py-2 text-gray-700 dark:text-gray-300">{{ product.batch_no }}</td>
                        <td class="px-4 py-2 font-semibold text-red-700 dark:text-red-400">
                            {{ product.quantity_remained }}
                        </td>
                        <td class="px-4 py-2 text-gray-700 dark:text-gray-300">{{ product.minimum_stock }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Back from '@/components/Back.vue'

const products = ref([])
const search = ref('')
const sortField = ref('name')
const sortAsc = ref(true)

onMounted(async () => {
    try {
        products.value = await window.electronAPI.getLowStockProducts()
    } catch (error) {
        console.error('Failed to fetch low stock products:', error)
    }
})

const filteredProducts = computed(() => {
    let filtered = products.value.filter(p =>
        p.name.toLowerCase().includes(search.value.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.value.toLowerCase()) ||
        p.batch_no.toLowerCase().includes(search.value.toLowerCase())
    )

    if (sortField.value === 'name') {
        filtered.sort((a, b) => sortAsc.value
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        )
    } else if (sortField.value === 'stock') {
        filtered.sort((a, b) => sortAsc.value
            ? a.quantity_remained - b.quantity_remained
            : b.quantity_remained - a.quantity_remained
        )
    }

    return filtered
})

const toggleSort = (field) => {
    if (sortField.value === field) {
        sortAsc.value = !sortAsc.value
    } else {
        sortField.value = field
        sortAsc.value = true
    }
}
</script>
