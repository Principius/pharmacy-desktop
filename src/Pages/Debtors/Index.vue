<template>
    <div class="p-6 space-y-6 text-[15px]">
        <Back />

        <h1 class="text-2xl font-bold text-indigo-600 dark:text-indigo-800">Debtors</h1>
        <div class="flex justify-end">
            <button @click="showCreateForm = !showCreateForm"
                class="px-4 py-2 mb-4 text-sm font-semibold text-white transition-all duration-200 bg-indigo-600 rounded hover:bg-indigo-700 focus:ring focus:ring-indigo-300">
                {{ showCreateForm ? '➖ Cancel' : '➕ Create Debtor' }}
            </button>
        </div>

        <template v-if="showCreateForm">
            <form @submit.prevent="handleAddDebtor" class="p-6 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
                <!-- Debtor Info -->
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <!-- Name -->
                    <div class="space-y-1">
                        <label for="name"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
                        <input id="name" v-model="newDebtor.name" placeholder="Enter debtor name"
                            class="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:text-gray-100 input dark:border-gray-600"
                            required />
                    </div>

                    <!-- Phone -->
                    <div class="space-y-1">
                        <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Phone
                            (optional)</label>
                        <input id="phone" v-model="newDebtor.phone" placeholder="Enter phone number"
                            class="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:text-gray-100 input dark:border-gray-600" />
                    </div>

                    <!-- Description -->
                    <div class="space-y-1 md:col-span-2">
                        <label for="description"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-200">Description
                            (optional)</label>
                        <textarea id="description" v-model="newDebtor.description" placeholder="Write a short note..."
                            class="w-full h-24 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm resize-none dark:bg-gray-800 dark:text-gray-100 input dark:border-gray-600"></textarea>
                    </div>

                    <!-- Due Date -->
                    <div class="space-y-1">
                        <label for="due_date" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Due
                            Date</label>
                        <input id="due_date" v-model="newDebtor.due_date" type="date"
                            class="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:text-gray-100 input dark:border-gray-600"
                            required />
                    </div>
                </div>

                <!-- Product Selection -->
                <div class="space-y-3">
                    <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200">Select Products</h2>

                    <!-- 🔍 Search -->
                    <input type="text" v-model="productSearch" placeholder="Search products..." class="w-full input" />

                    <!-- Products List -->
                    <div class="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        <div v-for="product in filteredProducts" :key="product.id"
                            class="flex items-center justify-between gap-4 py-2 border-b border-gray-200 dark:border-gray-700">
                            <div class="flex items-center flex-1 gap-2">
                                <input type="checkbox" v-model="product.selected" @change="calculateTotal"
                                    class="accent-indigo-500" />
                                <label class="text-sm text-gray-800 cursor-pointer dark:text-gray-200">
                                    {{ product.name }} -
                                    <span class="text-indigo-600 dark:text-indigo-300">
                                        TZS {{ product.selling_price_per_unit }}
                                    </span>
                                    <span class="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                        (Available: {{ product.quantity_remained }})
                                    </span>
                                </label>
                            </div>

                            <input type="number" v-model.number="product.quantity" :min="1"
                                :max="product.quantity_remained" step="1" :disabled="!product.selected"
                                class="w-24 text-sm text-center border border-gray-300 rounded-md shadow-sm input focus:ring focus:ring-indigo-300 disabled:opacity-50"
                                @input="calculateTotal"
                                :title="'Enter quantity (1 to ' + product.quantity_remained + ')'"
                                :aria-label="'Quantity for ' + product.name" />

                        </div>
                    </div>
                </div>

                <!-- Calculated Total -->
                <div class="text-lg font-semibold text-right text-indigo-700 dark:text-indigo-300">
                    Total: TZS {{ newDebtor.amount_owed }}
                </div>

                <button
                    class="w-full px-4 py-2 text-white transition-all duration-200 bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300">
                    ➕ Add Debtor
                </button>
            </form>
        </template>

        <!-- Sync Button -->
        <div class="flex justify-end">
            <button @click="syncDebtors" :disabled="syncing"
                class="px-4 py-2 text-sm font-semibold text-white transition-all duration-200 bg-green-600 rounded hover:bg-green-700 focus:ring focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed">
                {{ syncing ? 'Syncing...' : '☁️ Sync Debtors to Cloud' }}
            </button>
        </div>
        <div class="mb-4 text-[15px]">
            <input type="text" v-model="searchQuery" placeholder="🔍 Search debtors by name, phone, or description..."
                class="w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:text-gray-100 input dark:border-gray-600" />
        </div>

        <!-- Debtor List Table -->
        <div class="overflow-x-auto text-[15px]">
            <table class="min-w-full text-sm text-left bg-white rounded-lg shadow dark:bg-gray-800 dark:text-gray-200">
                <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                    <tr>
                        <th class="px-4 py-3">Name</th>
                        <th class="px-4 py-3">Phone</th>
                        <th class="px-4 py-3">Amount Owed</th>
                        <th class="px-4 py-3">Due Date</th>
                        <th class="px-4 py-3">Description</th>
                        <th class="px-4 py-3">Is Synced</th>
                        <th class="px-4 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="debtor in filteredDebtors" :key="debtor.id" class="px-4 py-4 border-b text-[15px] dark:border-gray-700">
                        <td class="px-4 py-2 font-medium">{{ debtor.name }}</td>
                        <td class="px-4 py-2">{{ debtor.phone || 'N/A' }}</td>
                        <td class="px-4 py-2">TZS {{ debtor.amount_owed }}</td>
                        <td class="px-4 py-2">{{ debtor.due_date }}</td>
                        <td class="px-4 py-2">{{ debtor.description || '-' }}</td>
                        <td class="px-4 py-2">
                            <span
                                :class="debtor.is_synced ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                                {{ debtor.is_synced ? '✅ Yes' : '❌ No' }}
                            </span>
                        </td>
                        <td class="px-4 py-2 space-x-2 text-center">
                            <button @click="viewProducts(debtor)"
                                class="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700">
                                📦 View
                            </button>
                            <button @click="remove(debtor.id)"
                                class="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700">
                                🗑️ Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    </div>
    <!-- Modal -->
    <transition name="fade">
        <div v-if="showProductsModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="w-full max-w-md p-6 bg-white rounded shadow-lg dark:bg-gray-800">
                <h3 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Products for {{
                    selectedDebtor?.name }}</h3>

                <ul class="space-y-2 text-gray-800 dark:text-gray-200">
                    <li v-for="(product, index) in debtorProducts" :key="index" class="pb-2 border-b">
                        <div class="flex items-center justify-between">
                            <span>{{ product.name }}</span>
                            <span>{{ product.quantity }} x TZS {{ product.price }}</span>
                        </div>
                    </li>
                </ul>

                <div class="mt-4 text-right">
                    <button @click="closeProductsModal"
                        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700">
                        Close
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>


