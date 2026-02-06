<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useOrderStore } from '../stores/useOrderStore'
import { useTableSyncStore } from '../stores/useTableSyncStore'
import { useRouter } from 'vue-router'
import { TABLE_STATUS } from '../config/tableStatus'
import { DEFAULT_RESTAURANT_CONFIG } from '../config/restaurantConfig'
import Step1_Table from './table-selection/Step1_Table.vue'
import Step2_DinerCount from './table-selection/Step2_DinerCount.vue'
import Step3_MainOption from './table-selection/Step3_RestaurantMainOption.vue'
import Step4_SubOption from './table-selection/Step4_RestaurantSubOption.vue'
import StepNavigationButtons from './table-selection/StepNavigationButtons.vue'

const router = useRouter()
const orderStore = useOrderStore()
const tableSyncStore = useTableSyncStore()

// 根容器 ref，用來掛載觸控監聽（防止快速點擊縮放）
const rootRef = ref(null)

const currentStep = ref(1) // 預設顯示步驟 1（桌位）

// TODO: 串接後端時，請將此處改為呼叫 API 取得對應餐廳／分店的 RestaurantConfig
// 例如：
// const { data } = await api.getRestaurantConfig(restaurantId)
// const restaurantConfig = ref(data)
const restaurantConfig = ref(DEFAULT_RESTAURANT_CONFIG)

// 用餐人數 picker 設定、額外欄位與用餐方案按鈕，從 RestaurantConfig 取出
const pickerConfigs = computed(() => restaurantConfig.value?.dinerPickers ?? [])
const preferenceGroups = computed(() => restaurantConfig.value?.extraFields ?? [])
const SubOptions = computed(() => restaurantConfig.value?.extraFields2 ?? [])

// 表單資料
const formData = ref({
  serviceType: 'dine-in', // 所有訂單一律視為內用
  table: null,
  diners: null,
  customerInfo: { preferences: {} },   // Step3 額外選項（extraFields）
  customerInfo2: { preferences: {} }   // Step4 額外選項（extraFields2）
})

// 計算屬性
const isFirstStep = computed(() => currentStep.value === 1)
const isLastStep = computed(() => currentStep.value === 4)

// 通用必填欄位校驗
/**
 * 通用必填欄位校驗
 * @param {Array} groups - 來自 RestaurantConfig 的 ExtraField 陣列（extraFields / extraFields2）
 * @param {Object} values - 目前已選擇的資料，例如 formData.customerInfo.preferences
 */
const validateRequiredGroups = (groups = [], values = {}) => {
  if (!Array.isArray(groups) || groups.length === 0) {
    // 沒有任何欄位設定時，視為可通過
    return true
  }

  // 只挑出 required 的群組
  const requiredGroups = groups.filter(group => group?.required)

  // 若沒有任何 required 欄位，也視為可通過
  if (requiredGroups.length === 0) return true

  return requiredGroups.every(group => {
    const key = group.key ?? group.label
    const val = values?.[key]

    // 多選：必須有至少一個值
    if (Array.isArray(val)) {
      return val.length > 0
    }

    // 單選：不能是 null / undefined / 空字串
    return val !== undefined && val !== null && val !== ''
  })
}

// 檢查當前步驟是否可以繼續
const canProceed = computed(() => {
  const { table, diners, customerInfo, customerInfo2 } = formData.value

  switch (currentStep.value) {
    case 1: // 桌位
      return table !== null

    case 2: // 用餐人數
      return diners !== null && Number(diners) > 0

    case 3: // Step3 額外選項校驗（extraFields）
      return validateRequiredGroups(
        preferenceGroups.value,
        customerInfo?.preferences
      )

    case 4: // Step4 額外選項校驗（extraFields2）
      return validateRequiredGroups(
        SubOptions.value,
        customerInfo2?.preferences
      )

    default:
      return false
  }
})

// 監聽桌位選擇，選擇後自動進入步驟 2
watch(
  () => formData.value.table,
  (newValue) => {
    if (newValue !== null && currentStep.value === 1) {
      // 選擇桌位後自動進入下一步
      currentStep.value = 2
    }
  }
)

// 方法
const nextStep = () => {
  if (!canProceed.value) return

  // 如果是最後一步，提交表單
  if (isLastStep.value) {
    handleSubmit()
    return
  }

  // 否則進入下一步
  currentStep.value++
}

const prevStep = () => {
  if (isFirstStep.value) return
  currentStep.value--
}

const submitLoading = ref(false)
const submitError = ref(null)

