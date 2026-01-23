<script setup>
import { computed, onMounted } from 'vue'
import { useOrderStore } from '../stores/useOrderStore'
import { useRouter } from 'vue-router'
import { TABLE_STATUS, getStatusLabel } from '../config/tableStatus'
import ConfirmCheckoutPanel from './ConfirmCheckoutPanel.vue'
import ConfirmCheckoutArea from './ConfirmCheckoutArea.vue'

const router = useRouter()
const orderStore = useOrderStore()

// 開發環境：初始化測試資料
onMounted(() => {
  // 只在開發環境時初始化測試資料（開發時可隨時更新測試資料）
  if (import.meta.env.DEV) {
    // 設置桌次資訊
    orderStore.setTable({
      orderId: 'ORD-20241201-001',
      tableNumber: '3B桌',
      diners: 7,
      status: TABLE_STATUS.OCCUPIED // 1: 已開桌
    })

    // 添加測試商品到購物車
    orderStore.addToCart({
      id: 'PROD-001',
      name: '經典牛肉漢堡',
      price: 280,
      quantity: 2,
      note: '不要洋蔥',
      modifiers: []
    })

    orderStore.addToCart({
      id: 'PROD-002',
      name: '薯條（大）',
      price: 120,
      quantity: 1,
      note: '',
      modifiers: []
    })

    orderStore.addToCart({
      id: 'PROD-003',
      name: '可樂',
      price: 80,
      quantity: 3,
      note: '去冰',
      modifiers: []
    })

    orderStore.addToCart({
      id: 'PROD-004',
      name: '雞塊（6塊）',
      price: 150,
      quantity: 1,
      note: '',
      modifiers: []
    })
  }
})

// 將 store 的資料映射為組件需要的格式
// 確保響應式追蹤：明確訪問 store 的每個屬性
const order = computed(() => {
  const orderInfo = orderStore.orderInfo
  return {
    tableNumber: orderInfo.tableNumber || '2A桌',
    diners: orderInfo.diners || 5,
      status: orderInfo.status !== undefined ? getStatusLabel(orderInfo.status) : getStatusLabel(TABLE_STATUS.OCCUPIED),
    diningTime: '01:13', // TODO: 可從 store 或時間計算邏輯中取得
    totalAmount: orderStore.totalAmount,
  }
})

// 將 store 的 payment.details 映射為組件需要的 payments 格式
const payments = computed(() => orderStore.payment.details)

// 處理新增付款
const handleAddPayment = (payment) => {
  orderStore.payment.details.push(payment)
  // 更新已收金額
  orderStore.payment.receivedAmount = orderStore.payment.details.reduce(
    (sum, p) => Number(sum) + Number(p.amount),
    0
  )
}

// 刪除付款項目
const handleRemovePayment = (index) => {
  orderStore.payment.details.splice(index, 1)
  // 更新已收金額
  orderStore.payment.receivedAmount = orderStore.payment.details.reduce(
    (sum, p) => Number(sum) + Number(p.amount),
    0
  )
}

// 處理確認結帳成功：切換到桌次頁
const handleConfirmCheckoutSuccess = () => {
  console.log('確認結帳成功，切換到桌次頁')
  router.push('/table-selection')
}
</script>

<template>
  <main class="flex flex-1 p-4 gap-4 min-h-0 min-w-0">
    <!-- ConfirmCheckout Panel -->
    <ConfirmCheckoutPanel
      class="w-[330px] h-full shrink-0 bg-white rounded-2xl shadow-sm overflow-hidden"
      :order="order"
      :payments="payments"
      @remove-payment="handleRemovePayment"
    />
    <!-- ConfirmCheckout Area -->
    <ConfirmCheckoutArea
      class="flex-1 bg-white rounded-2xl shadow-sm  overflow-y-auto"
      :order="order"
      :payments="payments"
      @add-payment="handleAddPayment"
      @confirm-checkout-success="handleConfirmCheckoutSuccess"
    />
  </main>
</template>

<style scoped>
main {
  padding: 1rem; /* 對應 p-4 */
}
</style>
