<template>
  <Login v-if="$route.path === '/'" />
  <router-view v-else />
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import Login from './Pages/Login.vue'

const userStore = useUserStore()

onMounted(async () => {
  const user = await window.electronAPI.getLoggedInUser()
  if (user) {
    userStore.setUser(user)
  }
})

</script>
