<template>
    <div class="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow dark:bg-gray-900 dark:text-white">
        <!-- Back Button -->
        <Back />

        <!-- Page Title -->
        <h2 class="mb-6 text-3xl font-extrabold text-gray-800 dark:text-white">Create Sale</h2>

        <!-- Form -->
        <form @submit.prevent="submitSales" class="space-y-6">
            <!-- Product Form Cards -->
            <div v-for="(product, index) in selectedProducts" :key="product.id"
                class="p-5 space-y-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                <div class="text-lg font-semibold">
                    {{ product.name }} ({{ product.brand }}) — <span class="text-sm text-gray-500">Batch {{
                        product.batch_no }}</span>
                </div>

                <p class="text-sm text-gray-600 dark:text-gray-400">Available: <span class="font-medium">{{
                    product.quantity_remained }}</span></p>

                <!-- Quantity -->
                <div>
                    <label :for="`quantity-${index}`" class="block mb-1 text-sm font-medium">Quantity to Sell</label>
                    <input :id="`quantity-${index}`" v-model.number="product.quantity_sold" type="number" min="1"
                        :max="product.quantity_remained"
                        class="w-full px-4 py-2 text-sm border rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Enter quantity" />
                </div>

                <!-- Price -->
                <div>
                    <label :for="`price-${index}`" class="block mb-1 text-sm font-medium">Price per Unit (TZS)</label>
                    <input :id="`price-${index}`" v-model.number="product.price_per_unit" type="number" step="0.01"
                        class="w-full px-4 py-2 text-sm border rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Enter price per unit" />
                </div>

                <!-- Discount -->
                <div>
                    <label :for="`discount-${index}`" class="block mb-1 text-sm font-medium">Discount (optional)</label>
                    <input :id="`discount-${index}`" v-model.number="product.discount_applied" type="number" step="0.01"
                        class="w-full px-4 py-2 text-sm border rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Enter discount" />
                </div>

                <!-- Total for Product -->
                <p class="pt-2 text-sm font-semibold text-green-700 dark:text-green-400">
                    Total:
                    {{ (product.quantity_sold * product.price_per_unit - product.discount_applied).toLocaleString() }}
                    TZS
                </p>
            </div>

            <!-- Grand Total -->
            <div
                class="pt-6 text-xl font-bold text-right text-purple-700 border-t border-gray-200 dark:text-purple-400 dark:border-gray-700">
                Grand Total: {{ grandTotal.toLocaleString() }} TZS
            </div>

            <!-- Submit Button -->
            <button type="submit"
                class="w-full px-4 py-3 font-semibold text-white transition-all bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-400 dark:focus:ring-purple-700">
                Submit Sale
            </button>
        </form>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import Back from '@/components/Back.vue'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

const selectedProducts = ref([])

const grandTotal = computed(() =>
    selectedProducts.value.reduce((sum, product) => {
        const total = (product.quantity_sold || 0) * (product.price_per_unit || 0) - (product.discount_applied || 0)
        return sum + (total > 0 ? total : 0)
    }, 0)
)

onMounted(() => {
    selectedProducts.value = JSON.parse(route.query.selected || '[]').map(product => ({
        ...product,
        quantity_sold: 1,
        price_per_unit: product.selling_price_per_unit || 0,
        discount_applied: 0,
    }))
})

const submitSales = async () => {
    try {
        selectedProducts.value.forEach(p => {
            if (!p.id) console.warn('Product missing id:', p)
        })
        console.log('Submitting products:', selectedProducts.value)

        // 🔁 Convert each product to include `product_id`
        const plainProducts = JSON.parse(JSON.stringify(selectedProducts.value)).map(p => {
            const total_cost = (p.quantity_sold * p.price_per_unit) - (p.discount_applied || 0)
            return {
                ...p,
                product_id: p.id,
                total_cost: total_cost > 0 ? total_cost : 0,
                price_before_discount: p.quantity_sold * (p.selling_price_per_unit_before_discount || p.price_per_unit),
                expected_selling_price: p.selling_price_per_unit || p.price_per_unit,
            }
        })

        const res = await window.electronAPI.createSale(plainProducts)

        if (res.success) {
            Swal.fire('Success', 'Sale completed!', 'success')
            router.push('/sales/select')
        } else {
            throw new Error(res.error || 'Failed to create sale')
        }
    } catch (err) {
        Swal.fire('Error', err.message, 'error')
    }
}

</script>
