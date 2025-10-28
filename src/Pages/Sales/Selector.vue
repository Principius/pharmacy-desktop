<template>
  <div class="max-w-6xl p-6 mx-auto bg-white rounded shadow dark:bg-gray-900 dark:text-white">
    <!-- Header Section -->
    <div class="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
      <div class="flex items-center gap-4">
        <Back />
        <h2 class="text-3xl font-bold text-gray-800 dark:text-white">
          Select Products to Sell
        </h2>
      </div>

      <router-link to="/sales" v-if="can('canViewSales')"
        class="px-4 py-2 text-white transition bg-gray-700 rounded hover:bg-gray-800">
        View Sales
      </router-link>
    </div>

    <!-- Search Bar -->
    <div class="mb-4">
      <input v-model="searchTerm" type="text" placeholder="Search products..."
        class="w-full px-4 py-2 text-sm border rounded shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
    </div>

    <div class="p-4 mb-4 text-sm text-blue-800 bg-blue-100 rounded-lg dark:bg-blue-900 dark:text-blue-300">
      Showing all products.
      <span v-if="hideExpired">Expired products are hidden.</span>
      <span v-if="hideZeroStock"> Out-of-stock products are hidden.</span>
    </div>

    <!-- Toggle Filters -->
    <div class="flex gap-4 mb-4">
      <label class="flex items-center gap-2 text-sm">
        <input type="checkbox" v-model="hideExpired" class="accent-purple-600" />
        Hide Expired
      </label>
      <label class="flex items-center gap-2 text-sm">
        <input type="checkbox" v-model="hideZeroStock" class="accent-purple-600" />
        Hide Out-of-Stock
      </label>
    </div>

    <!-- Product Table -->
    <div class="overflow-x-auto rounded-lg shadow">
      <table class="min-w-full text-sm text-left text-gray-800 bg-white dark:text-gray-200 dark:bg-gray-900">
        <thead class="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th class="px-4 py-3 font-semibold border-b dark:border-gray-700">Select</th>
            <th class="px-4 py-3 font-semibold border-b dark:border-gray-700">Name</th>
            <th class="px-4 py-3 font-semibold border-b dark:border-gray-700">Brand</th>
            <th class="px-4 py-3 font-semibold border-b dark:border-gray-700">Expire Date</th>
            <th class="px-4 py-3 font-semibold border-b dark:border-gray-700">Selling Price</th>
            <th class="px-4 py-3 font-semibold border-b dark:border-gray-700" v-if="can('canSeeStock')">
              Qty Left
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="product in paginatedProducts" :key="product.id" @dblclick="toggleSelection(product)" :class="[
            'transition-colors border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer',
            isExpired(product) ? 'bg-red-100 dark:bg-red-900' : '',
            isOutOfStock(product) ? 'bg-yellow-100 dark:bg-yellow-900' : '',
            isSelected(product) ? 'bg-purple-100 dark:bg-purple-800' : ''   // highlight when selected
          ]">
            <!-- Checkbox stays -->
            <td class="px-4 py-3 text-center">
              <input type="checkbox" :checked="isSelected(product)" @change="toggleSelection(product)"
                class="accent-purple-600" />
            </td>
            <td class="px-4 py-3">{{ product.name }}</td>
            <td class="px-4 py-3">{{ product.brand }}</td>
            <td class="px-4 py-3">{{ product.expire_date }}</td>
            <td class="px-4 py-3">{{ formatTZS(product.selling_price_per_unit) }}</td>
            <td class="px-4 py-3" v-if="can('canSeeStock')">{{ product.quantity_remained }}</td>
          </tr>

          <tr v-if="filteredProducts.length === 0">
            <td colspan="7" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
              No products found.
            </td>
          </tr>
        </tbody>

      </table>
      <div class="flex items-center justify-between mt-4">
        <button class="px-3 py-1 text-white bg-purple-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === 1" @click="currentPage--">
          Previous
        </button>

        <span>Page {{ currentPage }} of {{ totalPages }}</span>

        <button class="px-3 py-1 text-white bg-purple-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === totalPages" @click="currentPage++">
          Next
        </button>
      </div>

    </div>

    <!-- Floating Make Sale Button with Count -->
    <div class="fixed z-50 top-32 right-6">
      <button @click="proceedToSale" :disabled="selected.length === 0"
        class="px-6 py-3 font-semibold text-white transition-all bg-purple-600 rounded-full shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-400 dark:focus:ring-purple-700 disabled:opacity-50 disabled:cursor-not-allowed">
        Make a Sale
        <span v-if="selected.length > 0"
          class="inline-flex items-center justify-center px-2 py-1 ml-2 text-xs font-bold leading-none text-purple-800 bg-white rounded-full">
          {{ selected.length }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import Back from "@/components/Back.vue";

const products = ref([]);
const selected = ref([]);
const searchTerm = ref("");
const router = useRouter();
const currentUser = ref(null);
const hideExpired = ref(true);
const hideZeroStock = ref(true);

// Pagination
const currentPage = ref(1);
const pageSize = ref(10); // items per page

const isExpired = (product) => new Date(product.expire_date) < new Date();
const isOutOfStock = (product) => product.quantity_remained <= 0;
const can = (permission) => currentUser.value?.permissions?.includes(permission);

async function loadProducts() {
  try {
    const response = await window.electronAPI.readProducts();
    if (response.success) products.value = response.products;
    else Swal.fire("Error", response.error || "Failed to load products", "error");
  } catch (error) {
    Swal.fire("Error", error.message || "Unexpected error", "error");
  }
}

// Persist selected products in localStorage
onMounted(() => {
  const saved = localStorage.getItem("selectedProducts");
  if (saved) selected.value = JSON.parse(saved);
  loadProducts();
});

watch(selected, (newVal) => {
  localStorage.setItem("selectedProducts", JSON.stringify(newVal));
}, { deep: true });

// Filtered products
const filteredProducts = computed(() => {
  return products.value
    .filter(p => !(hideExpired.value && isExpired(p)) && !(hideZeroStock.value && isOutOfStock(p)))
    .filter(p => [p.name, p.brand, p.batch_no].join(" ").toLowerCase().includes(searchTerm.value.toLowerCase()));
});

// Paginated products
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredProducts.value.slice(start, start + pageSize.value);
});

// Total pages
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / pageSize.value));

const proceedToSale = () => {
  router.push({ name: "SalesCreate" });
};

const formatTZS = (amount) => new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(amount);

onMounted(async () => {
  currentUser.value = await window.electronAPI.getLoggedInUser();
});

const isSelected = (product) => {
  return selected.value.some(p => p.id === product.id);
};

const toggleSelection = async (product) => {
  if (isSelected(product)) {
    // If already selected → remove it
    selected.value = selected.value.filter(p => p.id !== product.id);
  } else {
    // Prompt for quantity
    const { value: qty } = await Swal.fire({
      title: `Enter quantity for ${product.name}`,
      input: "number",
      inputAttributes: {
        min: 1,
        max: product.quantity_remained,
        step: 1,
      },
      inputValue: 1,
      showCancelButton: true,
      confirmButtonText: "Add",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value || value <= 0) return "Please enter a valid quantity";
        if (value > product.quantity_remained) return "Not enough stock available";
      },
    });

 if (qty) {
  selected.value.push({
    ...product,
    quantity_sold: parseInt(qty, 10),   // ✅ use quantity_sold instead of quantity_to_sell
    price_per_unit: product.selling_price_per_unit, // carry forward the default unit price
    discount_applied: 0, // initialize discount
  });
}

  }
};


</script>
