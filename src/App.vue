<script setup>
  import { ref } from 'vue'
  import TopBar from './components/TopBar.vue'
  import AppSidebar from './components/AppSidebar.vue'
  import ConfirmCheckoutPanel from './components/ConfirmCheckoutPanel.vue'
  import ConfirmCheckoutArea from './components/ConfirmCheckoutArea.vue'

  // 訂單資料（單一來源）
  const order = ref({
    tableNumber: '2A桌',
    diners: 5,
    status: '已開桌',
    diningTime: '01:13',
    totalAmount: 5250,
  })

  // 付款列表狀態
  const payments = ref([])

  // 處理新增付款
  const handleAddPayment = (payment) => {
    payments.value.push(payment)
  }

  // 刪除付款項目
  const handleRemovePayment = (index) => {
    payments.value.splice(index, 1)
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
