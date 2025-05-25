<template>
  <Home v-if="$route.path === '/'" />
  <router-view v-else />
</template>

<script setup>
import Home from './Pages/Home.vue'
</script>
