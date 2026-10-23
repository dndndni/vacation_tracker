import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/variables.css'
import './assets/css/base.css'
import './assets/css/layout.css'
import './assets/css/components.css'

createApp(App).use(router).mount('#app')
