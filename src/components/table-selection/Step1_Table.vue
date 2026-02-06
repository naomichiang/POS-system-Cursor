<script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { getStatusLabel } from '../../config/tableStatus'
  import BaseModal from '../common/BaseModal.vue'
  import { CalendarCheck, SprayCan } from 'lucide-vue-next'

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
    // 狀態 1, 2, 3: 用餐中（已開桌，進入點餐/編輯頁）
    else if ([1, 2, 3].includes(table.status)) {
      router.push(`/order/${table.id}`)
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
   * 樣式映射表 (精簡化原本的 Switch)
   */
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

        <div
          v-for="(area, index) in normalizedAreas"
          :key="area.key"
          class="space-y-4"
        >
          <div class="flex items-start content-start gap-4 self-stretch flex-wrap">
            <button
              v-for="table in area.tables"
              :key="table.id"
              @click="handleTableClick(table)"
              :class="[
                'flex h-34 min-w-40 flex-col justify-center items-center rounded-2xl overflow-hidden transition-all active:scale-95',
                props.modelValue === table.id ? 'ring-4 ring-button-primary ring-offset-2 z-10' : ''
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
                  class="text-center font-noto text-xl font-medium"
                  :class="table.timer ? 'text-white font-inter font-medium' : getTableStyles(table.status).text"
                >
                  {{ getStatusText(table) }}
                </div>
              </div>
            </button>
          </div>

          <!-- 區與區之間的分隔線 -->
          <div
            v-if="index < normalizedAreas.length - 1"
            class="h-0.5 self-stretch bg-border-primary"
          ></div>
        </div>
      </div>

      <BaseModal
        :open="showReserveModal"
        title="預約確認"
        :sub-title="`桌號：${reserveTableData?.label}`"
        :header-icon="CalendarCheck"
        header-icon-color-class="text-blue-400"
        secondary-button-text="返回"
        primary-button-text="確認帶位"
        width-class="w-[460px] max-w-[90vw]"
        @close="showReserveModal = false"
        @secondary="showReserveModal = false"
        @primary="confirmReserveOpen"
      >
      <div class="space-y-3 text-left bg-layer-light p-4 rounded-2xl w-full">
        <div class="grid grid-cols-[140px_1fr] gap-y-1">
          <p class="text-text-helper">預約人：</p>
          <p class="text-text-primary font-medium text-lg">王小明 先生</p>

          <p class="text-text-helper">預約時間：</p>
          <p class="text-text-primary font-medium text-lg">12:30</p>

          <p class="text-text-helper">預約人數：</p>
          <p class="text-text-primary font-medium text-lg">4 位</p>

          <p class="text-text-helper">預約電話：</p>
          <p class="text-text-primary font-medium text-lg">0923 123 456</p>
        </div>
      </div>
      </BaseModal>

      <BaseModal
        :open="showCleanModal"
        :title="`${cleanTableData?.label} 已完成清潔 ?`"
        :header-icon="SprayCan"
        header-icon-color-class="text-blue-400"
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
