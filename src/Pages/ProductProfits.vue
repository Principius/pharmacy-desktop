<template>
    <div class="p-2 text-gray-800 dark:text-gray-100">
        <Back />
        <div class="flex items-center justify-between mt-3 mb-6">
            <h2 class="text-2xl font-bold dark:text-gray-800">📈 Product Profits</h2>
            <button @click="syncProfits"
                class="px-5 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                🔄 Sync From Cloud
            </button>
        </div>

        <!-- Calculations Guide -->
        <div class="mb-8 bg-white rounded-md shadow-md dark:bg-gray-900">
            <div class="p-4">
                <h3 class="mb-2 text-lg font-semibold">📊 How Calculations Are Done</h3>
                <ul class="pl-6 space-y-1 text-sm list-disc">
                    <li><strong>Profit:</strong> <span class="italic">Final Selling Price - Buying Price</span></li>
                    <li><strong>Final Selling Price:</strong> <span class="italic">Expected Selling Price - Discount
                            Applied</span></li>
                    <li><strong>Discount Applied:</strong> <span class="italic">Expected Selling Price × Discount
                            %</span></li>
                    <li><strong>Quantity Sold:</strong> <span class="italic">Number of units sold per product</span>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-sm text-center text-gray-500 dark:text-gray-400">Loading data, please wait...
        </div>

        <!-- Data Table -->
        <div v-else>
            <div class="overflow-x-auto rounded-lg shadow ring-1 ring-black/10 dark:ring-white/10">
                <table class="w-full text-sm text-left border-collapse table-auto">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-200">
                        <tr>
                            <th class="px-4 py-3">Name</th>
                            <th class="px-4 py-3">Brand</th>
                            <th class="px-4 py-3">Category</th>
                            <th class="px-4 py-3 text-center">Quantity Sold</th>
                            <th class="px-4 py-3 text-center">Buying Price</th>
                            <th class="px-4 py-3 text-center">Expected Selling Price</th>
                            <th class="px-4 py-3 text-center">Discount Applied</th>
                            <th class="px-4 py-3 text-center">Final Selling Price</th>
                            <th class="px-4 py-3 text-center">Profit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in productProfits" :key="p.name"
                            class="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td class="px-4 py-2">{{ p.name }}</td>
                            <td class="px-4 py-2">{{ p.brand }}</td>
                            <td class="px-4 py-2">{{ p.category }}</td>
                            <td class="px-4 py-2 text-center">{{ p.quantity_sold }}</td>
                            <td class="px-4 py-2 text-center">{{ format(p.buying_price) }}</td>
                            <td class="px-4 py-2 text-center">{{ format(p.expected_selling_price) }}</td>
                            <td class="px-4 py-2 text-center">{{ format(p.discount_applied) }}</td>
                            <td class="px-4 py-2 text-center">{{ format(p.final_selling_price) }}</td>
                            <td class="px-4 py-2 font-semibold text-center text-green-700 dark:text-green-400">{{
                                format(p.profit) }}</td>
                        </tr>

                        <tr v-if="summary"
                            class="font-bold text-gray-900 bg-gray-200 dark:bg-gray-800 dark:text-gray-100">
                            <td colspan="3" class="px-4 py-3">Totals</td>
                            <td class="px-4 py-3 text-center">—</td>
                            <td class="px-4 py-3 text-center">{{ format(summary.total_buying_price) }}</td>
                            <td class="px-4 py-3 text-center">{{ format(summary.total_expected_selling_price) }}</td>
                            <td class="px-4 py-3 text-center">{{ format(summary.total_discount_applied) }}</td>
                            <td class="px-4 py-3 text-center">{{ format(summary.total_final_selling_price) }}</td>
                            <td class="px-4 py-3 text-center">{{ format(summary.total_profit) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import Back from '@/components/Back.vue';

const loading = ref(false);
const productProfits = ref([]);
const summary = ref(null);

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
        await callback();
    }
}

function format(value) {
    return parseFloat(value).toLocaleString('en-US', {
        style: 'currency',
        currency: 'TZS',
        minimumFractionDigits: 2,
    });
}

async function loadData() {
    loading.value = true;
    productProfits.value = await window.electronAPI.getProfitSales();
    summary.value = await window.electronAPI.getSalesProfitSummary();
    loading.value = false;
}

function syncProfits() {
    confirmInternetAction(async () => {
        loading.value = true;

        try {
            const result = await window.electronAPI.syncProfitSales();

            await Swal.fire({
                icon: 'success',
                title: 'Synced!',
                text: result.message || 'Profits synced successfully.',
                confirmButtonColor: '#2563eb',
                background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#fff',
                color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
            });
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Something went wrong while syncing.',
                confirmButtonColor: '#ef4444',
            });
        } finally {
            loading.value = false;
            await loadData();
        }
    });
}


onMounted(loadData);
</script>
