<template>
    <div
        class="max-w-3xl px-6 py-4 mx-auto mt-10 transition-all bg-white border shadow-xl rounded-3xl dark:bg-gray-900 dark:border-gray-700">
        <Back />
        <!-- Header -->
        <div class="flex items-center justify-between mt-8 mb-6">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">📊 Financial Summary</h2>
            <button @click="syncSummary" :disabled="loading"
                class="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition">
                {{ loading ? 'Syncing...' : 'Sync Now' }}
            </button>
        </div>

        <!-- Date Range Filters -->
        <div class="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2">
            <div>
                <label class="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">Start Date</label>
                <input type="date" v-model="startDate"
                    class="w-full px-3 py-2 transition bg-white border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label class="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">End Date</label>
                <input type="date" v-model="endDate"
                    class="w-full px-3 py-2 transition bg-white border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
        </div>

        <!-- Summary List -->
        <div v-if="filteredSummaries.length" class="space-y-6">
            <div v-for="(item, index) in filteredSummaries" :key="index"
                class="p-4 transition border border-gray-200 shadow-sm bg-gray-50 dark:bg-gray-800 rounded-xl dark:border-gray-700">
                <div class="flex justify-between py-2 border-b dark:border-gray-600">
                    <span class="text-gray-700 dark:text-gray-300">Total Sales</span>
                    <span class="font-semibold text-green-600 dark:text-green-400">{{ format(item.total_sales) }}
                        TZS</span>
                </div>
                <div class="flex justify-between py-2 border-b dark:border-gray-600">
                    <span class="text-gray-700 dark:text-gray-300">Total Expenses</span>
                    <span class="font-semibold text-red-600 dark:text-red-400">{{ format(item.total_expenses) }}
                        TZS</span>
                </div>
                <div class="flex justify-between py-2 border-b dark:border-gray-600">
                    <span class="text-gray-700 dark:text-gray-300">Total Buying Price</span>
                    <span class="font-semibold text-blue-600 dark:text-blue-400">{{ format(item.total_buying_price) }}
                        TZS</span>
                </div>
                <div class="flex justify-between py-2">
                    <span class="text-gray-700 dark:text-gray-300">Net Profit</span>
                    <span
                        :class="item.net_profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'"
                        class="font-bold">{{ format(item.net_profit) }} TZS</span>
                </div>
                <div class="mt-2 text-xs text-right text-gray-500 dark:text-gray-400">
                    Synced at: {{ formatDate(item.sync_at) }}
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="py-12 text-center text-gray-500 dark:text-gray-400">
            No financial summaries found in this range.
        </div>

        <!-- Explanation of Formulas -->
        <div
            class="p-6 mt-10 space-y-4 text-sm text-gray-700 bg-gray-100 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-xl dark:text-gray-300">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white">📘 How These Figures Are Calculated</h3>
            <div>
                <strong>Total Sales:</strong>
                <p>This is the total revenue generated from all sales transactions recorded over time.</p>
            </div>
            <div>
                <strong>Total Expenses:</strong>
                <p>This represents the sum of all operational and business-related expenses incurred.</p>
            </div>
            <div>
                <strong>Total Buying Price (COGS):</strong>
                <p>This is the total cost of goods sold, calculated by multiplying the quantity of products sold by
                    their buying price per unit.</p>
            </div>
            <div>
                <strong>Net Profit:</strong>
                <p>This is the actual profit earned after deducting both the buying costs and business expenses from
                    total sales revenue.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import Back from './Back.vue'

const allSummaries = ref([])
const startDate = ref('')
const endDate = ref('')
const loading = ref(false)

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

const loadSummaries = async () => {
    const latest = await window.electronAPI.getLatestFinancials()
    allSummaries.value = Array.isArray(latest) ? latest : [latest]
}

const syncSummary = () => {
    confirmInternetAction(async () => {
        loading.value = true;
        try {
            await window.electronAPI.syncFinancialSummaries();
            await loadSummaries();
            Swal.fire({
                icon: 'success',
                title: 'Sync Complete',
                text: 'Financial data has been synced successfully.',
                background: '#fff',
                color: '#333',
                confirmButtonColor: '#6366f1'
            });
        } catch (err) {
            console.error('Sync failed:', err);
            Swal.fire({
                icon: 'error',
                title: 'Sync Failed',
                text: 'Could not sync financial data. Please try again later.',
                background: '#fff',
                color: '#333',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            loading.value = false;
        }
    });
};

const format = (value) => {
    if (!value) return '0.00'
    return parseFloat(value).toLocaleString('en-TZ', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}

const formatDate = (dateStr) => {
    if (!dateStr) return 'Never'
    return new Date(dateStr).toLocaleString()
}

const filteredSummaries = computed(() => {
    return allSummaries.value.filter((item) => {
        const date = new Date(item.sync_at).toISOString().split('T')[0]
        const start = startDate.value || '0000-01-01'
        const end = endDate.value || '9999-12-31'
        return date >= start && date <= end
    })
})

onMounted(loadSummaries)
</script>

<style scoped>
@media (max-width: 640px) {
    .grid {
        grid-template-columns: 1fr !important;
    }
}
</style>
