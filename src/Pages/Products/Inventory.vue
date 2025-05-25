<template>
    <div class="max-w-6xl px-4 py-8 mx-auto">
        <Back />
        <h1 class="mb-6 text-3xl font-bold text-center text-gray-800 dark:text-gray-900">Inventory Summary</h1>

        <!-- Filters -->
        <div class="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
            <input v-model="search" type="text" placeholder="Search product name..."
                class="w-full px-4 py-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white" />

            <select v-model="sortOrder"
                class="px-4 py-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                <option value="desc">Sort by Stock ↓</option>
                <option value="asc">Sort by Stock ↑</option>
            </select>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
            <table class="min-w-full border divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-100 dark:bg-gray-700">
                    <tr>
                        <th class="px-4 py-3 text-sm font-medium text-left text-gray-700 dark:text-gray-200">#</th>
                        <th class="px-4 py-3 text-sm font-medium text-left text-gray-700 dark:text-gray-200">Product
                            Name</th>
                        <th class="px-4 py-3 text-sm font-medium text-left text-gray-700 dark:text-gray-200">Brand Count
                        </th>
                        <th class="px-4 py-3 text-sm font-medium text-left text-gray-700 dark:text-gray-200">Batch Count
                        </th>
                        <th class="px-4 py-3 text-sm font-medium text-left text-gray-700 dark:text-gray-200">Total Stock
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    <tr v-for="(item, index) in filteredAndSortedInventory" :key="item.name">
                        <td class="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">{{ index + 1 }}</td>
                        <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{{ item.name }}</td>
                        <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{{ item.brand_count }}</td>
                        <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{{ item.batch_count }}</td>
                        <td class="px-4 py-3 text-sm font-semibold text-purple-700 dark:text-purple-400">
                            {{ item.total_quantity }}
                        </td>
                    </tr>
                    <tr v-if="filteredAndSortedInventory.length === 0">
                        <td colspan="5" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">No matching
                            products found.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Back from '@/components/Back.vue'

const inventory = ref([])
const search = ref('')
const sortOrder = ref('desc')

onMounted(async () => {
    try {
        const data = await window.electronAPI.getGroupedInventory()
        inventory.value = data
    } catch (err) {
        console.error('Failed to fetch inventory:', err)
    }
})

const filteredAndSortedInventory = computed(() => {
    let result = inventory.value

    if (search.value.trim()) {
        const term = search.value.toLowerCase()
        result = result.filter(item => item.name.toLowerCase().includes(term))
    }

    result = result.sort((a, b) => {
        return sortOrder.value === 'asc'
            ? a.total_quantity - b.total_quantity
            : b.total_quantity - a.total_quantity
    })

    return result
})
</script>
