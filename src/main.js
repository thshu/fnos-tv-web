// import './assets/main.css'

import { createApp } from "vue"
import App from './App.vue'
import VueCookies from 'vue-cookies';
import naive from 'naive-ui'
import global from './components/common.vue'
import router from './router'
import { createPinia } from 'pinia'
import Snackbar from 'node-snackbar';

import "node-snackbar/dist/snackbar.min.css"
import 'boxicons/css/boxicons.min.css'
import './registerServiceWorker'
import VueLazyload from 'vue-lazyload'

// 创建一个实例
const app = createApp(App);
const pinia = createPinia()
// 注入VueCookies
app.use(VueCookies);
// 注入naive-ui
app.use(naive)


app.use(VueLazyload)

app.use(router)

app.use(pinia)

app.config.globalProperties.$COMMON = global;

app.mount('#app')

app.config.errorHandler = (err, instance, info) => {
    console.error(err, instance, info)
    Snackbar.show({pos: 'top-center', text: err, showAction: false});
};
