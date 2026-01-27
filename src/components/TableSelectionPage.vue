<script setup>
import { ref, computed, watch } from 'vue'
import { useOrderStore } from '../stores/useOrderStore'
import { useRouter } from 'vue-router'
import { ArrowLeft, ArrowRight, Check } from 'lucide-vue-next'
import { TABLE_STATUS } from '../config/tableStatus'
import { DEFAULT_DINER_PICKER_CONFIG } from '../config/dinerPickerConfig'
import Step1_Table from './steps/Step1_Table.vue'
import Step2_DinersCount from './steps/Step2_DinersCount.vue'
import Step3_CustomerInfo from './steps/Step3_CustomerInfo.vue'
import Step4_PlanDetail from './steps/Step4_PlanDetail.vue'

const router = useRouter()
const orderStore = useOrderStore()

const currentStep = ref(1) // 預設顯示步驟 1（桌位）

// 用餐人數 picker 設定（由後端提供，決定顯示幾個 picker；目前使用預設，對接 API 後可依桌位等參數取得）
const pickerConfigs = ref(DEFAULT_DINER_PICKER_CONFIG)

// 表單資料
const formData = ref({
  serviceType: 'dine-in', // 所有訂單一律視為內用
  table: null,
  diners: null,
  customerInfo: {
    name: '',
    phone: '',
    email: '',
    notes: ''
  },
  mealPlan: null
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
    case 3: // 顧客基本資料
      // 可以略過，所以只要有值或為空都可以繼續
      return true
    case 4: // 用餐方案
      return formData.value.mealPlan !== null
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
    mealPlan: formData.value.mealPlan
  })

  // 導航到主頁面
  router.push('/')
}
</script>

<template>
  <div class="flex flex-col w-full h-full bg-layer-secondary font-noto">
    <!-- 主要內容區域 -->
    <div class="flex-1 overflow-hidden p-4 gap-4 bg-app-bg flex">
      <!-- 步驟 1: 桌位 -->
      <Step1_Table
        v-if="currentStep === 1"
        v-model="formData.table"
        @next="nextStep"
      />
      <!-- 步驟 2: 用餐人數 -->
      <div v-if="currentStep === 2">
        <Step2_DinersCount
          v-model="formData.diners"
          :table-id="formData.table"
          :picker-configs="pickerConfigs"
          @next="nextStep"
        />
      </div>

      <!-- 步驟 3: 顧客基本資料 -->
      <div v-if="currentStep === 3" class="flex-1 bg-white rounded-2xl shadow-sm overflow-y-auto p-8">
        <Step3_CustomerInfo
          v-model="formData.customerInfo"
        />
      </div>

      <!-- 步驟 4: 用餐方案 -->
      <div v-if="currentStep === 4" class="flex-1 bg-white rounded-2xl shadow-sm overflow-y-auto p-8">
        <Step4_PlanDetail
          v-model="formData.mealPlan"
        />
      </div>
    </div>

    <!-- 底部按鈕（步驟 1 時不顯示） -->
    <div
      v-if="currentStep !== 1"
      class="flex items-center justify-between p-4 gap-4 bg-layer-secondary border-t border-border-primary"
    >
      <button
        @click="prevStep"
        :disabled="isFirstStep"
        :class="[
          'flex w-btn-md h-btn-h-md min-w-btn-sm px-4 justify-center items-center gap-2 rounded-2xl transition-colors',
          isFirstStep
            ? 'bg-button-primary-disabled text-text-disabled cursor-not-allowed'
            : 'bg-button-primary hover:bg-button-primary-hover active:bg-button-primary-hover text-text-on-color'
        ]"
      >
        <ArrowLeft class="w-icon-md h-icon-md" />
        <div class="text-center font-noto text-2xl font-medium leading-[128%] tracking-[0.05em]">
          上一步
        </div>
      </button>

      <button
        v-if="!isLastStep"
        @click="nextStep"
        :disabled="!canProceed"
        :class="[
          'flex w-btn-lg h-btn-h-md min-w-btn-md px-4 justify-center items-center gap-2 rounded-2xl transition-colors',
          canProceed
            ? 'bg-button-primary hover:bg-button-primary-hover active:bg-button-primary-hover text-text-on-color'
            : 'bg-button-primary-disabled text-text-disabled cursor-not-allowed'
        ]"
      >
        <div class="text-center font-noto text-2xl font-medium leading-[128%] tracking-[0.05em]">
          下一步
        </div>
        <ArrowRight class="w-icon-md h-icon-md" />
      </button>

      <button
        v-else
        @click="handleSubmit"
        :disabled="!canProceed"
        :class="[
          'flex w-btn-lg h-btn-h-md min-w-btn-md px-4 justify-center items-center gap-2 rounded-2xl transition-colors',
          canProceed
            ? 'bg-button-danger hover:bg-button-danger-hover active:bg-button-danger-hover text-text-on-color'
            : 'bg-button-primary-disabled text-text-disabled cursor-not-allowed'
        ]"
      >
        <Check class="w-icon-md h-icon-md" />
        <div class="text-center font-noto text-2xl font-medium leading-[128%] tracking-[0.05em]">
          確認開桌
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 自訂樣式 */
</style>
