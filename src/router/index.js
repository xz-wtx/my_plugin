import { createRouter, createWebHashHistory } from 'vue-router'
import scroll from '@/demo/scroll'
import scrollY from "@/demo/scrollY";

const routes = [
  {
    path: '/scroll',
    name: 'scroll',
    component: scroll
  },
  {
    path: '/scrollY',
    name: 'scrollY',
    component: scrollY
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
