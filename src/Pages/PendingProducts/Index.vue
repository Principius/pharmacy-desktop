<template>
    <div class="w-full mt-4 mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-900 dark:text-white">
        <Back />
        <h1 class="mt-4 text-3xl font-bold mb-6 text-purple-700 dark:text-purple-400">
            Received Products
        </h1>

        <!-- Buttons -->
        <button @click="openAddModal"
            class="mb-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-green-400">
            + Add Received Product
        </button>

        <button @click="syncToCloud" :disabled="isSyncing" v-if="can('canSyncPendingProducts')"
            class="mb-6 ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50">
            {{ isSyncing ? "Syncing..." : "Sync Pending Products to Cloud" }}
        </button>

        <div class="mb-4">
            <label for="syncFilter" class="mr-2 font-semibold">Filter:</label>
            <select v-model="syncFilter" id="syncFilter"
                class="px-3 py-1 border rounded dark:bg-gray-800 dark:border-gray-600">
                <option value="all">All</option>
                <option value="synced">Synced</option>
                <option value="unsynced">Unsynced</option>
            </select>
        </div>

        <div class="flex items-end space-x-4 mb-4">
            <div>
                <label class="block text-sm font-semibold mb-1">Start Date</label>
                <input v-model="dateRange.start" type="date"
                    class="px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-600" />
            </div>

            <div>
                <label class="block text-sm font-semibold mb-1">End Date</label>
                <input v-model="dateRange.end" type="date"
                    class="px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-600" />
            </div>

            <button @click="clearDateFilter" class="px-3 py-2 bg-gray-300 text-black rounded hover:bg-gray-400">
                Clear
            </button>
        </div>

        <!-- Product Table -->
        <div class="overflow-x-auto">
            <table class="min-w-[1200px] w-full text-left border-collapse border border-gray-300 dark:border-gray-700">
                <thead class="bg-gray-100 dark:bg-gray-800">
                    <tr>
                        <th class="border px-4 py-2">Name</th>
                        <th class="border px-4 py-2">Brand</th>
                        <th class="border px-4 py-2">Category</th>
                        <th class="border px-4 py-2">Form</th>
                        <th class="border px-4 py-2">Expire Date</th>
                        <th class="border px-4 py-2">Price/Unit</th>
                        <th class="border px-4 py-2">Total Buying Price</th>
                        <th class="border px-4 py-2">Selling Price</th>
                        <th class="border px-4 py-2">Markup %</th>
                        <th class="border px-4 py-2">Supplier</th>
                        <th class="border px-4 py-2">Quantity</th>
                        <th class="border px-4 py-2">Min Stock</th>
                        <th class="border px-4 py-2">Notify Before (Days)</th>
                        <!-- <th class="border px-4 py-2">Status</th> -->
                        <th class="border px-4 py-2">Synced</th>
                        <th class="border px-4 py-2">Synced At</th>
                        <th class="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in filteredProducts" :key="product.id" :class="[
                        'border hover:bg-gray-50 dark:hover:bg-gray-700',
                        duplicateIds.includes(product.id)
                            ? 'bg-red-100 dark:bg-red-900'
                            : '',
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
                        <td class="px-4 py-2">
                            {{ product.expire_date?.split("T")[0] || "-" }}
                        </td>
                        <td class="px-4 py-2">{{ product.buying_price_per_unit ?? "-" }}</td>
                        <td class="px-4 py-2">{{ product.buying_price ?? "-" }}</td>
                        <td class="px-4 py-2">{{ product.selling_price_per_unit ?? "-" }}</td>
                        <td class="px-4 py-2">
                            {{ product.percentage_markup ? product.percentage_markup.toFixed(2) + '%' : '-' }}
                        </td>
                        <td class="px-4 py-2">{{ product.supplier_name || "-" }}</td>
                        <td class="px-4 py-2">{{ product.quantity_remained ?? "-" }}</td>
                        <td class="px-4 py-2">{{ product.minimum_stock ?? "-" }}</td>
                        <td class="px-4 py-2">
                            {{ product.min_days_to_notify_expiring ?? "-" }}
                        </td>
                        <!-- <td class="px-4 py-2 capitalize">{{ product.status }}</td> -->
                        <td class="px-4 py-2 text-center">
                            <span :class="product.is_synced ? 'text-green-600' : 'text-yellow-600'">
                                {{ product.is_synced ? "✔" : "✘" }}
                            </span>
                        </td>
                        <td class="px-4 py-2">
                            {{ product.updated_at
                                ? new Date(product.updated_at + "Z").toLocaleString("en-GB", {
                                    timeZone: "Africa/Dar_es_Salaam",
                                    dateStyle: "short",
                                    timeStyle: "medium"
                                })
                                : "-" }}

                        </td>
                        <td class="px-4 py-2 space-x-2">
                            <button @click="openEditModal(product)" class="text-blue-600 hover:underline">
                                Edit
                            </button>
                            <button @click="deletePendingProduct(product.id)" class="text-red-600 hover:underline">
                                Delete
                            </button>
                        </td>
                    </tr>
                    <tr v-if="filteredProducts.length === 0">
                        <td colspan="17" class="text-center py-6 text-gray-500 dark:text-gray-400 italic">
                            No received products found.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Add/Edit Modal -->
        <dialog ref="productDialog"
            class="w-full max-w-lg p-6 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <h2 class="text-xl font-bold mb-4">
                {{ isEditing ? "Edit" : "Add" }} Received Product
            </h2>
            <form @submit.prevent="saveProduct" class="space-y-4">
                <div v-if="isEditing">
                    <label class="block mb-1 font-semibold">Product UUID</label>
                    <input v-model="form.product_uuid" type="text" disabled
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700 cursor-not-allowed opacity-70" />
                </div>

                <div class="relative">
                    <!-- Search input -->
                    <label class="block mb-1 font-semibold">Name</label>
                    <input v-model="searchQuery" @input="onSearch" type="text"
                        placeholder="Search product by name or brand..."
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />

                    <!-- Suggestions dropdown -->
                    <ul v-if="suggestions.length && showSuggestions"
                        class="absolute z-50 w-full bg-white dark:bg-gray-800 border rounded shadow max-h-60 overflow-y-auto">
                        <li v-for="p in suggestions" :key="p.id" @click="selectProduct(p)"
                            class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                            {{ p.name }}
                            <span v-if="p.brand" class="text-gray-500">({{ p.brand }})</span>
                        </li>
                    </ul>
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Brand</label> <!-- ADD THIS -->
                    <input v-model.lazy="form.brand" list="brandSuggestions" type="text"
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                    <datalist id="brandSuggestions">
                        <option v-for="b in brandSuggestions" :key="b" :value="b" />
                    </datalist>
                </div>

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
                    <label class="block mb-1 font-semibold">Quantity</label>
                    <input v-model.number.lazy="form.quantity_remained" type="number" min="0" required
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Buying Price Per Unit</label>
                    <input v-model.number.lazy="form.buying_price_per_unit" type="number" step="0.01" min="0"
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
                    <label class="block mb-1 font-semibold">Markup (%)</label>
                    <input v-model="form.percentage_markup" type="number" disabled
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700 bg-gray-100 cursor-not-allowed" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Supplier Name</label>
                    <input v-model.lazy="form.supplier_name" type="text"
                        class="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" />
                </div>

                <div>
                    <label class="block mb-1 font-semibold">Minimum Stock</label>
                    <input v-model.number.lazy="form.minimum_stock" type="number" min="0"
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

                <div v-if="formErrors.length > 0"
                    class="rounded-md bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 p-4">
                    <p class="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">Please fix the following
                        errors:</p>
                    <ul class="list-disc list-inside space-y-1">
                        <li v-for="(error, i) in formErrors" :key="i" class="text-sm text-red-600 dark:text-red-300">
                            {{ error }}
                        </li>
                    </ul>
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

