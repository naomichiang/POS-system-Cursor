import { createRouter, createWebHistory } from 'vue-router'
import TableSelectionPage from '../components/TableSelectionPage.vue'
import HomePage from '../components/HomePage.vue'
import OrderPage from '../components/OrderPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/table-selection',
      name: 'table-selection',
      component: TableSelectionPage
    },
    {
      path: '/order/:tableId',
      name: 'order',
      component: OrderPage
    }
  ],
})

export default router
