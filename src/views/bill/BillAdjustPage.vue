<script setup>
defineOptions({ name: 'BillAdjustPage' })
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useOrderStore } from '@/stores/useOrderStore'
import BillAdjustPanel from '@/components/bill/BillAdjustPanel.vue'
import ItemAdjust from '@/components/bill/ItemAdjust.vue'
import GlobalAdjust from '@/components/bill/GlobalAdjust.vue'
import BillActionFooter from '@/components/bill/BillActionFooter.vue'

const route = useRoute()
const orderStore = useOrderStore()
const tableId = route.params.tableId

onMounted(() => {
  orderStore.fetchOrderData(tableId)
})
</script>

<template>
  <main class="flex flex-1 p-4 gap-4 min-h-0 min-w-0">
    <!-- 左側：結帳明細欄 -->
    <BillAdjustPanel />

    <!-- 右側大操作區 -->
    <div class="flex-1 flex flex-col min-h-0 bg-white rounded-2xl shadow-sm overflow-hidden">
      <!-- 上半部區域 -->
      <div class="flex-1 flex min-h-0">
        <ItemAdjust class="w-1/3 shrink-0" />
        <GlobalAdjust class="flex-1 min-w-0" />
      </div>
      <!-- 下半部區域 -->
      <BillActionFooter second-button-text="暫存" primary-button-text="結帳">
        <template #leftGroup>
          <button type="button"
            class="flex w-btn-md h-full justify-center items-center rounded-2xl bg-button-primary active:bg-button-primary-hover transition-colors">
            <span
              class="text-text-on-color text-center font-noto text-2xl font-medium leading-[128%] tracking-[0.05em]">
              功能
            </span>
          </button>
        </template>
      </BillActionFooter>
    </div>
  </main>
</template>