<script setup>
import Swal from 'sweetalert2'
import Back from '@/components/Back.vue'
import { ref, onMounted, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const productSearch = ref('')
const searchQuery = ref('')
const debtors = ref([])
const products = ref([])
const showCreateForm = ref(false)
const showProductsModal = ref(false)
const debtorProducts = ref([])
const selectedDebtor = ref(null)

const newDebtor = ref({
    name: '',
    phone: '',
    description: '',
    due_date: '',
    amount_owed: 0,
    debtor_uuid: uuidv4()
})

const resetNewDebtor = () => {
    newDebtor.value = {
        name: '',
        phone: '',
        description: '',
        due_date: '',
        amount_owed: 0,
        debtor_uuid: uuidv4()
    }

    products.value.forEach(p => {
        p.selected = false
        p.quantity = 1
    })
}

const filteredProducts = computed(() => {
    if (!productSearch.value.trim()) return products.value
    return products.value.filter(p =>
        p.name.toLowerCase().includes(productSearch.value.toLowerCase())
    )
})

const filteredDebtors = computed(() => {
    if (!searchQuery.value.trim()) return debtors.value

    return debtors.value.filter(debtor =>
        debtor.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        (debtor.phone && debtor.phone.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
        (debtor.description && debtor.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
})

const fetchDebtors = async () => {
    debtors.value = await window.electronAPI.readDebtors()
}

const fetchProducts = async () => {
    const response = await window.electronAPI.readProducts()
    if (response.success) {
        products.value = response.products.map(p => ({
            ...p,
            selected: false,
            quantity: 1,
        }))
    }
}

const calculateTotal = () => {
    const selected = products.value.filter(p => p.selected && p.quantity > 0)
    const total = selected.reduce((sum, p) => sum + p.selling_price_per_unit * p.quantity, 0)
    newDebtor.value.amount_owed = total
}

const handleAddDebtor = async () => {
    const { name, amount_owed, due_date } = newDebtor.value
    const selectedProducts = products.value
        .filter(p => p.selected && p.quantity > 0)
        .map(p => ({
            id: p.id,
            quantity: p.quantity,
            price: p.selling_price_per_unit
        }))

    if (!name || !amount_owed || !due_date || selectedProducts.length === 0) {
        Swal.fire('Missing Information', 'Please fill in all required fields and select products.', 'warning')
        return
    }

    try {
        await window.electronAPI.createDebtorWithProducts({
            ...newDebtor.value,
            products: selectedProducts
        })
        Swal.fire('Created', 'Debtor added successfully.', 'success')

        resetNewDebtor()
        await fetchDebtors()
        await fetchProducts()
    } catch (error) {
        Swal.fire('Error', 'Something went wrong.', 'error')
    }
}

const remove = async (id) => {
    const confirm = await Swal.fire({
        title: 'Delete Debtor?',
        text: 'Are you sure you want to delete this debtor?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
    })

    if (confirm.isConfirmed) {
        await window.electronAPI.deleteDebtor(id)
        await fetchDebtors()
        await fetchProducts()
        Swal.fire('Deleted', 'Debtor deleted successfully.', 'success')
    }
}

const viewProducts = async (debtor) => {
    selectedDebtor.value = debtor
    const response = await window.electronAPI.getDebtorProducts(debtor.id)
    debtorProducts.value = response
    showProductsModal.value = true
}

const closeProductsModal = () => {
    showProductsModal.value = false
    selectedDebtor.value = null
    debtorProducts.value = []
}

onMounted(() => {
    fetchDebtors()
    fetchProducts()
})

const syncing = ref(false)

const syncDebtors = async () => {
    syncing.value = true
    try {
        const response = await window.electronAPI.syncDebtorsToCloud()
        Swal.fire('Success', response.message || 'Debtors synced to the cloud.', 'success')
        await fetchDebtors()
        await fetchProducts()
    } catch (error) {
        Swal.fire('Sync Failed', error.message || 'Could not sync debtors.', 'error')
    } finally {
        syncing.value = false
    }
}

</script>
