<script setup>
import { ref, computed, onUnmounted } from 'vue'
import {
  Delete,
  DollarSign,
  BadgeCheck,
} from 'lucide-vue-next'
import { paymentMethodsConfig } from '../../config/paymentMethods'
import { TABLE_STATUS } from '../../config/tableStatus'
import BaseModal from '../common/BaseModal.vue'
import { useOrderStore } from '@/stores/useOrderStore'

// 引入 Store
const orderStore = useOrderStore()

// Props：來自父層的訂單與付款資訊（保留以維持向後兼容）
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  order: {
    type: Object,
    default: () => ({
      tableNumber: '2A桌',
      diners: 5,
      status: TABLE_STATUS.OCCUPIED, // 1: 已開桌
      diningTime: '01:13',
      totalAmount: 5250,
    }),
  },
  payments: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['add-payment', 'confirm-checkout-success'])

// 定義鍵盤佈局
const numpadRows = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['C', '0', 'backspace'],
]

const inputValue = ref('0')

const paymentMethods = paymentMethodsConfig

// 從配置中提取所有付款方式 id 作為類型
const selectedPayment = ref(null)

// 顯示用千分位格式
const formattedAmount = computed(() => {
  const numeric = inputValue.value.replace(/[^\d]/g, '')
  const n = Number(numeric || '0')
  return n.toLocaleString('en-US')
})

// 從 Store 讀取金額資料
const totalAmount = computed(() => orderStore.totalAmount)

const unpaidAmount = computed(() => {
  const diff = orderStore.totalAmount - orderStore.payment.receivedAmount
  return diff > 0 ? diff : 0
})

const changeAmount = computed(() => orderStore.changeAmount)

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

const closeModal = () => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
    autoCloseTimer = null
  }
  showModal.value = false
  modalType.value = null
}

const handleCompleteChange = async () => {
  // 1. 執行上傳（這裡建議包成 async）
  try {
    // 假設你在 Store 寫好了傳送邏輯
    // await orderStore.finalizeOrder()

    console.log('結帳完成，訂單已同步至後端', {
      totalAmount: totalAmount.value,
      receivedAmount: orderStore.payment.receivedAmount,
      changeAmount: changeAmount.value,
    })

    // 2. 顯示成功狀態（如果有 success 燈箱）
    modalType.value = 'success'
    showModal.value = true

    // 3. 延遲後執行重置與跳轉
    setTimeout(() => {
      closeModal()
      orderStore.resetOrder() // <-- 這一行最重要，確保下一單是空的
      emit('confirm-checkout-success') // 通知父組件跳轉至桌次頁
    }, 2000)

  } catch (error) {
    console.error('訂單上傳失敗，請檢查網路', error)
    alert('訂單上傳失敗，請檢查網路')
  }
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

// 完成確認結帳：依未結與找零判斷彈窗
const handleCompleteConfirmCheckout = () => {
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
    emit('confirm-checkout-success')
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
      <div class="flex flex-col items-start self-stretch bg-layer-tertiary">
        <div
          class="flex flex-col items-start gap-px flex-1 self-stretch overflow-hidden"
        >
          <button
            v-for="method in paymentMethods"
            :key="method.id"
            @click="handlePayment(method.id)"
            :class="[
              'flex w-btn-lg h-[88px] min-w-[100px] max-w-btn-xl px-4 justify-center items-center transition-colors',
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
      class="flex h-24 w-full p-3 items-start gap-3 self-stretch border-t border-border-primary"
    >
      <button
        class="shrink-0 flex w-btn-md h-full min-w-btn-sm px-4 justify-center items-center gap-2 rounded-2xl bg-button-primary active:bg-button-primary-hover transition-colors">
        <div
          class="shrink-0 text-text-on-color text-center font-noto text-2xl font-medium leading-[128%] tracking-[0.05em]">
          發票
        </div>
      </button>
      <div class="flex h-full justify-end items-center gap-3 flex-1">
        <button
          class="flex w-btn-md h-full justify-center items-center rounded-2xl bg-button-primary active:bg-button-primary-hover transition-colors">
          <div class="shrink-0 text-text-on-color text-center font-noto text-2xl font-medium leading-[128%] tracking-[0.05em]">
            暫存
          </div>
        </button>
        <button
          class="flex w-btn-lg h-full min-w-btn-md px-4 justify-center items-center rounded-2xl bg-button-danger active:bg-button-danger-hover transition-colors"
          @click="handleCompleteConfirmCheckout">
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
