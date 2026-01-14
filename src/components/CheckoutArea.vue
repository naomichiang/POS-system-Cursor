<script setup>
import { ref, computed, onUnmounted } from 'vue'
import {
  Delete,
  DollarSign,
  BadgeCheck,
} from 'lucide-vue-next'
import { paymentMethodsConfig } from '../config/paymentMethods'
import BaseModal from './BaseModal.vue'

// Props：來自父層的訂單與付款資訊
const props = defineProps({
  order: {
    type: Object,
    default: () => ({
      tableNumber: '2A桌',
      diners: 5,
      status: '已開桌',
      diningTime: '01:13',
      totalAmount: 5250,
    }),
  },
  payments: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['add-payment', 'checkout-success'])

// 定義鍵盤佈局
const numpadRows = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['C', '0', 'backspace'],
]

const inputValue = ref('0')

// 使用配置化的付款方式列表，並確保圖標組件正確映射
// 直接使用配置中的 icon，因為它們是從 lucide-vue-next 導入的組件
const paymentMethods = paymentMethodsConfig

// 從配置中提取所有付款方式 id 作為類型
const selectedPayment = ref(null)

// 顯示用千分位格式
const formattedAmount = computed(() => {
  const numeric = inputValue.value.replace(/[^\d]/g, '')
  const n = Number(numeric || '0')
  return n.toLocaleString('en-US')
})

// 依據訂單與付款計算金額
const totalAmount = computed(() => props.order?.totalAmount || 0)

const paidAmount = computed(() => {
  return props.payments.reduce((sum, payment) => sum + payment.amount, 0)
})

const unpaidAmount = computed(() => {
  const diff = totalAmount.value - paidAmount.value
  return diff > 0 ? diff : 0
})

const changeAmount = computed(() => {
  return paidAmount.value > totalAmount.value
    ? paidAmount.value - totalAmount.value
    : 0
})

// 彈窗狀態
const showModal = ref(false)
// 'unpaid' | 'change' | 'success' | null
const modalType = ref(null)
let autoCloseTimer = null

const modalTitle = computed(() => {
  if (modalType.value === 'unpaid') return '餘額未結清'
  if (modalType.value === 'change') return '提醒找零'
  if (modalType.value === 'success') return '成功完成結帳'
  return ''
})

const modalMessage = computed(() => {
  if (modalType.value === 'unpaid') {
    return '餘額未結清'
  }
  if (modalType.value === 'change') {
    return `現金找零 ${changeAmount.value.toLocaleString()} 元`
  }
  return ''
})

const closeModal = () => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
    autoCloseTimer = null
  }
  showModal.value = false
  modalType.value = null
}

const handleCompleteChange = () => {
  // 結束結帳確認流程（此處先以 log 代表，可依需求補上清單重置／跳畫面等）
  console.log('結帳完成，找零已確認', {
    totalAmount: totalAmount.value,
    paidAmount: paidAmount.value,
    changeAmount: changeAmount.value,
  })
  showModal.value = false
  modalType.value = null
}

const handleNumberClick = (num) => {
  if (inputValue.value === '0') {
    inputValue.value = num
  } else {
    inputValue.value += num
  }
}

const handleClear = () => {
  inputValue.value = '0'
}

const handleBackspace = () => {
  if (inputValue.value.length > 1) {
    inputValue.value = inputValue.value.slice(0, -1)
  } else {
    inputValue.value = '0'
  }
}

// 處理付款方式選擇
const handlePayment = (paymentId) => {
  selectedPayment.value = paymentId
  // 發送付款金額到父組件
  const amount = Number(inputValue.value.replace(/[^\d]/g, '') || '0')
  if (amount > 0) {
    emit('add-payment', { type: paymentId, amount })
  }
  inputValue.value = '0'
}

// 完成結帳：依未結與找零判斷彈窗
const handleCompleteCheckout = () => {
  if (unpaidAmount.value > 0) {
    modalType.value = 'unpaid'
    showModal.value = true
    return
  }

  if (changeAmount.value > 0) {
    modalType.value = 'change'
    showModal.value = true
    return
  }

  // 無未結且無找零，顯示成功燈箱
  modalType.value = 'success'
  showModal.value = true

  // 3 秒後自動關閉並觸發成功事件
  autoCloseTimer = setTimeout(() => {
    closeModal()
    emit('checkout-success')
  }, 3000)
}

// 組件卸載時清除計時器
onUnmounted(() => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
    autoCloseTimer = null
  }
})
</script>

