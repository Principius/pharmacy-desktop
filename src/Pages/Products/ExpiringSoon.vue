<template>
    <div class="p-6">
        <div class="flex items-center justify-between mb-4">
            <Back />
            <router-link to="/expired"
                class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded shadow hover:bg-red-600">
                View Expired Products
            </router-link>
        </div>

        <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-black">
                Products Expiring Soon (Within 120 Days)
            </h2>
            <input v-model="search" type="text" placeholder="Search by name..."
                class="px-4 py-2 text-sm border rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-200" />
        </div>

        <table class="w-full text-sm text-left border-collapse table-auto">
            <thead class="text-xs uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-300">
                <tr>
                    <th class="px-4 py-3 border">Name</th>
                    <th class="px-4 py-3 border">Expire Date</th>
                    <th class="px-4 py-3 border">Remaining Qty</th>
                    <th class="px-4 py-3 border">Expires In</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in filteredProducts" :key="product.id"
                    class="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td class="px-4 py-2 font-medium border">{{ product.name }}</td>
                    <td class="px-4 py-2 border">{{ formatDate(product.expire_date) }}</td>
                    <td class="px-4 py-2 border">{{ product.quantity_remained }}</td>
                    <td class="px-4 py-2 font-semibold text-yellow-600 border dark:text-yellow-700">
                        {{ product.expiresIn }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { format } from 'date-fns'
import Back from '@/components/Back.vue'

const products = ref([])
const search = ref('')

const fetchExpiringProducts = async () => {
    try {
        const result = await window.electronAPI.getExpiringSoonProducts()
        products.value = result
    } catch (error) {
        console.error('Error fetching expiring products:', error)
        Swal.fire('Error', 'Failed to load expiring products.', 'error')
    }
}

const formatDate = (dateStr) => {
    try {
        return format(new Date(dateStr), 'PPP')
    } catch {
        return dateStr
    }
}

const filteredProducts = computed(() => {
    return products.value.filter(product =>
        product.name.toLowerCase().includes(search.value.toLowerCase())
    )
})

onMounted(() => {
    fetchExpiringProducts()
})
</script>
