import Index from './views/Index.vue'

const Vue = window.Vue
const Router = window.VueRouter
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Index
    },
    {
      path: '/:stackName/:serviceName/:instanceId',
      component: Index
    },
  ]
})
