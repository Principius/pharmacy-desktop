<template>
    <div class="w-full mt-4  mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-900 dark:text-white">
        <Back />
        <h1 class="mt-4 text-3xl font-bold mb-6 text-purple-700 dark:text-purple-400">
            Pending Products
        </h1>

        <!-- Add New Product Button -->
        <button @click="openAddModal"
            class="mb-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-green-400">
            + Add New Pending Product
        </button>

        <!-- Sync to Cloud Button -->
        <button @click="syncToCloud" :disabled="isSyncing"
            class="mb-6 ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50">
            {{ isSyncing ? "Syncing..." : "Sync Pending Products to Cloud" }}
        </button>

        <!-- Pending Products Table -->
        <table class="w-full text-left border-collapse border border-gray-300 dark:border-gray-700">
            <thead class="bg-gray-100 dark:bg-gray-800">
                <tr>
                    <th class="border px-4 py-2">Name</th>
                    <th class="border px-4 py-2">Brand</th>
                    <th class="border px-4 py-2">Category</th>
                    <th class="border px-4 py-2">Form</th>
                    <th class="border px-4 py-2">Expire Date</th>
                    <th class="border px-4 py-2">Batch No</th>
                    <th class="border px-4 py-2">Buying Price</th>
                    <th class="border px-4 py-2">Selling Price</th>
                    <th class="border px-4 py-2">Supplier</th>
                    <th class="border px-4 py-2">Quantity</th>
                    <th class="border px-4 py-2">Min Stock</th>
                    <th class="border px-4 py-2">Price/Unit</th>
                    <th class="border px-4 py-2">Notify Before (Days)</th>
                    <th class="border px-4 py-2">Status</th>
                    <th class="border px-4 py-2">Synced</th>
                    <th class="border px-4 py-2">Actions</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="product in pendingProducts" :key="product.id"
                    class="border hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td class="px-4 py-2">{{ product.name }}</td>
                    <td class="px-4 py-2">{{ product.brand || '-' }}</td>
                    <td class="px-4 py-2">{{ product.category || '-' }}</td>
                    <td class="px-4 py-2">{{ product.form || '-' }}</td>
                    <td class="px-4 py-2">{{ product.expire_date?.split('T')[0] || '-' }}</td>
                    <td class="px-4 py-2">{{ product.batch_no || '-' }}</td>
                    <td class="px-4 py-2">{{ product.buying_price ?? '-' }}</td>
                    <td class="px-4 py-2">{{ product.selling_price_per_unit ?? '-' }}</td>
                    <td class="px-4 py-2">{{ product.supplier_name || '-' }}</td>
                    <td class="px-4 py-2">{{ product.quantity_remained ?? '-' }}</td>
                    <td class="px-4 py-2">{{ product.minimum_stock ?? '-' }}</td>
                    <td class="px-4 py-2">{{ product.buying_price_per_unit ?? '-' }}</td>
                    <td class="px-4 py-2">{{ product.min_days_to_notify_expiring ?? '-' }}</td>
                    <td class="px-4 py-2 capitalize">{{ product.status }}</td>
                    <td class="px-4 py-2 text-center">
                        <span :class="product.is_synced ? 'text-green-600' : 'text-yellow-600'">
                            {{ product.is_synced ? '✔' : '✘' }}
                        </span>
                    </td>
                    <td class="px-4 py-2 space-x-2">
                        <button @click="openEditModal(product)" class="text-blue-600 hover:underline">Edit</button>
                        <button @click="deletePendingProduct(product.id)"
                            class="text-red-600 hover:underline">Delete</button>
                    </td>
                </tr>
                <tr v-if="pendingProducts.length === 0">
                    <td colspan="6" class="text-center py-6 text-gray-500 dark:text-gray-400 italic">
                        No pending products found.
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Modal for Add/Edit Product -->
        <dialog ref="productDialog"
            class="w-full max-w-lg p-6 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <h2 class="text-xl font-bold mb-4">
                {{ isEditing ? "Edit" : "Add" }} Pending Product
            </h2>
            <form @submit.prevent="saveProduct" class="space-y-4">
                <div v-if="isEditing">
                    <label class="block mb-1 font-semibold">Product UUID</label>
                    <input v-model="form.product_uuid" type="text" disabled
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700 cursor-not-allowed opacity-70" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Name *</label>
                    <input v-model="form.name" required type="text"
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Brand</label>
                    <input v-model="form.brand" type="text"
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Category</label>
                    <input v-model="form.category" type="text"
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Form</label>
                    <input v-model="form.form" type="text"
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Expire Date</label>
                    <input v-model="form.expire_date" type="date"
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Batch No</label>
                    <input v-model="form.batch_no" type="text"
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Total Buying Price</label>
                    <input v-model.number="form.buying_price" type="number" step="0.01" min="0" required
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Selling Price Per Unit</label>
                    <input v-model.number="form.selling_price_per_unit" type="number" step="0.01" min="0" required
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Supplier Name</label>
                    <input v-model="form.supplier_name" type="text"
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Quantity Remained</label>
                    <input v-model.number="form.quantity_remained" type="number" min="0" required
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Minimum Stock</label>
                    <input v-model.number="form.minimum_stock" type="number" min="0"
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Buying Price Per Unit</label>
                    <input v-model.number="form.buying_price_per_unit" type="number" step="0.01" min="0"
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Min Days To Notify Expiring</label>
                    <input v-model.number="form.min_days_to_notify_expiring" type="number" min="0"
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Status</label>
                    <select v-model="form.status"
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700">
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                <div class="flex justify-end space-x-4">
                    <button type="button" @click="closeModal"
                        class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600">
                        Cancel
                    </button>
                    <button type="submit" class="px-4 py-2 bg-purple-600 rounded text-white hover:bg-purple-700">
                        {{ isEditing ? "Update" : "Add" }}
                    </button>
                </div>
            </form>
        </dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import Back from "@/components/Back.vue";
