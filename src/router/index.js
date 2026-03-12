import { createRouter, createWebHistory } from 'vue-router'
import TableSelectionPage from '@/views/TableSelectionPage.vue'
import BillPayPage from '@/views/bill/BillPayPage.vue'
import OrderPage from '@/views/order/OrderPage.vue'
import BillAdjustPage from '@/views/bill/BillAdjustPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/table-selection'
    },
    {
      path: '/bill-pay/:tableId',
      name: 'bill-pay',
      component: BillPayPage
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
    },
    {
      path: '/bill-adjust/:tableId',
      name: 'bill-adjust',
      component: BillAdjustPage
    }
  ],
})

export default router
