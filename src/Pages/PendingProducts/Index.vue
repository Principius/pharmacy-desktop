<template>
    <div class="w-full mt-4 mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-900 dark:text-white">
        <Back />
        <h1 class="mt-4 text-3xl font-bold mb-6 text-purple-700 dark:text-purple-400">
            Pending Products
        </h1>

        <!-- Buttons -->
        <button @click="openAddModal"
            class="mb-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-green-400">
            + Add New Pending Product
        </button>

        <button @click="syncToCloud" :disabled="isSyncing"
            class="mb-6 ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50">
            {{ isSyncing ? "Syncing..." : "Sync Pending Products to Cloud" }}
        </button>

        <!-- Product Table -->
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
                    <!-- <th class="border px-4 py-2">Status</th> -->
                    <th class="border px-4 py-2">Synced</th>
                    <th class="border px-4 py-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in pendingProducts" :key="product.id" :class="[
                    'border hover:bg-gray-50 dark:hover:bg-gray-700',
                    duplicateIds.includes(product.id) ? 'bg-red-100 dark:bg-red-900' : ''
                ]">
                    <td class="px-4 py-2">
                        {{ product.name }}
                        <span v-if="duplicateIds.includes(product.id)"
                            class="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded">
                            Duplicate
                        </span>
                    </td>
                    <td class="px-4 py-2">{{ product.brand || "-" }}</td>
                    <td class="px-4 py-2">{{ product.category || "-" }}</td>
                    <td class="px-4 py-2">{{ product.form || "-" }}</td>
                    <td class="px-4 py-2">{{ product.expire_date?.split("T")[0] || "-" }}</td>
                    <td class="px-4 py-2">{{ product.batch_no || "-" }}</td>
                    <td class="px-4 py-2">{{ product.buying_price ?? "-" }}</td>
                    <td class="px-4 py-2">{{ product.selling_price_per_unit ?? "-" }}</td>
                    <td class="px-4 py-2">{{ product.supplier_name || "-" }}</td>
                    <td class="px-4 py-2">{{ product.quantity_remained ?? "-" }}</td>
                    <td class="px-4 py-2">{{ product.minimum_stock ?? "-" }}</td>
                    <td class="px-4 py-2">{{ product.buying_price_per_unit ?? "-" }}</td>
                    <td class="px-4 py-2">{{ product.min_days_to_notify_expiring ?? "-" }}</td>
                    <!-- <td class="px-4 py-2 capitalize">{{ product.status }}</td> -->
                    <td class="px-4 py-2 text-center">
                        <span :class="product.is_synced ? 'text-green-600' : 'text-yellow-600'">
                            {{ product.is_synced ? "✔" : "✘" }}
                        </span>
                    </td>
                    <td class="px-4 py-2 space-x-2">
                        <button @click="openEditModal(product)" class="text-blue-600 hover:underline">Edit</button>
                        <button @click="deletePendingProduct(product.id)"
                            class="text-red-600 hover:underline">Delete</button>
                    </td>
                </tr>
                <tr v-if="pendingProducts.length === 0">
                    <td colspan="16" class="text-center py-6 text-gray-500 dark:text-gray-400 italic">
                        No pending products found.
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Add/Edit Modal -->
        <dialog ref="productDialog"
            class="w-full max-w-lg p-6 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <h2 class="text-xl font-bold mb-4">{{ isEditing ? "Edit" : "Add" }} Pending Product</h2>
            <form @submit.prevent="saveProduct" class="space-y-4">

                <div v-if="isEditing">
                    <label class="block mb-1 font-semibold">Product UUID</label>
                    <input v-model="form.product_uuid" type="text" disabled
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700 cursor-not-allowed opacity-70" />
                </div>

                <input v-model.lazy="form.name" list="nameSuggestions" required type="text"
                    class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                <datalist id="nameSuggestions">
                    <option v-for="p in existingProducts" :key="p.id" :value="p.name" />
                </datalist>

                <input v-model.lazy="form.brand" list="brandSuggestions" type="text"
                    class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                <datalist id="brandSuggestions">
                    <option v-for="b in brandSuggestions" :key="b" :value="b" />
                </datalist>

                <div>
                    <label class="block mb-1 font-semibold">Category</label>
                    <input v-model.lazy="form.category" type="text"
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Form</label>
                    <input v-model.lazy="form.form" type="text"
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Expire Date</label>
                    <input v-model.lazy="form.expire_date" type="date"
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Batch No</label>
                    <input v-model.lazy="form.batch_no" type="text"
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Total Buying Price</label>
                    <input v-model.number.lazy="form.buying_price" type="number" step="0.01" min="0" required
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Selling Price Per Unit</label>
                    <input v-model.number.lazy="form.selling_price_per_unit" type="number" step="0.01" min="0" required
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Supplier Name</label>
                    <input v-model.lazy="form.supplier_name" type="text"
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Quantity Remained</label>
                    <input v-model.number.lazy="form.quantity_remained" type="number" min="0" required
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Minimum Stock</label>
                    <input v-model.number.lazy="form.minimum_stock" type="number" min="0"
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Buying Price Per Unit</label>
                    <input v-model.number.lazy="form.buying_price_per_unit" type="number" step="0.01" min="0"
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Min Days To Notify Expiring</label>
                    <input v-model.number.lazy="form.min_days_to_notify_expiring" type="number" min="0"
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Status</label>
                    <select v-model.lazy="form.status"
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
import { ref, computed, onMounted, watch } from "vue";
import debounce from "lodash.debounce";
import Swal from "sweetalert2";
import Back from "@/components/Back.vue";