const dateRange = ref({
    start: "",
    end: "",
});

// Pagination
const currentPage = ref(1);
const perPage = 25;

const syncFilter = ref("all");

const filteredProducts = computed(() => {
    let products = pendingProducts.value;

    if (syncFilter.value === "synced") {
        products = products.filter((p) => p.is_synced);
    } else if (syncFilter.value === "unsynced") {
        products = products.filter((p) => !p.is_synced);
    }

    if (dateRange.value.start && dateRange.value.end) {
        const start = new Date(dateRange.value.start);
        const end = new Date(dateRange.value.end);
        end.setDate(end.getDate() + 1); // include full end day

        products = products.filter((p) => {
            const updatedAt = new Date(p.updated_at);
            return updatedAt >= start && updatedAt < end;
        });
    }

    return products;
});

function clearDateFilter() {
    dateRange.value.start = "";
    dateRange.value.end = "";
}

const currentUser = ref(null);

onMounted(async () => {
    currentUser.value = await window.electronAPI.getLoggedInUser();
});

// Permissions
const can = (permission) => {
    return currentUser.value?.permissions?.includes(permission);
};

// Pagination helpers
const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * perPage;
    return filteredProducts.value.slice(start, start + perPage);
});
const totalPages = computed(() =>
    Math.ceil(filteredProducts.value.length / perPage)
);
function nextPage() {
    if (currentPage.value < totalPages.value) currentPage.value++;
}
function prevPage() {
    if (currentPage.value > 1) currentPage.value--;
}

