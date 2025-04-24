import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Lara from '@primeuix/themes/lara'
import './style.css'
import 'primeicons/primeicons.css'
import App from './App.vue'

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Lara
  }
})

app.mount('#app')
