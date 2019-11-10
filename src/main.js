import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"

import '@/assets/fonts/iconfont.css'
import '@/assets/css/global.css'

Vue.use(ElementUI)

axios.interceptors.request.use(config => {
    // console.log(config)
    config.headers.Authorization = window.sessionStorage.getItem('token')
        // 在最后必须 return config
    return config
})

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')