// Detect duplicate products
const duplicateIds = computed(() => {
    const existing = existingProducts.value.map((p) => ({
        name: p.name.toLowerCase().trim(),
        brand: p.brand?.toLowerCase().trim() || "",
    }));

    return pendingProducts.value
        .filter((p) =>
            existing.some(
                (e) =>
                    e.name === p.name.toLowerCase().trim() &&
                    e.brand === (p.brand?.toLowerCase().trim() || "")
            )
        )
        .map((p) => p.id);
});

// ---------------------
// Main Form
// ---------------------
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
    percentage_markup: 0,
});

// ---------------------
// Autocomplete
// ---------------------
const searchQuery = ref("");
const suggestions = ref([]);
const showSuggestions = ref(false);
const formErrors = ref([]);

const onSearch = debounce(async () => {
    if (!searchQuery.value.trim()) {
        suggestions.value = [];
        showSuggestions.value = false;
        return;
    }

    const res = await window.electronAPI.readProductsPending(searchQuery.value);
    console.log("Search results:", res);
    if (res.success) {
        const q = searchQuery.value.toLowerCase();
        suggestions.value = res.products.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                (p.brand && p.brand.toLowerCase().includes(q))
        );
        showSuggestions.value = suggestions.value.length > 0;
    }
}, 300);

// Keep form.name in sync with whatever the user types, even if
// they never pick a suggestion (i.e. it's a genuinely new product).
watch(searchQuery, (newVal) => {
    form.value.name = newVal.trim();
});

function selectProduct(product) {
    // Autofill form
    form.value.name = product.name;
    form.value.brand = product.brand || "";
    form.value.category = product.category || "";
    form.value.form = product.form || "";
    form.value.expire_date = product.expire_date?.split("T")[0] || "";
    form.value.buying_price = product.buying_price ?? 0;
    form.value.selling_price_per_unit = product.selling_price_per_unit ?? 0;
    form.value.supplier_name = product.supplier_name || "";
    form.value.quantity_remained = product.quantity_remained ?? 0;
    form.value.minimum_stock = product.minimum_stock ?? 0;
    form.value.buying_price_per_unit = product.buying_price_per_unit ?? 0;
    form.value.min_days_to_notify_expiring =
        product.min_days_to_notify_expiring ?? 0;

    // Update search field with chosen product
    searchQuery.value = `${product.name} (${product.brand || "No brand"})`;
    showSuggestions.value = false;
    suggestions.value = [];

    // Since searchQuery now includes "(brand)" suffix, keep the
    // actual submitted name clean — override what the watcher just set.
    form.value.name = product.name;
}

// ---------------------
// Autofill Tracking
// ---------------------
const autofilledFields = ref(new Set());

