import App from './App.vue'
import router from './router'

const Vue = window.Vue
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
