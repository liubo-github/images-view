import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload)

Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')