<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getStatusLabel } from '../../config/tableStatus'
import BaseModal from '../BaseModal.vue' // 確保路徑正確
import { CalendarCheck, SprayCan } from 'lucide-vue-next'

// 狀態碼對應說明：
// 0: 未開桌 (AVAILABLE)
// 1: 已開桌 (OCCUPIED)
// 2: 提醒桌 (WARNING)
// 3: 超時桌 (OVERTIME)
// 4: 已結帳 (CHECKED_OUT)
// 5: 待清潔桌 (CLEANING)
// 9: 預定桌 (RESERVED)

defineProps({
  modelValue: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'next'])
const router = useRouter()

// 模擬桌位資料（狀態使用數字）
const areaA = ref([
  { id: 'A1', label: 'A1 桌', status: 0, timer: null },
  { id: 'A2', label: 'A2 桌', status: 0, timer: null },
  { id: 'A3', label: 'A3 桌', status: 0, timer: null },
  { id: 'A4', label: 'A4 桌', status: 1, timer: '01:15:03' }
])

const areaB = ref([
  { id: 'B1', label: 'B1 桌', status: 9, timer: null },
  { id: 'B2', label: 'B2 桌', status: 1, timer: '01:15:03' },
  { id: 'B3', label: 'B3 桌', status: 1, timer: '01:15:03' },
  { id: 'B4', label: 'B4 桌', status: 0, timer: null },
  { id: 'B5', label: 'B5 桌', status: 2, timer: '01:15:03' },
  { id: 'B6', label: 'B6 桌', status: 3, timer: '01:15:03' },
  { id: 'B7', label: 'B7 桌', status: 0, timer: null },
  { id: 'B8', label: 'B8 桌', status: 4, timer: null },
  { id: 'B9', label: 'B9 桌', status: 1, timer: '01:15:03' }
])
// 控制預約燈箱
const showReserveModal = ref(false)
const reserveTableData = ref(null)

// 控制清潔燈箱
const showCleanModal = ref(false)
const cleanTableData = ref(null)

const handleTableClick = (table) => {
  // 狀態 0 (未開桌)：選擇桌位
  if (table.status === 0 ) {
    emit('update:modelValue', table.id)
    emit('next') // <--- 一般選桌直接跳下一步
  }
  else if (table.status === 9) { // 預定桌 -> 彈窗確認身份
    reserveTableData.value = table
    showReserveModal.value = true
  }
  // 狀態 1, 2, 3 (用餐中) -> 去點餐頁加點
  else if ([1, 2, 3].includes(table.status)) {
    router.push({
      path: '/ordering',
      query: { tableId: table.id, mode: 'edit' }
    })
  }
  // 狀態 4, 5 (已結帳、待清潔) -> 觸發清潔確認
  else if ([4, 5].includes(table.status)) {
    cleanTableData.value = table
    showCleanModal.value = true
  }
}


// 執行開桌 (從預約轉換)
const confirmReserveOpen = () => {
  emit('update:modelValue', reserveTableData.value.id)
  showReserveModal.value = false
  emit('next') // <--- 預約確認後跳下一步
}

// 執行清潔完成 (回歸狀態 0)
const confirmCleaned = () => {
  // 這裡之後要接 API 更新後端資料庫
  cleanTableData.value.status = 0
  showCleanModal.value = false
}

// 依照 main.css 190-204 的訂單狀態色，回傳桌位主區塊 / 下方列 / 文字顏色樣式
const getTableStyles = (status) => {
  switch (status) {
    case 0: // 未開桌
      return {
        main: 'bg-ordstatus-0-primary',
        caption: 'bg-ordstatus-0-secondary',
        text: 'text-text-helper'
      }
    case 1: // 已開桌
      return {
        main: 'bg-ordstatus-1-primary',
        caption: 'bg-ordstatus-1-secondary',
        text: 'text-text-on-color'
      }
    case 2: // 提醒桌
      return {
        main: 'bg-ordstatus-2-primary',
        caption: 'bg-ordstatus-2-secondary',
        text: 'text-text-on-color'
      }
    case 3: // 超時桌
      return {
        main: 'bg-ordstatus-3-primary',
        caption: 'bg-ordstatus-3-secondary',
        text: 'text-text-on-color'
      }
    case 4: // 已結帳
      return {
        main: 'bg-ordstatus-4-primary',
        caption: 'bg-ordstatus-4-secondary',
        text: 'text-text-on-color'
      }
    case 5: // 待清潔桌
      return {
        main: 'bg-ordstatus-5-primary',
        caption: 'bg-ordstatus-5-secondary',
        text: 'text-text-helper'
      }
    case 9: // 預定桌
      return {
        main: 'bg-ordstatus-9-primary',
        caption: 'bg-ordstatus-9-secondary',
        text: 'text-text-on-color'
      }
    default:
      return {
        main: 'bg-ordstatus-0-primary',
        caption: 'bg-ordstatus-0-secondary',
        text: 'text-text-primary'
      }
  }
}

