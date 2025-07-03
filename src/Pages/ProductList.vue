<template>
    <div class="p-6 text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Back />
        <h2 class="mb-2 text-2xl font-bold">Product List</h2>
        <p class="mb-6 text-gray-600 dark:text-gray-300">
            Manage your products. Edit details, save changes, or delete items.
        </p>

        <!-- Search Filters -->
        <div class="flex flex-wrap gap-4 mb-6">
            <input v-model="searchQuery" type="text" placeholder="Search by Name or Brand"
                class="px-4 py-2 w-full md:w-96 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div v-if="loading" class="text-gray-500 dark:text-gray-400">
            Loading products...
        </div>
        <div v-else-if="filteredProducts.length === 0" class="text-gray-500 dark:text-gray-400">
            No products found.
        </div>

        <div v-else class="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <!-- Header -->
            <div
                class="flex flex-wrap justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700 gap-2">
                <span class="text-sm text-gray-600 dark:text-gray-400">
                    Page {{ currentPage }} of {{ totalPages }}
                </span>

                <div class="flex gap-2 flex-wrap">
                    <button @click="saveAllProducts"
                        class="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                        Save All Changes
                    </button>

                    <button @click="syncToCloud"
                        class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Sync to Cloud
                    </button>
                </div>
            </div>

            <!-- Table -->
            <table class="min-w-full text-sm text-left">
                <thead class="text-xs uppercase bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    <tr>
                        <th v-for="head in tableHeaders" :key="head"
                            class="p-3 border-b border-gray-200 dark:border-gray-700">
                            {{ head }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in paginatedProducts" :key="product.id" @click="selectProduct(product.id)"
                        :class="[
                            'transition cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700',
                            selectedProductId === product.id ? 'bg-blue-100 dark:bg-blue-900' : '',
                            isEdited(product.id) ? 'border-l-4 border-yellow-400 dark:border-yellow-300' : '',
                            !isValidProduct(product) ? 'bg-red-50 dark:bg-red-900' : '',
                        ]">
                        <td class="p-2 border-t border-gray-200 dark:border-gray-700">
                            <input v-model="product.name" @input="markEdited(product)"
                                class="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100 min-w-[200px]" />
                        </td>
                        <td class="p-2 border-t border-gray-200 dark:border-gray-700">
                            <input v-model="product.brand" @input="markEdited(product)"
                                class="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100 min-w-[120px]" />
                        </td>
                        <td class="p-2 border-t border-gray-200 dark:border-gray-700">
                            <input v-model="product.category" @input="markEdited(product)"
                                class="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100 min-w-[120px]" />
                        </td>
                        <td class="p-2 border-t border-gray-200 dark:border-gray-700">
                            <input v-model="product.form" @input="markEdited(product)"
                                class="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100 min-w-[120px]" />
                        </td>
                        <td class="p-2 border-t border-gray-200 dark:border-gray-700">
                            <input v-model="product.batch_no" @input="markEdited(product)"
                                class="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100 min-w-[120px]" />
                        </td>
                        <td class="p-2 border-t border-gray-200 dark:border-gray-700">
                            <input type="date" v-model="product.expire_date" @input="markEdited(product)"
                                class="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100 min-w-[120px]" />
                        </td>
                        <td class="p-2 border-t border-gray-200 dark:border-gray-700">
                            <input v-model.number="product.quantity_remained" @input="markEdited(product)"
                                class="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100 min-w-[120px]" />
                        </td>
                        <td class="p-2 border-t border-gray-200 dark:border-gray-700">
                            <input v-model.number="product.buying_price_per_unit" @input="markEdited(product)"
                                class="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100 min-w-[120px]" />
                        </td>
                        <td class="p-2 border-t border-gray-200 dark:border-gray-700">
                            <input v-model.number="product.buying_price" @input="markEdited(product)"
                                class="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100 min-w-[120px]" />
                        </td>
                        <td class="p-2 border-t border-gray-200 dark:border-gray-700">
                            <input v-model.number="product.selling_price_per_unit" @input="markEdited(product)"
                                class="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100 min-w-[120px]" />
                        </td>
                        <td class="p-2 border-t border-gray-200 dark:border-gray-700">
                            <input v-model="product.supplier_name" @input="markEdited(product)"
                                class="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100 min-w-[120px]" />
                        </td>
                        <td class="p-2 border-t border-gray-200 dark:border-gray-700">
                            <input type="date" v-model="product.received_date" @input="markEdited(product)"
                                class="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100 min-w-[120px]" />
                        </td>
                        <td class="p-2 border-t border-gray-200 dark:border-gray-700">
                            <input v-model.number="product.minimum_stock" @input="markEdited(product)"
                                class="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100 min-w-[120px]" />
                        </td>
                        <td class="p-2 border-t border-gray-200 dark:border-gray-700">
                            <input v-model.number="product.min_days_to_notify_expiring" @input="markEdited(product)"
                                class="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100 min-w-[120px]" />
                        </td>
                        <td class="p-2 border-t border-gray-200 dark:border-gray-700 text-xs">
                            {{ product.created_at }}
                        </td>
                        <td class="p-2 border-t border-gray-200 dark:border-gray-700 text-center space-y-1">
                            <button @click.stop="saveSingleProduct(product)"
                                class="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
                                Save
                            </button>
                            <button @click.stop="deleteProduct(product.id)"
                                class="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-400">
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination -->
            <div class="flex justify-center items-center gap-2 py-4 border-t border-gray-200 dark:border-gray-700">
                <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="[
                    'px-3 py-1 rounded-md text-sm border',
                    currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
                ]">
                    {{ page }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Swal from "sweetalert2";
import Back from "@/components/Back.vue";

const products = ref([]);
const loading = ref(true);

const searchQuery = ref("");
const currentPage = ref(1);
const perPage = 20;
const selectedProductId = ref(null);

// To track original products for comparison
const originalProducts = ref([]);

// Track edited product IDs
const editedProductIds = ref(new Set());

// Deep copy helper
function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

const filteredProducts = computed(() => {
    const query = searchQuery.value.toLowerCase();
    return products.value.filter((p) => {
        return (
            p.name?.toLowerCase().includes(query) ||
            p.brand?.toLowerCase().includes(query)
        );
    });
});

const totalPages = computed(() =>
    Math.ceil(filteredProducts.value.length / perPage)
);

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * perPage;
    return filteredProducts.value.slice(start, start + perPage);
});

