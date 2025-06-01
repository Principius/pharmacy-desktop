<template>
    <div class="p-6">
        <h2 class="mb-4 text-xl font-semibold">Product List</h2>

        <div v-if="loading" class="text-gray-600">Loading products...</div>
        <div v-else-if="products.length === 0" class="text-gray-600">No products found.</div>

        <div v-else class="overflow-auto">
            <table class="min-w-full text-sm text-left bg-white border border-gray-200 rounded shadow">
                <thead class="text-xs font-semibold uppercase bg-gray-100">
                    <tr>
                        <th class="p-3 border">Name</th>
                        <th class="p-3 border">Brand</th>
                        <th class="p-3 border">Category</th>
                        <th class="p-3 border">Form</th>
                        <th class="p-3 border">Batch No</th>
                        <th class="p-3 border">Expire Date</th>
                        <th class="p-3 border">Qty Remained</th>
                        <th class="p-3 border">Buying Price/Unit</th>
                        <th class="p-3 border">Buying Price</th>
                        <th class="p-3 border">Selling Price/Unit</th>
                        <th class="p-3 border">Supplier Name</th>
                        <th class="p-3 border">Received Date</th>
                        <th class="p-3 border">Minimum Stock</th>
                        <th class="p-3 border">Min Days to Notify Expiring</th>
                        <th class="p-3 border">Created At</th>
                        <th class="p-3 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50">
                        <td class="p-2 border">{{ product.name }}</td>
                        <td class="p-2 border">{{ product.brand }}</td>
                        <td class="p-2 border">{{ product.category }}</td>
                        <td class="p-2 border">{{ product.form }}</td>
                        <td class="p-2 border">{{ product.batch_no }}</td>
                        <td class="p-2 border">{{ product.expire_date }}</td>
                        <td class="p-2 border">{{ product.quantity_remained }}</td>
                        <td class="p-2 border">{{ product.buying_price_per_unit }}</td>
                        <td class="p-2 border">{{ product.buying_price }}</td>
                        <td class="p-2 border">{{ product.selling_price_per_unit }}</td>
                        <td class="p-2 border">{{ product.supplier_name }}</td>
                        <td class="p-2 border">{{ product.received_date }}</td>
                        <td class="p-2 border">{{ product.minimum_stock }}</td>
                        <td class="p-2 border">{{ product.min_days_to_notify_expiring }}</td>
                        <td class="p-2 border">{{ product.created_at }}</td>
                        <td class="p-2 text-center border">
                            <button @click="openEditModal(product)"
                                class="px-2 py-1 mr-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600">
                                Edit
                            </button>
                            <button @click="deleteProduct(product.id)"
                                class="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600">
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Edit Modal -->
        <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div class="w-full max-w-2xl p-6 bg-white rounded-lg">
                <h3 class="mb-4 text-lg font-semibold">Edit Product</h3>
                <div class="grid grid-cols-2 gap-4">
                    <label class="block">
                        <span class="text-sm">Name</span>
                        <input v-model="editForm.name" class="w-full px-3 py-2 border rounded" />
                    </label>
                    <label class="block">
                        <span class="text-sm">Brand</span>
                        <input v-model="editForm.brand" class="w-full px-3 py-2 border rounded" />
                    </label>
                    <label class="block">
                        <span class="text-sm">Category</span>
                        <input v-model="editForm.category" class="w-full px-3 py-2 border rounded" />
                    </label>
                    <label class="block">
                        <span class="text-sm">Form</span>
                        <input v-model="editForm.form" class="w-full px-3 py-2 border rounded" />
                    </label>
                    <label class="block">
                        <span class="text-sm">Expire Date</span>
                        <input v-model="editForm.expire_date" class="w-full px-3 py-2 border rounded" />
                    </label>
                    <label class="block">
                        <span class="text-sm">Batch No.</span>
                        <input v-model="editForm.batch_no" class="w-full px-3 py-2 border rounded" />
                    </label>
                    <label class="block">
                        <span class="text-sm">Quantity Remained</span>
                        <input v-model="editForm.quantity_remained" class="w-full px-3 py-2 border rounded" />
                    </label>
                    <label class="block">
                        <span class="text-sm">Buying Price Per Unit</span>
                        <input v-model="editForm.buying_price_per_unit" class="w-full px-3 py-2 border rounded" />
                    </label>
                    <label class="block">
                        <span class="text-sm">Buying Price</span>
                        <input type="number" v-model="editForm.buying_price" class="w-full px-3 py-2 border rounded" />
                    </label>
                    <label class="block">
                        <span class="text-sm">Selling Price/Unit</span>
                        <input type="number" v-model="editForm.selling_price_per_unit"
                            class="w-full px-3 py-2 border rounded" />
                    </label>
                    <label class="block">
                        <span class="text-sm">Supplier Name</span>
                        <input v-model="editForm.supplier_name" class="w-full px-3 py-2 border rounded" />
                    </label>
                    <label class="block">
                        <span class="text-sm">Received Date</span>
                        <input v-model="editForm.received_date" class="w-full px-3 py-2 border rounded" />
                    </label>
                    <label class="block">
                        <span class="text-sm">Minimum Stock</span>
                        <input v-model="editForm.minimum_stock" class="w-full px-3 py-2 border rounded" />
                    </label>
                    <label class="block">
                        <span class="text-sm">Min Days To Notify Expiring</span>
                        <input v-model="editForm.min_days_to_notify_expiring" class="w-full px-3 py-2 border rounded" />
                    </label>
                </div>

                <div class="flex justify-end gap-3 mt-4">
                    <button @click="showEditModal = false" class="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button @click="saveProductEdit"
                        class="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const products = ref([])
const loading = ref(true)

const showEditModal = ref(false)
const editForm = ref({})

function openEditModal(product) {
    editForm.value = { ...product }
    showEditModal.value = true
}

async function saveProductEdit() {
    try {
        const cleanPayload = JSON.parse(JSON.stringify(editForm.value)) // ensures cloneable plain object

        const result = await window.electronAPI.changeProduct(cleanPayload)
        if (result.success) {
            const index = products.value.findIndex(p => p.id === editForm.value.id)
            if (index !== -1) {
                products.value[index] = { ...editForm.value }
            }
            alert(result.message)
            showEditModal.value = false
        } else {
            alert(result.message || 'Failed to update product.')
        }
    } catch (error) {
        console.error(error)
        alert('Unexpected error while saving.')
    }
}

function deleteProduct(productId) {
    const confirmed = confirm('Are you sure you want to delete this product?')
    if (!confirmed) return
    products.value = products.value.filter(p => p.id !== productId)
}

onMounted(async () => {
    loading.value = true
    try {
        const result = await window.electronAPI.getLatestProducts()
        if (result.success) {
            products.value = result.products
        } else {
            alert(result.message || 'Failed to load products.')
        }
    } catch (error) {
        console.error('Failed to fetch products:', error)
        alert('Unexpected error fetching products.')
    } finally {
        loading.value = false
    }
})
</script>