// 獲取狀態顯示文字
const getStatusText = (table) => {
  if (table.timer) {
    if (table.status === 3) { // 超時桌
      return `超 ${table.timer}`
    }
    return table.timer
  }

  return getStatusLabel(table.status)
}
/* 取消預約 */
const handleCancelReservation = () => {
  // 這裡可以加入確認視窗或直接修改狀態
  if (confirm('確定要取消此筆預約嗎？')) {
    // 假設取消後桌位變回狀態 0 (AVAILABLE)
    if (reserveTableData.value) {
      reserveTableData.value.status = 0;
    }
    showReserveModal.value = false;
    reserveTableData.value = null;
  }
}

/* 發出 next 事件，通知父元件進入下一步 */
const emitNext = () => {
  emit('update:modelValue', modelValue.value)
}

</script>

<template>
  <div class="flex-1 bg-white rounded-2xl shadow-sm overflow-y-auto">
    <div class="p-8 space-y-6">
      <h2 class="text-xl font-semibold text-text-primary mb-6">請選桌次</h2>

      <!-- Row A: Tables A1-A4 -->
      <div class="flex items-start content-start gap-4 self-stretch flex-wrap">
        <button
          v-for="table in areaA"
          :key="table.id"
          @click="handleTableClick(table)"
          :class="[
            'flex h-34 min-w-40 flex-col justify-center items-center rounded-2xl overflow-hidden transition-all active:scale-95',
            modelValue === table.id ? 'ring-4 ring-button-primary ring-offset-2 z-10' : ''
          ]"
        >
          <div
            class="flex justify-center items-center flex-1 self-stretch"
            :class="getTableStyles(table.status).main"
          >
            <div class="text-white text-center font-noto text-[28px] font-semibold tracking-[1.2px]">
            {{ table.label }}
            </div>
          </div>
          <div
            class="flex h-14 justify-center items-center shrink-0 self-stretch"
            :class="getTableStyles(table.status).caption"
          >
            <div
              class="text-center font-noto text-xl font-medium "
              :class="table.timer ? 'text-white font-inter font-medium' : getTableStyles(table.status).text"
            >
              {{ getStatusText(table) }}
            </div>
          </div>
        </button>
      </div>

      <!-- Divider -->
      <div class="h-0.5 self-stretch bg-border-primary"></div>

      <!-- Row B: Tables B1-B9 -->
      <div class="flex items-start content-start gap-4 self-stretch flex-wrap">
        <button
          v-for="table in areaB"
          :key="table.id"
          @click="handleTableClick(table)"
          :class="[
            'flex h-34 min-w-40 flex-col justify-center items-center rounded-2xl overflow-hidden transition-all active:scale-95',
            modelValue === table.id ? 'ring-4 ring-button-primary ring-offset-2 z-10' : ''
          ]"
        >
          <div
            class="flex justify-center items-center flex-1 self-stretch"
            :class="getTableStyles(table.status).main"
          >
            <div class="text-white text-center font-noto text-[28px] font-semibold tracking-[1.2px]">
              {{ table.label }}
            </div>
          </div>
          <div
            class="flex h-14 justify-center items-center shrink-0 self-stretch"
            :class="getTableStyles(table.status).caption"
          >
            <div
              class="text-center font-noto text-xl font-medium "
              :class="table.timer ? 'text-white font-inter font-medium' : getTableStyles(table.status).text"
            >
              {{ getStatusText(table) }}
            </div>
          </div>
        </button>
      </div>
    </div>

    <BaseModal
      :open="showReserveModal"
      :show-close="false"
      title="預約確認"
      :sub-title="`桌號：${reserveTableData?.label}`"
      :header-icon="CalendarCheck"
      header-icon-color-class="text-blue-400"
      secondary-button-text="取消訂位"
      primary-button-text="確認帶位"

      @close="showReserveModal = false"
      @primary="confirmReserveOpen"
      @secondary="handleCancelReservation"
    >
      <div class="space-y-3 text-left bg-layer-light p-4 rounded-2xl w-full">
        <div class="grid grid-cols-[240px_1fr] gap-y-3">
          <p class="text-text-helper">預約人：<span class="text-text-primary font-medium">王小明 先生</span></p>
          <p class="text-text-helper">時間：<span class="text-text-primary font-medium">12:30</span></p>
          <p class="text-text-helper">電話：<span class="text-text-primary font-medium">0912-123-456</span></p>
          <p class="text-text-helper">人數：<span class="text-text-primary font-medium">4 位</span></p>
        </div>
      </div>
    </BaseModal>

    <BaseModal
      :open="showCleanModal"
      :title="`${cleanTableData?.label}已完成清潔 ? `"
      :header-icon="SprayCan"
      header-icon-color-class="text-ash-500"
      content="確認清潔完成後，將開放選桌"
      primary-button-text="確認完成"
      secondary-button-text="返回"
      :show-close="false"
      @close="showCleanModal = false"
      @secondary="showCleanModal = false"
      @primary="confirmCleaned"
    />

  </div>
</template>

