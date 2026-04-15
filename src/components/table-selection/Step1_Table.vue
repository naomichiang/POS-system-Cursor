<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getStatusLabel } from '../../config/tableStatus'
import { MOCK_RESERVE_LIST } from '../../mock/reserveTableDataMock'
import BaseModal from '../common/BaseModal.vue'
import { CalendarCheck, SprayCan, Utensils, ScrollText, ArrowLeftRight, Users, BookmarkMinus } from 'lucide-vue-next'

// 接收 Props
const props = defineProps({
  modelValue: {
    type: String,
    default: null
  },
  /**
   * 由後端（RestaurantConfig）傳入的座位區設定
   */
  tableAreas: {
    type: Array,
    default: () => []
  },
  /**
   * 桌號 -> 狀態（由 useTableSyncStore 提供，含 WebSocket 即時更新）
   * 未在 map 內視為 0（未開桌）
   */
  tableStatusMap: {
    type: Object,
    default: () => ({})
  }
})

// 定義 Emit
const emit = defineEmits(['update:modelValue', 'next'])
const router = useRouter()

/**
 * 根據 RestaurantConfig.tableAreas 與 tableStatusMap 產生桌位列表
 * status 來自 tableStatusMap（WebSocket 同步），無則為 0（未開桌）
 */
const normalizedAreas = computed(() => {
  if (!props.tableAreas?.length) return []
  const statusMap = props.tableStatusMap ?? {}

  return props.tableAreas.map((area) => {
    const tables = []
    const count = area.tableCount ?? 0
    for (let i = 0; i < count; i++) {
      const tableId = `${area.key}${i + 1}`
      tables.push({
        id: tableId,
        label: `${tableId} 桌`,
        status: statusMap[tableId] ?? 0,
        timer: null
      })
    }

    return {
      key: area.key,
      label: area.label,
      tables
    }
  })
})

// Modal 控制狀態
const showReserveModal = ref(false)
const reserveTableData = ref(null)
const showCleanModal = ref(false)
const cleanTableData = ref(null)
const showOccupiedModal = ref(false)
const occupiedTableData = ref(null)

/**
 * 將桌號格式化為 "數字 - 區" 顯示（例如 A2 → "2 - A"）
 */
const formatTableDisplay = (tableId) => {
  const match = String(tableId).match(/^([A-Za-z]+)(\d+)$/)
  if (match) return `${match[2]} - ${match[1]}`
  return tableId
}

/**
 * 處理桌位點擊邏輯
 */
const handleTableClick = (table) => {
  // 狀態 0: 未開桌
  if (table.status === 0) {
    emit('update:modelValue', table.id)
    emit('next')
  }
  // 狀態 9: 預定桌
  else if (table.status === 9) {
    reserveTableData.value = table
    showReserveModal.value = true
  }
  // 狀態 1, 2, 3: 用餐中（已開桌，顯示燈箱選單）
  else if ([1, 2, 3].includes(table.status)) {
    occupiedTableData.value = table
    showOccupiedModal.value = true
  }
  // 狀態 4, 5: 結帳/待清
  else if ([4, 5].includes(table.status)) {
    cleanTableData.value = table
    showCleanModal.value = true
  }
}

/**
 * 預約桌確認開桌
 */
const confirmReserveOpen = () => {
  if (reserveTableData.value) {
    emit('update:modelValue', reserveTableData.value.id)
    showReserveModal.value = false
    emit('next')
  }
}

/**
 * 清潔完成確認
 */
const confirmCleaned = () => {
  if (cleanTableData.value) {
    cleanTableData.value.status = 0
    showCleanModal.value = false
    cleanTableData.value = null
  }
}

/**
 * 已開桌燈箱：五個操作按鈕
 */
const handleOccupiedAction = (action) => {
  const table = occupiedTableData.value
  if (!table) return

  showOccupiedModal.value = false

  switch (action) {
    case 'order':
      router.push(`/order/${table.id}`)
      break
    case 'checkout':
      router.push(`/bill-adjust/${table.id}`)
      break
    case 'change-table':
      // TODO: 換桌流程
      break
    case 'merge-table':
      // TODO: 併桌流程
      break
    case 'close':
    default:
      occupiedTableData.value = null
      break
  }
}