<template>
  <div
    class="flex flex-col justify-center items-start flex-1 self-stretch rounded-2xl bg-layer-secondary overflow-hidden"
  >
    <div class="flex items-start flex-1 self-stretch">
      <!-- Input & Numpad -->
      <div
        class="flex flex-col items-center flex-1 self-stretch border-r border-border-primary overflow-hidden"
      >
        <!-- Input Display -->
        <div
          class="flex h-8-16 px-10 justify-end items-center gap-2 self-stretch border-b-2 border-border-primary bg-layer-primary"
        >
          <div class="flex pt-0.5 items-center  self-stretch">
            <div class="flex w-icon-lg h-icon-lg justify-center items-center">
              <DollarSign class="w-icon-xl h-icon-xl text-yellow-500" />
            </div>
          </div>
          <div
            class="text-text-amount-positive text-right font-inter text-[56px] font-semibold leading-[120%]"
          >
            {{ formattedAmount }}
          </div>
        </div>

        <!-- Numpad -->
        <div class="flex flex-col items-start flex-1 self-stretch">
          <!-- 使用 v-for 循環生成所有按鍵行 -->
          <div
            v-for="(row, rowIndex) in numpadRows"
            :key="rowIndex"
            class="flex items-center flex-1 self-stretch"
          >
            <button
              v-for="key in row"
              :key="key"
              @click="key === 'C' ? handleClear() : key === 'backspace' ? handleBackspace() : handleNumberClick(key)"
              :class="[
                'flex flex-col justify-center items-center flex-1 self-stretch transition-all',
                'bg-layer-secondary hover:bg-layer-secondary-hover active:bg-layer-secondary-hover active:scale-98 ',
                'border-border-primary',
                // 處理邊框，避免重複疊加：最後一行不加底邊框，每行最後一個按鍵不加右邊框
                rowIndex !== 3 ? 'border-b-2' : '',
                key !== row[row.length - 1] ? 'border-r-2' : ''
              ]"
            >
              <template v-if="key === 'backspace'">
                <Delete class="w-icon-lg h-icon-lg text-text-disabled" />
              </template>
              <div
                v-else
                :class="[
                  'self-stretch text-center font-inter text-3xl font-semibold leading-[120%]',
                  key === 'C' ? 'text-text-disabled' : 'text-ash-700'
                ]"
              >
                {{ key }}
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="flex flex-col items-start self-stretch">
        <div
          class="flex flex-col items-start gap-px flex-1 self-stretch overflow-hidden"
        >
          <button
            v-for="method in paymentMethods"
            :key="method.id"
            @click="handlePayment(method.id)"
            :class="[
              'flex w-btn-lg h-btn-h-lg min-w-[100px] max-w-btn-xl px-4 justify-center items-center transition-colors',
              method.paddingClass,
              'bg-button-primary hover:bg-button-primary-hover',
              'active:bg-button-primary-hover active:scale-[0.98]'
            ]"
          >
            <!-- Icon (動態渲染，根據配置決定是否顯示) -->
            <div
              v-if="method.hasIcon && method.icon"
              class="flex w-icon-md h-icon-md justify-center items-center shrink-0"
            >
              <component
                :is="method.icon"
                class="w-icon-md h-icon-md text-text-on-color"
              />
            </div>

            <!-- Label -->
            <div
              class="text-text-on-color text-center font-noto text-lg font-medium leading-[120%]"
            >
              {{ method.label }}
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Actions -->
    <div
      class="flex p-4 items-start gap-4 self-stretch border-t border-border-primary"
    >
      <button
        class="shrink-0 flex w-btn-md h-btn-h-md min-w-btn-sm px-4 justify-center items-center gap-2 rounded-2xl bg-button-primary active:bg-button-primary-hover transition-colors">
        <div
          class="shrink-0 text-text-on-color text-center font-noto text-2xl font-medium leading-[128%] tracking-[0.05em]">
          發票
        </div>
      </button>
      <div class="flex h-btn-h-md justify-end items-center gap-4 flex-1">
        <button
          class="flex w-btn-md h-full justify-center items-center rounded-2xl bg-button-primary active:bg-button-primary-hover transition-colors">
          <div class="shrink-0 text-text-on-color text-center font-noto text-2xl font-medium leading-[128%] tracking-[0.05em]">
            暫存
          </div>
        </button>
        <button
          class="flex w-btn-lg h-full min-w-btn-md px-4 justify-center items-center rounded-2xl bg-button-danger active:bg-button-danger-hover transition-colors"
          @click="handleCompleteCheckout">
          <div class="shrink-0 text-text-on-color text-center font-noto text-2xl font-medium leading-[128%] tracking-[0.05em]">
            完成結帳
          </div>
        </button>
      </div>
    </div>

    <!-- 共用燈箱 BaseModal：白底圓角 + 燈箱；點彈窗外無作用 -->
    <BaseModal
      :open="showModal"
      :title="modalTitle"
      :content="''"
      :show-close="false"
      :header-icon="modalType === 'success' ? BadgeCheck : null"
      :header-icon-color-class="modalType === 'success' ? 'text-text-success' : 'text-text-secondary'"
      :primary-button-text="modalType === 'change' ? '返回' : ''"
      :secondary-button-text="modalType === 'success' ? '關閉' : ''"
      :danger-button-text="modalType === 'change' ? '完成找零' : modalType === 'unpaid' ? '返回結帳' : ''"
      @close="closeModal"
      @secondary="closeModal"
      @primary="closeModal"
      @danger="modalType === 'change' ? handleCompleteChange() : closeModal()"
    >
      <!-- 僅在「提醒找零」時，客製內文樣式 -->
      <template v-if="modalType === 'change'">
        <p class="text-text-primary font-noto text-md font-medium leading-relaxed text-center">
          現金找零
          <span
            class="ml-1 font-inter font-semibold text-3xl text-text-amount-negative"
          >
          $ {{ changeAmount.toLocaleString() }}
          </span>
        </p>
      </template>
    </BaseModal>
  </div>
</template>
