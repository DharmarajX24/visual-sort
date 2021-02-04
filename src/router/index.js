import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home'
import Sorter from "../components/Sorter";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/visual-sort',
    name: 'Sorter',
    component: Sorter
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