const getTableStyles = (status) => {
  const styleMap = {
    0: { main: 'bg-ordstatus-0-primary', caption: 'bg-ordstatus-0-secondary', text: 'text-text-helper' },
    1: { main: 'bg-ordstatus-1-primary', caption: 'bg-ordstatus-1-secondary', text: 'text-text-on-color' },
    2: { main: 'bg-ordstatus-2-primary', caption: 'bg-ordstatus-2-secondary', text: 'text-text-on-color' },
    3: { main: 'bg-ordstatus-3-primary', caption: 'bg-ordstatus-3-secondary', text: 'text-text-on-color' },
    4: { main: 'bg-ordstatus-4-primary', caption: 'bg-ordstatus-4-secondary', text: 'text-text-on-color' },
    5: { main: 'bg-ordstatus-5-primary', caption: 'bg-ordstatus-5-secondary', text: 'text-text-helper' },
    9: { main: 'bg-ordstatus-9-primary', caption: 'bg-ordstatus-9-secondary', text: 'text-text-on-color' }
  }
  return styleMap[status] || styleMap[0]
}

/**
 * 根據桌位 ID 取得該桌所有預約（之後改由後端 API 串接）
 */
const currentReserveDetail = computed(() => {
  const tableId = reserveTableData.value?.id
  if (!tableId) return []
  return MOCK_RESERVE_LIST.filter((item) => item.tableId === tableId)
})

/**
 * 獲取狀態顯示文字
 */
const getStatusText = (table) => {
  if (table.timer) {
    return table.status === 3 ? `超 ${table.timer}` : table.timer
  }
  return getStatusLabel(table.status)
}
</script>

