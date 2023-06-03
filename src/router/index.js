import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import MainBox from '../views/MainBox.vue'
import RoutesConfig from './config'
import store from '../store'

const routes = [
  {
    path: "/login",
    name:"login",
    component: Login
  },
  {
    path: "/mainbox",
    name:"mainbox",
    component: MainBox
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to,from, next)=>{
  if (to.name === 'login') {
    next()
  } else {
    if(!localStorage.getItem('token')) {
      next({
        path: '/login'
      })
    } else {
      if (!store.state.isGetterRouter) {
        router.removeRoute("mainbox")
        configRouter()
        next({
          path: to.fullPath
        })
      } else {
        next()
      }
    }
  }
})

const configRouter = () => {
  if (!router.hasRoute('mainbox')) {
    router.addRoute({
      path: "/mainbox",
      name:"mainbox",
      component: MainBox
    })
  }
  
  RoutesConfig.forEach(item=>{
    checkPermission(item) && router.addRoute("mainbox", item)
  })

  store.commit('changeGetterRoute', true)
}


const checkPermission = (item) => {
  if (!item.requireAdmin) {
    return true
  }

  return store.state.userInfo.role === 1
}


export default router