const tableHeaders = [
    "Name",
    "Brand",
    "Category",
    "Form",
    "Batch No",
    "Expire Date",
    "Qty",
    "Buying Price/Unit",
    "Buying Price",
    "Selling Price/Unit",
    "Supplier",
    "Received Date",
    "Min Stock",
    "Notify Days",
    "Created At",
    "Actions",
];

function selectProduct(id) {
    selectedProductId.value = id === selectedProductId.value ? null : id;
}

// Check if product has been edited compared to original
function isEdited(id) {
    if (!originalProducts.value.length) return false;
    const original = originalProducts.value.find((p) => p.id === id);
    const current = products.value.find((p) => p.id === id);
    if (!original || !current) return false;
    return JSON.stringify(original) !== JSON.stringify(current);
}

function markEdited(product) {
    if (!editedProductIds.value.has(product.id)) {
        editedProductIds.value.add(product.id);
    }
}

function isValidProduct(p) {
  return (
    p.name &&
    p.brand &&
    p.category &&
    p.form &&
    p.batch_no &&
    p.buying_price != null &&
    p.buying_price_per_unit != null &&
    p.selling_price_per_unit != null &&
    p.supplier_name &&
    p.received_date &&
    p.quantity_remained != null &&
    p.minimum_stock != null
  );
}

// Save a single product
async function saveSingleProduct(product) {
    try {
        const cleanPayload = JSON.parse(JSON.stringify(product));
        const result = await window.electronAPI.changeProduct(cleanPayload);
        if (!result.success) {
            await Swal.fire("Error", result.message || "Failed to save product.", "error");
        } else {
            const idx = originalProducts.value.findIndex((p) => p.id === product.id);
            if (idx !== -1) {
                originalProducts.value[idx] = deepCopy(product);
            }
            editedProductIds.value.delete(product.id);
            await Swal.fire("Saved", "Product updated successfully.", "success");
        }
    } catch (error) {
        console.error(error);
        await Swal.fire("Error", "Error saving product.", "error");
    }
}

// Save all filtered products
async function saveAllProducts() {
    try {
        for (const product of filteredProducts.value) {
            const cleanPayload = JSON.parse(JSON.stringify(product));
            const result = await window.electronAPI.changeProduct(cleanPayload);
            if (!result.success) {
                await Swal.fire("Error", `Failed to save product ${product.name || product.id}`, "error");
                return;
            }
            const idx = originalProducts.value.findIndex((p) => p.id === product.id);
            if (idx !== -1) {
                originalProducts.value[idx] = deepCopy(product);
            }
            editedProductIds.value.delete(product.id);
        }
        await Swal.fire("Success", "All products saved successfully.", "success");
    } catch (error) {
        console.error(error);
        await Swal.fire("Error", "Error saving all products.", "error");
    }
}

// Delete product from list
async function deleteProduct(productId) {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this product?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
    });

    if (!result.isConfirmed) return;

    products.value = products.value.filter((p) => p.id !== productId);
    originalProducts.value = originalProducts.value.filter((p) => p.id !== productId);
    editedProductIds.value.delete(productId);
    if (selectedProductId.value === productId) {
        selectedProductId.value = null;
    }

    await Swal.fire("Deleted", "Product deleted successfully.", "success");
}

// Load products on mount and keep a deep copy for comparison
onMounted(async () => {
    loading.value = true;
    try {
        const result = await window.electronAPI.readProducts();
        if (result.success) {
            products.value = result.products;
            originalProducts.value = deepCopy(result.products);
        } else {
            await Swal.fire("Error", result.message || "Failed to load products.", "error");
        }
    } catch (error) {
        console.error("Failed to fetch products:", error);
        await Swal.fire("Error", "Unexpected error fetching products.", "error");
    } finally {
        loading.value = false;
    }
});

// Sync products to cloud
async function syncToCloud() {
    let loader;
    try {
        loader = Swal.fire({
            title: "Syncing...",
            text: "Please wait while syncing products to the cloud.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        const result = await window.electronAPI.syncEditedProductsToCloud();

        Swal.close(); // Close the loading dialog first

        if (result.status === "success") {
            await Swal.fire("Synced", `${result.synced} product(s) synced to the cloud successfully.`, "success");
        } else if (result.status === "no_data") {
            await Swal.fire("Info", "No edited products to sync.", "info");
        } else {
            await Swal.fire("Error", result.message || "Failed to sync products to cloud.", "error");
        }
    } catch (error) {
        console.error("Sync Error:", error.response?.data || error.message);
        Swal.close();

        const errorData = error.response?.data;
        const errorMessages = errorData?.errors
            ? Object.entries(errorData.errors)
                .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
                .join("\n")
            : errorData?.message || "Unexpected sync error.";

        await Swal.fire("Error", errorMessages, "error");
    }

}

</script>
