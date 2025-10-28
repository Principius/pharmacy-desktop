<template>
    <div class="max-w-4xl p-6 mx-auto mt-8 bg-white rounded-lg shadow dark:bg-gray-900 dark:text-white">
        <!-- Back Button -->
        <Back />

        <!-- Page Title -->
        <h2 class="mt-8 mb-6 text-3xl font-extrabold text-gray-800 dark:text-white">Create Sale</h2>

        <!-- Form -->
        <form @submit.prevent="submitSales" class="space-y-6">
            <!-- Product Table -->
            <div class="overflow-x-auto">
                <table class="min-w-full text-sm text-left text-gray-700 dark:text-gray-200">

                    <thead class="bg-gray-200 dark:bg-gray-700">
                        <tr>
                            <th class="px-4 py-2">Product Name (Brand)</th>
                            <th class="px-4 py-2">Available</th>
                            <th class="px-4 py-2">Quantity to Sell</th>
                            <th class="px-4 py-2">Price per Unit (TZS)</th>
                            <th class="px-4 py-2">Discount</th>
                            <th class="px-4 py-2">Total</th>
                            <th class="px-4 py-2">Action</th> <!-- New column -->
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(product, index) in selectedProducts" :key="product.id"
                            class="border-b dark:border-gray-600">
                            <td class="px-4 py-2 font-medium">
                                {{ product.name }} ({{ product.brand }})<br>
                                <small class="text-gray-500 dark:text-gray-400">Batch {{ product.batch_no }}</small>
                            </td>
                            <td class="px-4 py-2">{{ product.quantity_remained }}</td>
                            <td class="px-4 py-2">
                                <input type="number" min="1" :max="product.quantity_remained"
                                    v-model.number="product.quantity_sold"
                                    class="w-20 px-2 py-1 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                            </td>
                            <td class="px-4 py-2">
                                <input type="number" step="0.01" v-model.number="product.price_per_unit"
                                    class="w-24 px-2 py-1 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                    :disabled="!canEditPrice"
                                    :class="{ 'bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed': !canEditPrice }" />
                            </td>
                            <td class="px-4 py-2">
                                <input type="number" step="0.01" v-model.number="product.discount_applied"
                                    class="w-24 px-2 py-1 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                    :disabled="!canEditDiscount"
                                    :class="{ 'bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed': !canEditDiscount }" />
                            </td>
                            <td class="px-4 py-2 font-semibold text-green-600 dark:text-green-400">
                                {{ ((product.quantity_sold || 0) * (product.price_per_unit || 0) -
                                    (product.discount_applied || 0)).toLocaleString() }} TZS
                            </td>
                            <td class="px-4 py-2">
                                <button @click.prevent="removeProduct(index)"
                                    class="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700">
                                    Remove
                                </button>
                            </td>
                        </tr>
                    </tbody>

                    <tfoot>
                        <tr class="font-bold text-purple-700 bg-gray-100 dark:bg-gray-800 dark:text-purple-400">
                            <td colspan="5" class="px-4 py-3 text-right">Grand Total:</td>
                            <td class="px-4 py-3">
                                {{ grandTotal.toLocaleString() }} TZS
                            </td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <!-- Submit Button -->
            <button type="submit" :disabled="selectedProducts.length === 0"
                class="w-full px-4 py-3 font-semibold text-white transition-all bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-400 dark:focus:ring-purple-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Submit Sale
            </button>
        </form>
    </div>

    <!-- Receipt Preview Modal -->
    <dialog ref="receiptDialog"
        class="w-full max-w-4xl p-10 bg-white rounded-lg shadow-2xl print:block dark:bg-gray-900">
        <div class="space-y-8">
            <!-- Header Section -->
            <div class="pb-6 text-center border-b border-gray-300 dark:border-gray-700">
                <h1 class="text-3xl font-bold tracking-wide text-gray-900 uppercase dark:text-white">
                    {{ pharmacyInfo?.name || 'Business Name' }}
                </h1>
                <div class="mt-2 space-x-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <span>{{ pharmacyInfo?.phone_number || '-' }}</span>
                    <span>•</span>
                    <span class="truncate" :title="pharmacyInfo?.email || '-'">{{ pharmacyInfo?.email || '-' }}</span>
                    <span>•</span>
                    <span class="truncate" :title="pharmacyInfo?.address || '-'">{{ pharmacyInfo?.address || '-'
                        }}</span>
                </div>
            </div>

            <!-- Receipt Title & Date -->
            <div class="text-center">
                <h2 class="text-2xl font-semibold text-gray-800 dark:text-white">Receipt</h2>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Date: {{ new Date().toLocaleString() }}
                </p>
            </div>

            <!-- Table Section -->
            <div class="overflow-x-auto">
                <table class="w-full text-sm border border-gray-300 rounded-md dark:border-gray-600">
                    <thead class="text-xs text-gray-800 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-100">
                        <tr>
                            <th class="p-4 text-left">Product</th>
                            <th class="p-4 text-right">Qty</th>
                            <th class="p-4 text-right">Unit Price</th>
                            <th class="p-4 text-right">Discount</th>
                            <th class="p-4 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(product, index) in selectedProducts" :key="index"
                            class="border-t border-gray-200 dark:border-gray-700 dark:text-white">
                            <td class="p-4">{{ product.name }} ({{ product.brand }})</td>
                            <td class="p-4 text-right">{{ product.quantity_sold }}</td>
                            <td class="p-4 text-right">{{ product.price_per_unit.toLocaleString() }}</td>
                            <td class="p-4 text-right">{{ product.discount_applied.toLocaleString() }}</td>
                            <td class="p-4 text-right">
                                {{
                                    (
                                        product.quantity_sold * product.price_per_unit -
                                        product.discount_applied
                                    ).toLocaleString()
                                }}
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr class="font-semibold text-gray-900 bg-gray-50 dark:bg-gray-800 dark:text-white">
                            <td colspan="4" class="p-4 text-right">Grand Total</td>
                            <td class="p-4 text-right">{{ grandTotal.toLocaleString() }}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <!-- Footer Section -->
            <div class="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                <div class="text-sm italic text-gray-400 select-none dark:text-gray-500">
                    Powered by Automate-XT
                </div>
                <div class="flex gap-4">
                    <button @click="closePreview"
                        class="px-5 py-2 text-sm text-gray-700 border rounded dark:text-white dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Cancel
                    </button>
                    <button @click="confirmAndPrint"
                        class="px-5 py-2 text-sm text-white bg-purple-600 rounded hover:bg-purple-700">
                        Print
                    </button>
                </div>
            </div>
        </div>
    </dialog>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import Back from '@/components/Back.vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const userStore = useUserStore()

