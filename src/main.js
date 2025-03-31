// import './assets/main.css'

import { createApp } from "vue"
import App from './App.vue'
import VueCookies from 'vue-cookies';
import naive from 'naive-ui'
import global from './components/common.vue'
import router from './router'

import "node-snackbar/dist/snackbar.min.css"
import 'boxicons/css/boxicons.min.css'

// 创建一个实例
const app = createApp(App);
// 注入VueCookies
app.use(VueCookies);
// 注入naive-ui
app.use(naive)

app.use(router)

app.config.globalProperties.$COMMON = global;

app.mount('#app')
