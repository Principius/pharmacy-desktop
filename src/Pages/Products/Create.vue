<template>
    <div class="max-w-3xl p-6 mx-auto bg-white rounded shadow">
        <Back />
        <h2 class="mb-6 text-2xl font-bold">Create New Product</h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">

            <div>
                <label class="block mb-1 font-semibold" for="name">Name</label>
                <input v-model="form.name" id="name" type="text" required class="w-full px-3 py-2 border rounded" />
            </div>

            <div>
                <label class="block mb-1 font-semibold" for="brand">Brand</label>
                <input v-model="form.brand" id="brand" type="text" required class="w-full px-3 py-2 border rounded" />
            </div>

            <div>
                <label class="block mb-1 font-semibold" for="category">Category</label>
                <input v-model="form.category" id="category" type="text" class="w-full px-3 py-2 border rounded" />
            </div>

            <div>
                <label class="block mb-1 font-semibold" for="form">Form</label>
                <input v-model="form.form" id="form" type="text" class="w-full px-3 py-2 border rounded" />
            </div>

            <div>
                <label class="block mb-1 font-semibold" for="expire_date">Expire Date</label>
                <input v-model="form.expire_date" id="expire_date" type="date"
                    class="w-full px-3 py-2 border rounded" />
            </div>

            <div>
                <label class="block mb-1 font-semibold" for="batch_no">Batch No.</label>
                <input v-model="form.batch_no" id="batch_no" type="text" class="w-full px-3 py-2 border rounded" />
            </div>

            <div>
                <label class="block mb-1 font-semibold" for="buying_price">Buying Price</label>
                <input v-model.number="form.buying_price" id="buying_price" type="number" step="0.01"
                    class="w-full px-3 py-2 border rounded" />
            </div>

            <div>
                <label class="block mb-1 font-semibold" for="selling_price_per_unit">Selling Price Per Unit</label>
                <input v-model.number="form.selling_price_per_unit" id="selling_price_per_unit" type="number"
                    step="0.01" class="w-full px-3 py-2 border rounded" />
            </div>

            <div>
                <label class="block mb-1 font-semibold" for="supplier_name">Supplier Name</label>
                <input v-model="form.supplier_name" id="supplier_name" type="text"
                    class="w-full px-3 py-2 border rounded" />
            </div>

            <div>
                <label class="block mb-1 font-semibold" for="received_date">Received Date</label>
                <input v-model="form.received_date" id="received_date" type="date"
                    class="w-full px-3 py-2 border rounded" />
            </div>

            <div>
                <label class="block mb-1 font-semibold" for="quantity_remained">Quantity Remained</label>
                <input v-model.number="form.quantity_remained" id="quantity_remained" type="number"
                    class="w-full px-3 py-2 border rounded" />
            </div>

            <div>
                <label class="block mb-1 font-semibold" for="minimum_stock">Minimum Stock</label>
                <input v-model.number="form.minimum_stock" id="minimum_stock" type="number"
                    class="w-full px-3 py-2 border rounded" />
            </div>

            <div>
                <label class="block mb-1 font-semibold" for="buying_price_per_unit">Buying Price Per Unit</label>
                <input v-model.number="form.buying_price_per_unit" id="buying_price_per_unit" type="number" step="0.01"
                    class="w-full px-3 py-2 border rounded" />
            </div>

            <div>
                <label class="block mb-1 font-semibold" for="min_days_to_notify_expiring">Min Days To Notify
                    Expiring</label>
                <input v-model.number="form.min_days_to_notify_expiring" id="min_days_to_notify_expiring" type="number"
                    class="w-full px-3 py-2 border rounded" />
            </div>

            <button type="submit"
                class="w-full py-3 mt-4 font-semibold text-white transition bg-purple-600 rounded hover:bg-purple-700">
                Create Product
            </button>
        </form>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import Swal from 'sweetalert2'
import Back from '@/components/Back.vue'

const form = reactive({
    name: '',
    brand: '',
    category: '',
    form: '',
    expire_date: '',
    batch_no: '',
    buying_price: 0,
    selling_price_per_unit: 0,
    supplier_name: '',
    received_date: '',
    quantity_remained: 0,
    minimum_stock: 0,
    buying_price_per_unit: 0,
    min_days_to_notify_expiring: 0,
})

async function handleSubmit() {
    try {
        const plainForm = JSON.parse(JSON.stringify(form)) // convert reactive object to plain object
        const response = await window.electronAPI.createProduct(plainForm)

        if (response.success) {
            await Swal.fire('Success', 'Product created successfully!', 'success')
            // Reset form
            Object.keys(form).forEach(key => {
                form[key] = typeof form[key] === 'number' ? 0 : ''
            })
        } else {
            Swal.fire('Error', response.error || 'Failed to create product', 'error')
        }
    } catch (error) {
        Swal.fire('Error', error.message || 'Unexpected error', 'error')
    }
}

</script>
