<template>
    <div v-if="sale" class="max-w-3xl p-6 mx-auto bg-white rounded-lg shadow-md dark:bg-gray-900">
        <Back />

        <h2 class="mb-6 text-3xl font-extrabold text-gray-900 dark:text-gray-100">Edit Sale</h2>

        <form @submit.prevent="handleUpdate" class="space-y-5">
            <!-- Product Name (Read-Only) -->
            <div>
                <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
                <input type="text" :value="sale.product_name || 'Unknown Product'" disabled
                    class="w-full px-4 py-2 text-gray-600 bg-gray-100 border border-gray-300 rounded cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400" />
            </div>

            <!-- Quantity Sold -->
            <div>
                <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Quantity Sold</label>
                <input v-model.number="sale.quantity_sold" type="number" min="0"
                    class="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    placeholder="Enter quantity" />
            </div>

            <!-- Price Per Unit -->
            <div>
                <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Price Per Unit</label>
                <input v-model.number="sale.price_per_unit" type="number" min="0"
                    class="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    placeholder="Enter unit price" />
            </div>

            <!-- Discount Applied -->
            <div>
                <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Discount Applied</label>
                <input v-model.number="sale.discount_applied" type="number" min="0"
                    class="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    placeholder="Enter discount" />
            </div>

            <!-- Expected Selling Price -->
            <div>
                <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Expected Selling
                    Price</label>
                <input v-model.number="sale.expected_selling_price" type="number" min="0"
                    class="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    placeholder="Enter expected price" />
            </div>

            <!-- Submit Button -->
            <button type="submit"
                class="w-full px-4 py-3 font-semibold text-white transition bg-purple-600 rounded-lg shadow hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                Update Sale
            </button>
        </form>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import Back from '@/components/Back.vue'

const route = useRoute()
const router = useRouter()

const sale = ref(null)

onMounted(async () => {
    const id = parseInt(route.query.id)
    if (!id) {
        router.push('/sales') // redirect if no ID provided
        return
    }

    const data = await window.electronAPI.getSaleById(id)
    if (!data) {
        Swal.fire('Error', 'Sale not found.', 'error')
        router.push('/sales')
    } else {
        sale.value = data
    }
})

const handleUpdate = async () => {
    try {
        const quantity = sale.value.quantity_sold
        const unitPrice = sale.value.price_per_unit
        const discount = sale.value.discount_applied || 0

        const price_before_discount = unitPrice * quantity
        const total_cost = price_before_discount - discount

        const cleaned = {
            id: sale.value.id,
            product_id: sale.value.product_id,
            quantity_sold: quantity,
            price_per_unit: unitPrice,
            discount_applied: discount,
            expected_selling_price: sale.value.expected_selling_price,
            total_cost,
            price_before_discount, // ✅ Add this field
        }

        const response = await window.electronAPI.updateSale(cleaned.id, cleaned)
        if (response.success) {
            Swal.fire('Success', 'Sale updated successfully!', 'success')
        } else {
            throw new Error(response.error || 'Failed to update sale')
        }
    } catch (error) {
        Swal.fire('Error', error.message, 'error')
    }
}

</script>
