import { createApp } from 'vue'
import './assets/styles/style.css'
import 'element-plus/dist/index.css'
import router from "@/router";
import App from './App.vue'
import ElementPlus from 'element-plus'

const app = createApp(App)

app.use(ElementPlus)
app.use(router)
app.mount('#app')

