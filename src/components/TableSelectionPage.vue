<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useOrderStore } from '../stores/useOrderStore'
import { useRouter } from 'vue-router'
import { TABLE_STATUS } from '../config/tableStatus'
import { DEFAULT_RESTAURANT_CONFIG } from '../config/restaurantConfig'
import Step1_Table from './steps/Step1_Table.vue'
import Step2_DinerCount from './steps/Step2_DinerCount.vue'
import Step3_MainOption from './steps/Step3_RestaurantMainOption.vue'
import Step4_SubOption from './steps/Step4_RestaurantSubOption.vue'
import StepNavigationButtons from './StepNavigationButtons.vue'

const router = useRouter()
const orderStore = useOrderStore()

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
const isLastStep = computed(() => {
  return currentStep.value === 4
})

// 檢查當前步驟是否可以繼續
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1: // 桌位
      return formData.value.table !== null
    case 2: // 用餐人數
      return formData.value.diners !== null && formData.value.diners > 0
    case 3: // Step3 額外選項（可略過）
      return true
    case 4: // Step4 額外選項（可略過）
      return true
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

const handleSubmit = () => {
  // 保存到 store
  orderStore.setTable({
    orderId: `ORD-${Date.now()}`,
    tableNumber: formData.value.table,
    diners: formData.value.diners,
    status: TABLE_STATUS.OCCUPIED, // 1: 已開桌
    serviceType: 'dine-in', // 所有訂單一律視為內用
    customerInfo: formData.value.customerInfo,
    customerInfo2: formData.value.customerInfo2
  })

  // 導航到主頁面
  router.push('/')
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
            @prev="prevStep"
            @next="nextStep"
            @submit="handleSubmit"
          />
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
