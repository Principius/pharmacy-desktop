<template>
    <div class="min-h-screen p-6 transition-colors duration-300 bg-white dark:bg-gray-900">
        <Back />
        <h1 class="mt-8 mb-4 text-3xl font-bold text-gray-800 dark:text-white">
            Reorder Products
        </h1>

        <div class="overflow-x-auto border border-gray-200 rounded-lg shadow dark:border-gray-700">
            <table class="min-w-full text-sm text-left">
                <thead class="bg-gray-100 dark:bg-gray-800">
                    <tr>
                        <th class="p-3 font-semibold text-gray-700 dark:text-gray-300">Select</th>
                        <th class="p-3 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                        <th class="p-3 font-semibold text-gray-700 dark:text-gray-300">Brand</th>
                        <th class="p-3 font-semibold text-gray-700 dark:text-gray-300">Quantity Remained</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in sortedProducts" :key="product.id"
                        class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td class="p-3">
                            <input type="checkbox" v-model="selectedIds" :value="product.id"
                                class="text-purple-600 rounded dark:bg-gray-900 dark:border-gray-700 focus:ring-purple-500" />
                        </td>
                        <td class="p-3 text-gray-800 dark:text-gray-200">{{ product.name }}</td>
                        <td class="p-3 text-gray-800 dark:text-gray-200">{{ product.brand }}</td>
                        <td class="p-3 text-gray-800 dark:text-gray-200">{{ product.quantity_remained }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <button
            class="fixed z-40 px-6 py-3 mt-16 font-semibold text-white transition-all bg-purple-600 rounded-full shadow-lg bottom-6 right-6 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!selectedIds.length" @click="openModal">
            Generate Order ({{ selectedIds.length }})
        </button>

        <!-- Modal -->
        <transition name="fade">
            <div v-if="showModal"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                <div class="w-full max-w-xl p-6 bg-white shadow-2xl dark:bg-gray-800 rounded-xl">
                    <h2 class="mb-6 text-2xl font-bold text-gray-800 dark:text-white">
                        Edit Quantities to Order
                    </h2>

                    <div v-for="item in selectedProducts" :key="item.id" class="mb-5">
                        <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {{ item.name }} ({{ item.brand }})
                        </label>
                        <input v-model.number="item.quantity_required" type="number" min="1"
                            class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
                    </div>

                    <div class="flex justify-end gap-3 mt-6">
                        <button @click="downloadPDF"
                            class="px-5 py-2 font-semibold text-white transition bg-green-600 rounded hover:bg-green-700">
                            Download Order
                        </button>
                        <button @click="closeModal"
                            class="px-5 py-2 font-semibold text-gray-700 transition bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import Back from '@/components/Back.vue'
import { onMounted, ref, computed } from 'vue'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

pdfMake.vfs = pdfFonts.vfs

const products = ref([])
const selectedIds = ref([])
const showModal = ref(false)

const selectedProducts = computed(() =>
    products.value
        .filter((p) => selectedIds.value.includes(p.id))
        .map((p) => ({ ...p, quantity_required: 1 }))
)

const sortedProducts = computed(() =>
    [...products.value].sort((a, b) => a.quantity_remained - b.quantity_remained)
)

onMounted(async () => {
    try {
        const result = await window.electronAPI.readProducts()
        if (result.success && Array.isArray(result.products)) {
            products.value = result.products
        } else {
            products.value = []
        }
    } catch (error) {
        console.error('❌ Failed to load products:', error)
        products.value = []
    }
})

function openModal() {
    showModal.value = true
}

function closeModal() {
    showModal.value = false
    selectedIds.value = []
}

async function downloadPDF() {
    try {
        const pharmacy = await window.electronAPI.getPharmacyData()
        const selected = selectedProducts.value

        const docDefinition = {
            pageSize: 'A4',
            pageMargins: [40, 60, 40, 60],
            content: [
                {
                    columns: [
                        { text: pharmacy?.name || 'Pharmacy Order', style: 'header' },
                        {
                            stack: [
                                { text: `Date: ${new Date().toLocaleDateString()}`, style: 'small' },
                                { text: `Time: ${new Date().toLocaleTimeString()}`, style: 'small' },
                            ],
                            alignment: 'right',
                        },
                    ],
                },
                {
                    text: pharmacy?.address ? `Address: ${pharmacy.address}` : '',
                    style: 'info',
                    margin: [0, 0, 0, 10],
                },
                { text: 'Product Order List', style: 'subheader' },

                {
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', 'auto', 'auto'],
                        body: [
                            [
                                { text: 'Product Name', style: 'tableHeader' },
                                { text: 'Brand', style: 'tableHeader' },
                                { text: 'Quantity Required', style: 'tableHeader' },
                                { text: 'Unit', style: 'tableHeader' },
                            ],
                            ...selected.map((p, i) => [
                                { text: p.name, fillColor: i % 2 === 0 ? '#f9f9f9' : null },
                                { text: p.brand, fillColor: i % 2 === 0 ? '#f9f9f9' : null },
                                { text: p.quantity_required.toString(), alignment: 'center', fillColor: i % 2 === 0 ? '#f9f9f9' : null },
                                { text: p.form || '-', alignment: 'center', fillColor: i % 2 === 0 ? '#f9f9f9' : null },
                            ]),
                        ],
                    },
                    layout: {
                        hLineWidth: () => 0.5,
                        vLineWidth: () => 0.5,
                        hLineColor: () => '#aaa',
                        vLineColor: () => '#aaa',
                        paddingLeft: () => 8,
                        paddingRight: () => 8,
                        paddingTop: () => 6,
                        paddingBottom: () => 6,
                    },
                    margin: [0, 10, 0, 0],
                },
            ],
            footer: (currentPage, pageCount) => ({
                columns: [
                    { text: `Generated on ${new Date().toLocaleString()}`, alignment: 'left', style: 'small' },
                    { text: `Page ${currentPage} of ${pageCount}`, alignment: 'right', style: 'small' },
                ],
                margin: [40, 20],
            }),
            styles: {
                header: {
                    fontSize: 20,
                    bold: true,
                    color: '#4F46E5', // Purple like your app theme
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 15, 0, 8],
                    color: '#333',
                },
                info: {
                    fontSize: 12,
                    color: '#555',
                },
                tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'white',
                    fillColor: '#4F46E5',
                    alignment: 'center',
                },
                small: {
                    fontSize: 10,
                    color: '#666',
                },
            },
            defaultStyle: {
                font: 'Roboto',
            },
        }

        pdfMake.createPdf(docDefinition).download(`Product_Order_${Date.now()}.pdf`)
        closeModal()
    } catch (error) {
        console.error('❌ Failed to generate PDF:', error)
    }
}
</script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
