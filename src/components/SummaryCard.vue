<template>
    <div
        class="flex items-start gap-3 p-4 transition duration-300 bg-white shadow-md dark:bg-gray-800 rounded-xl hover:shadow-lg">
        <div class="text-2xl">{{ icon }}</div>
        <div>
            <div class="mb-1 text-sm text-gray-500 dark:text-gray-400">{{ title }}</div>
            <div class="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {{ value }}
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: String,
    value: [String, Number],
    icon: String
})
</script>
