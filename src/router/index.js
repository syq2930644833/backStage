import Vue from "vue"
import Router from "vue-router"
import Layout from "@/views/layout"

Vue.use(Router)

export default new Router({
  // base:'/admin/',
  // mode:'history',
  routes: [
    {
      path: "/",
      component: Layout,
      redirect: '/homePage',
      children: [
        {
          path: 'homePage',
          component: () => import('@/views/index/index'),
          name: 'homePage',
          meta: { title: 'homePage', icon: 'dashboard', affix: true }
        }
      ]
    },
  ],
})