const handleSubmit = async () => {
  const tableId = formData.value.table
  if (!tableId) return

  submitLoading.value = true
  submitError.value = null

  // 1. 準備要傳送的資料（開發階段模擬，後端 API 就緒後可改為呼叫 createOrder）
  const orderData = {
    orderId: `ORD-${Date.now()}`,
    tableNumber: tableId,
    diners: formData.value.diners,
    status: TABLE_STATUS.OCCUPIED, // 1: 已開桌
    serviceType: formData.value.serviceType ?? 'dine-in',
    customerInfo: formData.value.customerInfo,
    customerInfo2: formData.value.customerInfo2,
    openedAt: new Date().toISOString()
  }

  try {
    // --- 模擬 API 請求（開發用）---
    console.log('正在傳送開桌資料至後端...', orderData)
    await new Promise(resolve => setTimeout(resolve, 800))
    console.log('後端已確認開桌，訂單已建立')
    // --- 模擬結束 ---

    // 2. 更新前端全域狀態 (Pinia Store)
    orderStore.setTable(orderData)
    tableSyncStore.setTableStatus(tableId, TABLE_STATUS.OCCUPIED)

    // 3. 導向點餐頁
    router.push(`/order/${orderData.tableNumber}`)
  } catch (error) {
    console.error('模擬開桌發生錯誤:', error)
    submitError.value = error?.message ?? '開桌失敗，請稍後再試'
  } finally {
    submitLoading.value = false
  }
}

// -------- 防止快速連點觸發縮放（特別是 iOS Safari 雙擊縮放），同時保留按鈕連點行為 --------
let lastTouchEnd = 0

const handleTouchEnd = (event) => {
  const now = Date.now()
  // 兩次 touchend 間隔過短，視為快速連點，阻止預設縮放行為
  if (now - lastTouchEnd <= 300) {
    const targetButton = event.target.closest && event.target.closest('button')
    // 若是按鈕，手動觸發一次 click，確保像人數 picker 這類元件可以正常連點
    if (targetButton) {
      targetButton.click()
    }
    // 僅在事件可取消時呼叫 preventDefault，避免滾動中的 touchend 觸發 [Intervention] 警告
    if (event.cancelable) {
      event.preventDefault()
    }
  }
  lastTouchEnd = now
}

onMounted(() => {
  if (rootRef.value) {
    rootRef.value.addEventListener('touchend', handleTouchEnd, { passive: false })
  }
  tableSyncStore.connectWs()

  // 開發階段：直接模擬一筆 A2 桌、狀態 1、總金額 1770 的訂單
  // 會透過 useTableSyncStore.mockOrderForDev() 更新桌位狀態，讓桌次頁看到 A2 已開桌
  try {
    const mockOrder = tableSyncStore.mockOrderForDev()
    console.log('[DEV] 已載入模擬訂單：', mockOrder)
  } catch (e) {
    console.warn('[DEV] 載入模擬訂單失敗：', e)
  }
})

onBeforeUnmount(() => {
  if (rootRef.value) {
    rootRef.value.removeEventListener('touchend', handleTouchEnd)
  }
})
</script>

<template>
  <div ref="rootRef" class="flex flex-col w-full h-full bg-layer-secondary font-noto">
    <!-- 主要內容區域 -->
    <div class="flex-1 overflow-hidden p-4 gap-4 bg-app-bg flex">
      <!-- 步驟 1: 桌位 -->
      <Step1_Table
        v-if="currentStep === 1"
        v-model="formData.table"
        :table-areas="restaurantConfig.tableAreas"
        :table-status-map="tableSyncStore.tableStatusMap"
        @next="nextStep"
      />
      <!-- 步驟 2: 用餐人數 -->
      <div v-if="currentStep === 2" class="flex-1 flex flex-col overflow-hidden">
        <div class="flex-1 flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden">
          <Step2_DinerCount
            v-model="formData.diners"
            :table-id="formData.table"
            :picker-configs="pickerConfigs"
            @next="nextStep"
          />
          <!-- 按鈕區域 -->
          <StepNavigationButtons
            :is-first-step="isFirstStep"
            :is-last-step="isLastStep"
            :can-proceed="canProceed"
            :submit-loading="submitLoading"
            @prev="prevStep"
            @next="nextStep"
            @submit="handleSubmit"
          />
        </div>
      </div>

      <!-- 步驟 3: Restaurant Main Option，用餐方案 / 用餐用途 -->
      <div v-if="currentStep === 3" class="flex-1 flex flex-col overflow-hidden">
        <div class="flex-1 flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden">
          <Step3_MainOption
            v-model="formData.customerInfo"
            :preference-groups="preferenceGroups"
          />
          <!-- 按鈕區域 -->
          <StepNavigationButtons
            :is-first-step="isFirstStep"
            :is-last-step="isLastStep"
            :can-proceed="canProceed"
            :submit-loading="submitLoading"
            @prev="prevStep"
            @next="nextStep"
            @submit="handleSubmit"
          />
        </div>
      </div>

      <!-- 步驟 4: Restaurant Sub Option，用餐方案 -->
      <div v-if="currentStep === 4" class="flex-1 flex flex-col overflow-hidden">
        <div class="flex-1 flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden">
          <Step4_SubOption
            v-model="formData.customerInfo2"
            :preference-groups="SubOptions"
          />
          <!-- 按鈕區域 -->
          <StepNavigationButtons
            :is-first-step="isFirstStep"
            :is-last-step="isLastStep"
            :can-proceed="canProceed"
            :submit-loading="submitLoading"
            @prev="prevStep"
            @next="nextStep"
            @submit="handleSubmit"
          />
          <p v-if="submitError" class="mt-2 text-center text-button-danger text-lg">{{ submitError }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 隱藏滾動條但保持滾動功能 */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>
