<template>
    <div
        class="flex flex-col items-center justify-center min-h-screen px-6 py-10 text-center bg-gray-100 dark:bg-gray-900">
        <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <!-- Inline SVG icon -->
            <div class="w-20 h-20 mx-auto mb-6 text-indigo-600 dark:text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                        d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20zM16 24a8 8 0 0116 0M20 24a4 4 0 018 0M24 28v2m0 4h.01" />
                </svg>
            </div>

            <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
                You're in Offline Mode
            </h2>

            <p class="mb-6 text-gray-600 dark:text-gray-300">
                The feature you selected requires an internet connection. This part of the software is only available
                online.
            </p>

            <button @click="openCloudPortal"
                class="inline-flex items-center px-4 py-2 font-semibold text-white transition bg-indigo-600 rounded hover:bg-indigo-700"
                v-if="tenantUrl">
                🌐 Open Cloud Dashboard
            </button>

            <p v-else class="mt-4 text-sm text-red-600 dark:text-red-400">
                Could not find tenant session data.
            </p>
        </div>
         <Back />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Back from '@/components/Back.vue'

const tenantUrl = ref(null)

onMounted(async () => {
    try {
        const session = await window.electronAPI.getCurrentSession()
        if (session && session.tenant_url) {
            tenantUrl.value = session.tenant_url
        }
    } catch (error) {
        console.error('Failed to load session:', error)
    }
})

function openCloudPortal() {
    if (tenantUrl.value) {
        window.electronAPI.openExternalLink(tenantUrl.value)
    }
}
</script>
