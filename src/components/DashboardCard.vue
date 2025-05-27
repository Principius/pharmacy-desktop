<template>
    <div :class="[
        'p-6 rounded-2xl shadow-xl hover:scale-[1.02] transition-transform duration-300 ease-in-out text-white',
        `bg-gradient-to-r ${bg}`
    ]">
        <div class="flex items-center mb-2">
            <i :class="['w-6 h-6 mr-3', icon]"></i>
            <h3 class="text-lg font-semibold">{{ title }}</h3>
        </div>
        <div v-for="(line, index) in lines" :key="index" class="text-sm">
            {{ line }}
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: String,
    icon: String,
    bg: String,
    lines: Array
})
</script>