import Swal from "sweetalert2";

const pendingProducts = ref([]);
const isSyncing = ref(false);

const productDialog = ref(null);
const isEditing = ref(false);
const form = ref({
    id: null,
    product_uuid: "",
    name: "",
    brand: "",
    category: "",
    form: "",
    expire_date: "",
    batch_no: "",
    buying_price: 0,
    selling_price_per_unit: 0,
    supplier_name: "",
    received_date: "",
    quantity_remained: 0,
    minimum_stock: 0,
    buying_price_per_unit: 0,
    min_days_to_notify_expiring: 0,
    status: "pending",
});

// Watch buying_price and quantity_remained to auto-calc buying_price_per_unit
watch(
    () => [form.value.buying_price, form.value.quantity_remained],
    ([newBuyingPrice, newQuantity]) => {
        if (newQuantity > 0 && newBuyingPrice >= 0) {
            form.value.buying_price_per_unit = +(
                newBuyingPrice / newQuantity
            ).toFixed(2);
        } else {
            form.value.buying_price_per_unit = 0;
        }
    }
);

async function fetchPendingProducts() {
    pendingProducts.value = await window.electronAPI.readPendingProducts();
}

function openAddModal() {
    isEditing.value = false;

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    form.value = {
        id: null,
        product_uuid: "",
        name: "",
        brand: "",
        category: "",
        form: "",
        expire_date: "",
        batch_no: "",
        buying_price: 0,
        selling_price_per_unit: 0,
        supplier_name: "",
        received_date: today, // 👈 auto-filled here
        quantity_remained: 0,
        minimum_stock: 0,
        buying_price_per_unit: 0,
        min_days_to_notify_expiring: 0,
        status: "pending",
    };

    productDialog.value.showModal();
}


function openEditModal(product) {
    isEditing.value = true;
    form.value = { ...product };
    productDialog.value.showModal();
}

function closeModal() {
    productDialog.value.close();
}

async function saveProduct() {
    const safeData = JSON.parse(JSON.stringify(form.value));

    try {
        if (isEditing.value) {
            await window.electronAPI.updatePendingProduct(safeData.id, safeData);
            Swal.fire("Updated!", "Product updated successfully.", "success");
        } else {
            await window.electronAPI.createPendingProduct(safeData);
            Swal.fire("Added!", "Product added successfully.", "success");
        }
        closeModal();
        await fetchPendingProducts();
    } catch (error) {
        Swal.fire("Error", error.message || "Something went wrong", "error");
    }
}

async function deletePendingProduct(id) {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
        try {
            await window.electronAPI.deletePendingProduct(id);
            await fetchPendingProducts();
            Swal.fire("Deleted!", "Product has been deleted.", "success");
        } catch (err) {
            Swal.fire("Error", err.message || "Delete failed", "error");
        }
    }
}

async function syncToCloud() {
    isSyncing.value = true;
    try {
        const result = await window.electronAPI.syncPendingProductsToCloud();
        if (result.status === "success") {
            Swal.fire("Synced!", `${result.synced} products synced successfully.`, "success");
        } else {
            Swal.fire("Warning", result.message || "Sync failed", "warning");
        }
    } catch (err) {
        Swal.fire("Error", err.message || "Cloud sync failed", "error");
    } finally {
        isSyncing.value = false;
    }
}


onMounted(fetchPendingProducts);
</script>

<style scoped>
dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
}
</style>
