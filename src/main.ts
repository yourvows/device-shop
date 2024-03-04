import { createApp } from 'vue'
import './assets/styles/style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