const selectedProducts = ref([])
const receiptDialog = ref(null)
const isPrinting = ref(false)
const pharmacyInfo = ref(null)
const currentUser = ref(null)

const resetForm = () => {
    selectedProducts.value = []
}

// Load saved selected products from localStorage
const updateSelectedProducts = () => {
    const saved = localStorage.getItem("selectedProducts")
    if (saved) {
        selectedProducts.value = JSON.parse(saved).map(p => ({
            ...p,
            quantity_sold: p.quantity_sold ?? 1,   // ✅ keep entered value if present
            price_per_unit: p.price_per_unit ?? p.selling_price_per_unit ?? 0,
            discount_applied: p.discount_applied ?? 0,
        }))

    }
}

onMounted(async () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) currentUser.value = JSON.parse(savedUser)

    updateSelectedProducts()
    pharmacyInfo.value = await window.electronAPI.pharmacyGetInfo()

     // ✅ Add global keydown listener for Enter
    window.addEventListener("keydown", handleEnterKey)
})

onUnmounted(() => {
    window.removeEventListener("keydown", handleEnterKey)
})

const handleEnterKey = (e) => {
    if (e.key === "Enter") {
        // Prevent default form behavior
        e.preventDefault()

        // Only submit if products exist and not inside a dialog
        if (selectedProducts.value.length > 0 && !receiptDialog.value?.open) {
            submitSales()
        }
    }
}

// Persist edits (qty, price, discount) back to localStorage
watch(selectedProducts, (newVal) => {
    localStorage.setItem("selectedProducts", JSON.stringify(newVal))
}, { deep: true })

const canEditPrice = computed(() =>
    currentUser.value?.permissions?.includes('canEditPrice')
)

const canEditDiscount = computed(() =>
    currentUser.value?.permissions?.includes('canEditDiscount')
)

const grandTotal = computed(() =>
    selectedProducts.value.reduce((sum, product) => {
        const total = (product.quantity_sold || 0) * (product.price_per_unit || 0) - (product.discount_applied || 0)
        return sum + (total > 0 ? total : 0)
    }, 0)
)

const removeProduct = (index) => {
    selectedProducts.value.splice(index, 1)
    localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts.value))
}

const submitSales = async () => {
    const result = await Swal.fire({
        title: 'Print Receipt?',
        text: 'Do you want to preview and print the receipt for this sale?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, preview',
        cancelButtonText: 'No, cancel',
    })

    if (result.isConfirmed) {
        receiptDialog.value?.showModal()
    } else {
        const plainProducts = selectedProducts.value.map(p => {
            const total_cost = (p.quantity_sold * p.price_per_unit) - (p.discount_applied || 0)
            return {
                ...p,
                product_id: p.id,
                total_cost: total_cost > 0 ? total_cost : 0,
                price_before_discount: p.quantity_sold * (p.selling_price_per_unit_before_discount || p.price_per_unit),
                expected_selling_price: p.selling_price_per_unit || p.price_per_unit,
                seller_id: userStore.user?.id || null,
            }
        })

        const res = await window.electronAPI.createSale(plainProducts)
        if (res.success) {
            Swal.fire('Success', 'Sale completed!', 'success')
            resetForm()
        } else {
            Swal.fire('Error', 'Failed to record sale.', 'error')
        }
    }
}

const closePreview = () => {
    receiptDialog.value?.close()
}

const confirmAndPrint = async () => {
    isPrinting.value = true
    try {
        const plainProducts = selectedProducts.value.map(p => {
            const total_cost = (p.quantity_sold * p.price_per_unit) - (p.discount_applied || 0)
            return {
                ...p,
                product_id: p.id,
                total_cost: total_cost > 0 ? total_cost : 0,
                price_before_discount: p.quantity_sold * (p.selling_price_per_unit_before_discount || p.price_per_unit),
                expected_selling_price: p.selling_price_per_unit || p.price_per_unit,
                seller_id: userStore.user?.id || null,
            }
        })

        const res = await window.electronAPI.createSale(plainProducts)

        if (res.success) {
            closePreview()
            await new Promise(resolve => setTimeout(resolve, 300))
            window.print()
            Swal.fire('Success', 'Sale completed!', 'success')
            resetForm()
        } else {
            throw new Error(res.error || 'Failed to create sale')
        }
    } catch (err) {
        Swal.fire('Error', err.message, 'error')
    } finally {
        isPrinting.value = false
    }
}
</script>