<template>
  <div class="flex-1 bg-white rounded-2xl shadow-sm overflow-y-auto">
    <div class="p-8 space-y-4">
      <h2 class="text-xl font-bold text-text-secondary mb-6">請選桌次</h2>

      <div v-for="(area, index) in normalizedAreas" :key="area.key" class="space-y-4">
        <div class="flex items-start content-start gap-4 self-stretch flex-wrap">
          <button v-for="table in area.tables" :key="table.id" @click="handleTableClick(table)" :class="[
            'flex h-34 min-w-40 flex-col justify-center items-center rounded-2xl overflow-hidden transition-all active:scale-95',
            props.modelValue === table.id ? 'ring-4 ring-button-primary ring-offset-2 z-10' : ''
          ]">
            <div class="flex justify-center items-center flex-1 self-stretch"
              :class="getTableStyles(table.status).main">
              <div class="text-white text-center font-noto text-[28px] font-semibold tracking-[1.2px]">
                {{ table.label }}
              </div>
            </div>
            <div class="flex h-14 justify-center items-center shrink-0 self-stretch"
              :class="getTableStyles(table.status).caption">
              <div class="text-center font-noto text-xl font-medium"
                :class="table.timer ? 'text-white font-inter font-medium' : getTableStyles(table.status).text">
                {{ getStatusText(table) }}
              </div>
            </div>
          </button>
        </div>

        <!-- 區與區之間的分隔線 -->
        <div v-if="index < normalizedAreas.length - 1" class="h-0.5 self-stretch bg-border-primary"></div>
      </div>
    </div>

    <!-- 預約桌確認燈箱 -->
    <BaseModal :open="showReserveModal" title="預約確認"
      :sub-title="currentReserveDetail[0]?.tableLabel ?? reserveTableData?.label ?? ''" :header-icon="CalendarCheck"
      header-icon-color-class="text-blue-400" secondary-button-text="返回"
      :primary-button-text="currentReserveDetail.length > 0 ? '確認帶位' : ''" width-class="w-[460px] max-w-[90vw]"
      height-class="h-auto max-h-[90vh]" @close="showReserveModal = false" @secondary="showReserveModal = false"
      @primary="confirmReserveOpen">
      <div class="flex w-full flex-col justify-start">
        <div v-if="currentReserveDetail.length > 0" class="text-left bg-layer-light p-4 rounded-md w-full ">
          <div class="grid grid-cols-[140px_1fr] gap-y-1">
            <p class="text-text-helper">預約人：</p>
            <p class="text-text-primary font-medium text-lg">{{ currentReserveDetail[0].customerName }}</p>
            <p class="text-text-helper">預約時間：</p>
            <p class="text-text-primary font-medium text-lg">{{ currentReserveDetail[0].reserveTime }}</p>
            <p class="text-text-helper">預約人數：</p>
            <p class="text-text-primary font-medium text-lg">{{ currentReserveDetail[0].dinerCount }} 位</p>
            <p class="text-text-helper">預約電話：</p>
            <p class="text-text-primary font-medium text-lg">{{ currentReserveDetail[0].phone }}</p>
          </div>
        </div>
        <p v-else class="text-text-helper font-noto text-lg text-center py-6">查無預約資訊</p>
      </div>

    </BaseModal>

    <!-- 清潔完成確認燈箱 -->
    <BaseModal :open="showCleanModal" :title="`${cleanTableData?.label}清潔完成 ?`" :header-icon="SprayCan"
      header-icon-color-class="text-blue-400" content="確認清潔完成後，將開放選桌" primary-button-text="確認完成"
      secondary-button-text="返回" :show-close="false" @close="showCleanModal = false" @secondary="showCleanModal = false"
      @primary="confirmCleaned" />

    <!-- 已開桌燈箱功能選單：點餐、結帳、拆桌、併桌、重新開單-->
    <BaseModal :open="showOccupiedModal" :show-close="true" @close="handleOccupiedAction('close')"
      :title="occupiedTableData ? occupiedTableData.label : '桌位'" width-class="w-[480px] max-w-[80vw]"
      height-class="h-auto max-h-[90vh] min-h-[300px]">
      <template #footer>
        <div class="w-full grid grid-cols-6 gap-3 -mt-4">
          <button type="button"
            class="col-span-3 h-38 rounded-2xl bg-button-primary active:bg-button-primary-hover active:scale-95 transition-all flex flex-col items-center justify-center gap-4 text-white"
            @click="handleOccupiedAction('order')">
            <Utensils class="w-9 h-9" />
            <span class="text-2xl font-semibold font-noto">點餐</span>
          </button>

          <button type="button"
            class="col-span-3 h-38 rounded-2xl bg-button-danger active:bg-button-danger-hover active:scale-95 transition-all flex flex-col items-center justify-center gap-4 text-white"
            @click="handleOccupiedAction('checkout')">
            <ScrollText class="w-10 h-10" />
            <span class="text-2xl font-semibold font-noto">結帳</span>
          </button>

          <button type="button"
            class="col-span-2 h-28 rounded-2xl bg-button-light active:bg-button-light-hover active:scale-95 transition-all flex flex-col items-center justify-center gap-2 text-ash-700 border border-ash-600"
            @click="handleOccupiedAction('change-table')">
            <ArrowLeftRight class="w-7 h-7" />
            <span class="text-xl font-semibold">換桌</span>
          </button>

          <button type="button"
            class="col-span-2 h-28 rounded-2xl  bg-button-light active:bg-button-light-hover  active:scale-95 transition-all flex flex-col items-center justify-center gap-2 text-ash-700 border border-ash-600"
            @click="handleOccupiedAction('merge-table')">
            <Users class="w-7 h-7" />
            <span class="text-xl font-semibold">拆/併桌</span>
          </button>

          <button type="button"
            class="col-span-2 h-28 rounded-2xl  bg-button-light active:bg-button-light-hover  active:scale-95 transition-all flex flex-col items-center justify-center gap-2 text-ash-700 border border-ash-600"
            @click="handleOccupiedAction('reset-order')">
            <BookmarkMinus class="w-7 h-7" />
            <span class="text-xl font-semibold">重新開單</span>
          </button>
        </div>
      </template>
    </BaseModal>

  </div>
</template>
