<template>
  <Login v-if="$route.path === '/'" />
  <router-view v-else />
</template>

<script setup>
import Login from './Pages/Login.vue'
</script>