// Auto-calc total buying price
watch(
    () => [form.value.quantity_remained, form.value.buying_price_per_unit],
    ([newQuantity, newUnitPrice]) => {
        if (newQuantity > 0 && newUnitPrice >= 0) {
            form.value.buying_price = +(
                newQuantity * newUnitPrice
            ).toFixed(2);
        } else {
            form.value.buying_price = 0;
        }
    }
);

watch(
    () => [form.value.buying_price_per_unit, form.value.selling_price_per_unit],
    ([buying, selling]) => {
        if (buying > 0 && selling > 0) {
            form.value.percentage_markup = +(
                ((selling - buying) / buying) * 100
            ).toFixed(2);
        } else {
            form.value.percentage_markup = 0;
        }
    }
);

// Init
onMounted(async () => {
    fetchPendingProducts();
    const res = await window.electronAPI.readProductsPending();
    if (res.success) existingProducts.value = res.products;
});

async function fetchPendingProducts() {
    pendingProducts.value = await window.electronAPI.readPendingProducts();
}

function openAddModal() {
    isEditing.value = false;
    autofilledFields.value.clear();
    searchQuery.value = "";
    suggestions.value = [];
    showSuggestions.value = false;
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
        percentage_markup: 0,
    };
    productDialog.value.showModal();
}

function openEditModal(product) {
    isEditing.value = true;
    autofilledFields.value.clear();
    form.value = { ...product };
    searchQuery.value = product.name || "";
    suggestions.value = [];
    showSuggestions.value = false;
    productDialog.value.showModal();
}

function closeModal() {
    productDialog.value.close();
}

async function saveProduct() {
    const f = form.value;
    formErrors.value = [];

    if (!f.name?.trim())
        formErrors.value.push('Product name is required. Please search and select one.');
    if (!f.brand?.trim())
        formErrors.value.push('Brand is required.');
    if (!f.category?.trim())
        formErrors.value.push('Category is required.');
    if (!f.form?.trim())
        formErrors.value.push('Form is required.');
    if (!f.expire_date)
        formErrors.value.push('Expire Date is required.');
    if (f.quantity_remained === null || f.quantity_remained === undefined || f.quantity_remained === '' || isNaN(f.quantity_remained) || f.quantity_remained < 0)
        formErrors.value.push('Quantity must be a valid non-negative number.');
    if (!f.buying_price_per_unit || isNaN(f.buying_price_per_unit) || f.buying_price_per_unit <= 0)
        formErrors.value.push('Buying Price Per Unit must be greater than 0.');
    if (!f.buying_price || isNaN(f.buying_price) || f.buying_price <= 0)
        formErrors.value.push('Total Buying Price must be greater than 0.');
    if (!f.selling_price_per_unit || isNaN(f.selling_price_per_unit) || f.selling_price_per_unit <= 0)
        formErrors.value.push('Selling Price Per Unit must be greater than 0.');
    if (!f.supplier_name?.trim())
        formErrors.value.push('Supplier Name is required.');
    if (f.minimum_stock === null || f.minimum_stock === undefined || f.minimum_stock === '' || isNaN(f.minimum_stock) || f.minimum_stock < 0)
        formErrors.value.push('Minimum Stock must be a valid non-negative number.');
    if (f.min_days_to_notify_expiring === null || f.min_days_to_notify_expiring === undefined || f.min_days_to_notify_expiring === '' || isNaN(f.min_days_to_notify_expiring) || f.min_days_to_notify_expiring < 0)
        formErrors.value.push('Min Days To Notify Expiring must be a valid non-negative number.');
    if (!f.status)
        formErrors.value.push('Status is required.');

    if (formErrors.value.length > 0) return;

    const safeData = JSON.parse(JSON.stringify(f));
    try {
        if (isEditing.value) {
            await window.electronAPI.updatePendingProduct(safeData.id, safeData);
            Swal.fire("Updated!", "Product updated successfully.", "success");
        } else {
            await window.electronAPI.createPendingProduct(safeData);
            Swal.fire("Added!", "Product added successfully.", "success");
        }
        formErrors.value = [];  // clear on success
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
            await fetchPendingProducts(); // refreshes is_synced flags in the table
            Swal.fire(
                "Synced!",
                `${result.synced} products synced successfully.`,
                "success"
            );
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
