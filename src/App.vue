<script setup>
  import { computed, onMounted } from 'vue'
  import { useOrderStore } from './stores/useOrderStore'
  import TopBar from './components/TopBar.vue'
  import AppSidebar from './components/AppSidebar.vue'
  import ConfirmCheckoutPanel from './components/ConfirmCheckoutPanel.vue'
  import ConfirmCheckoutArea from './components/ConfirmCheckoutArea.vue'

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
        status: '已開桌'
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

      // 可選：添加一筆測試付款記錄
      // orderStore.payment.details.push({
      //   type: 'cash',
      //   amount: 2000
      // })
      // orderStore.payment.receivedAmount = 2000
    }
  })

  // 將 store 的資料映射為組件需要的格式
  // 確保響應式追蹤：明確訪問 store 的每個屬性
  const order = computed(() => {
    const orderInfo = orderStore.orderInfo
    return {
      tableNumber: orderInfo.tableNumber || '2A桌',
      diners: orderInfo.diners || 5,
      status: orderInfo.status || '已開桌',
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
    // TODO: 實作頁面切換邏輯（例如使用 router.push('/tables')）
  }
  </script>

<template>
    <div class="flex flex-col w-full h-screen overflow-hidden bg-app-bg font-noto">
      <TopBar class="shrink-0 z-20" />

      <div class="flex flex-1 min-h-0">

        <AppSidebar class="w-18 shrink-0" h-full z-10/>
        <!-- Main Content -->
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
      </div>
    </div>
  </template>

<style scoped>
main {
  padding: 1rem; /* 對應 p-4 */
}
</style>
