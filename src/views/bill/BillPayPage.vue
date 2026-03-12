<script setup>
defineOptions({ name: 'BillPayPage' })
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/useOrderStore'
import BillPayPanel from '@/components/bill/BillPayPanel.vue'
import BillPayCalculator from '@/components/bill/BillPayCalculator.vue'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

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
    <!-- BillPay Panel -->
    <BillPayPanel class="w-[330px] h-full shrink-0 bg-white rounded-2xl shadow-sm overflow-hidden"
      :table-id="route.params.tableId" :payments="payments" @remove-payment="handleRemovePayment" />
    <!-- BillPay Calculator -->
    <BillPayCalculator class="flex-1 bg-white rounded-2xl shadow-sm  overflow-y-auto" :payments="payments"
      @add-payment="handleAddPayment" @confirm-checkout-success="handleConfirmCheckoutSuccess" />
  </main>
</template>

<style scoped>
main {
  padding: 1rem;
  /* 對應 p-4 */
}
</style>
