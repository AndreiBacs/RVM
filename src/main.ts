import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import './style.css'
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primeicons/primeicons.css'
import 'leaflet/dist/leaflet.css'
import App from './App.vue'

// Fix Leaflet's default icon
import L from 'leaflet'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl
})

const app = createApp(App)
app.use(createPinia())
app.use(PrimeVue)
app.mount('#app')