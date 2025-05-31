<template>
    <div class="p-6 mx-auto space-y-6 bg-white shadow-md max-w-7xl dark:bg-gray-900 rounded-xl">
        <Back />
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">📊 Product Sales Summary</h2>

        <!-- Sorting Filter -->
        <div class="flex items-center justify-end">
            <label for="sortOrder" class="mr-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort by Quantity Sold:
            </label>
            <select v-model="sortOrder" id="sortOrder"
                class="px-4 py-2 text-sm bg-white border rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="desc">High to Low</option>
                <option value="asc">Low to High</option>
            </select>
        </div>

        <!-- Table -->
        <div class="overflow-auto border rounded-lg shadow dark:border-gray-700">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th
                            class="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                            Name
                        </th>
                        <th
                            class="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                            Brand
                        </th>
                        <th
                            class="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                            Category
                        </th>
                        <th
                            class="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                            Sold
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                    <tr v-for="product in sortedProducts" :key="product.id"
                        class="transition hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td class="px-6 py-4 text-sm text-gray-700 whitespace-nowrap dark:text-gray-200">
                            {{ product.name }}
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-700 whitespace-nowrap dark:text-gray-200">
                            {{ product.brand }}
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-700 whitespace-nowrap dark:text-gray-200">
                            {{ product.category }}
                        </td>
                        <td class="px-6 py-4 text-sm font-semibold text-blue-600 whitespace-nowrap dark:text-blue-400">
                            {{ product.quantity_sold }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import Back from '@/components/Back.vue';

const products = ref([]);
const sortOrder = ref('desc'); // default: high to low

async function loadData() {
    products.value = await window.electronAPI.getProfitSales();
}

const sortedProducts = computed(() => {
    return [...products.value].sort((a, b) => {
        if (sortOrder.value === 'asc') {
            return a.quantity_sold - b.quantity_sold;
        } else {
            return b.quantity_sold - a.quantity_sold;
        }
    });
});

onMounted(loadData);
</script>