// Refs
const pendingProducts = ref([]);
const isSyncing = ref(false);
const existingProducts = ref([]);
const productDialog = ref(null);
const isEditing = ref(false);

// Pagination
const currentPage = ref(1);
const perPage = 25;

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * perPage;
    return pendingProducts.value.slice(start, start + perPage);
});
const totalPages = computed(() =>
    Math.ceil(pendingProducts.value.length / perPage)
);
function nextPage() {
    if (currentPage.value < totalPages.value) currentPage.value++;
}
function prevPage() {
    if (currentPage.value > 1) currentPage.value--;
}

const duplicateIds = computed(() => {
    const existing = existingProducts.value.map(p => ({
        name: p.name.toLowerCase().trim(),
        brand: p.brand?.toLowerCase().trim() || ""
    }));

    return pendingProducts.value
        .filter(p => existing.some(e =>
            e.name === p.name.toLowerCase().trim() &&
            e.brand === (p.brand?.toLowerCase().trim() || "")
        ))
        .map(p => p.id);
});

// Main Form
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

// Suggestions (computed once)
const brandSuggestions = computed(() =>
    Array.from(new Set(existingProducts.value.map(p => p.brand).filter(Boolean)))
);

// Autofill Tracking
const autofilledFields = ref(new Set());

// Auto-calculate unit price
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

// Debounced autofill
watch(
    () => form.value.name,
    debounce((newValue) => {
        if (!newValue || existingProducts.value.length === 0) return;

        const lowerInput = newValue.toLowerCase();
        let matched = existingProducts.value.find(
            (p) =>
                p.name.toLowerCase() === lowerInput ||
                p.brand.toLowerCase() === lowerInput
        );

        if (!matched) {
            matched = existingProducts.value.find(
                (p) =>
                    p.name.toLowerCase().includes(lowerInput) ||
                    p.brand.toLowerCase().includes(lowerInput)
            );
        }

        if (matched) {
            if (!autofilledFields.value.has("brand")) form.value.brand = matched.brand || "";
            if (!autofilledFields.value.has("category")) form.value.category = matched.category || "";
            if (!autofilledFields.value.has("form")) form.value.form = matched.form || "";
            if (!autofilledFields.value.has("expire_date")) form.value.expire_date = matched.expire_date?.split("T")[0] || "";
            if (!autofilledFields.value.has("batch_no")) form.value.batch_no = matched.batch_no || "";
            if (!autofilledFields.value.has("buying_price")) form.value.buying_price = matched.buying_price ?? 0;
            if (!autofilledFields.value.has("selling_price_per_unit")) form.value.selling_price_per_unit = matched.selling_price_per_unit ?? 0;
            if (!autofilledFields.value.has("supplier_name")) form.value.supplier_name = matched.supplier_name || "";
            if (!autofilledFields.value.has("received_date")) form.value.received_date = matched.received_date?.split("T")[0] || "";
            if (!autofilledFields.value.has("quantity_remained")) form.value.quantity_remained = matched.quantity_remained ?? 0;
            if (!autofilledFields.value.has("minimum_stock")) form.value.minimum_stock = matched.minimum_stock ?? 0;
            if (!autofilledFields.value.has("buying_price_per_unit")) form.value.buying_price_per_unit = matched.buying_price_per_unit ?? 0;
            if (!autofilledFields.value.has("min_days_to_notify_expiring")) form.value.min_days_to_notify_expiring = matched.min_days_to_notify_expiring ?? 0;
        }
    }, 300)
);

// Track edits per input
watch(() => form.value.brand, () => autofilledFields.value.add("brand"));
watch(() => form.value.category, () => autofilledFields.value.add("category"));
watch(() => form.value.form, () => autofilledFields.value.add("form"));
watch(() => form.value.expire_date, () => autofilledFields.value.add("expire_date"));
watch(() => form.value.batch_no, () => autofilledFields.value.add("batch_no"));
watch(() => form.value.buying_price, () => autofilledFields.value.add("buying_price"));
watch(() => form.value.selling_price_per_unit, () => autofilledFields.value.add("selling_price_per_unit"));
watch(() => form.value.supplier_name, () => autofilledFields.value.add("supplier_name"));
watch(() => form.value.received_date, () => autofilledFields.value.add("received_date"));
watch(() => form.value.quantity_remained, () => autofilledFields.value.add("quantity_remained"));
watch(() => form.value.minimum_stock, () => autofilledFields.value.add("minimum_stock"));
watch(() => form.value.buying_price_per_unit, () => autofilledFields.value.add("buying_price_per_unit"));
watch(() => form.value.min_days_to_notify_expiring, () => autofilledFields.value.add("min_days_to_notify_expiring"));

// Init
onMounted(async () => {
    fetchPendingProducts();
    const res = await window.electronAPI.readProducts();
    if (res.success) existingProducts.value = res.products;
});

async function fetchPendingProducts() {
    pendingProducts.value = await window.electronAPI.readPendingProducts();
}

function openAddModal() {
    isEditing.value = false;
    autofilledFields.value.clear();
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
        received_date: today,
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
    autofilledFields.value.clear();
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
</script>
<style scoped>
dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
}
</style>
