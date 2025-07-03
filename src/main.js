import './assets/main.css'
import './style.css'
import 'sweetalert2/dist/sweetalert2.min.css'
import 'flowbite'
import '@fortawesome/fontawesome-free/css/all.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(VueApexCharts)

app.component('ApexChart', VueApexCharts)

app.mount('#app')
