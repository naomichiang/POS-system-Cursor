<script setup>
import { computed } from 'vue'
import { X } from 'lucide-vue-next'
import { getPaymentMethodById } from '../../config/paymentMethods'
import { TABLE_STATUS, getStatusLabel } from '../../config/tableStatus'

// 定義 props 和 emits（使用純 JavaScript，避免 TS 解析問題）
const props = defineProps({
  order: {
    type: Object,
    default: () => ({
      tableNumber: '2A桌',
      diners: 5,
      status: TABLE_STATUS.OCCUPIED, // 1: 已開桌
      diningTime: '01:13',
      totalAmount: 10520
    }),
  },
  payments: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['remove-payment'])

// 計算總計金額
const totalAmount = computed(() => props.order.totalAmount || 0)

// 計算已付金額
const paidAmount = computed(() => {
  return props.payments.reduce((sum, payment) => sum + payment.amount, 0)
})

// 計算未結金額
const unpaidAmount = computed(() => {
  return totalAmount.value - paidAmount.value
})

// 計算找零金額
const changeAmount = computed(() => {
  return paidAmount.value > totalAmount.value ? paidAmount.value - totalAmount.value : 0
})

const removePayment = (index) => {
  emit('remove-payment', index)
}

// 根據付款類型獲取配置（使用共享配置）
const getPaymentConfig = (type) => {
  return getPaymentMethodById(type) || { displayLabel: type, icon: null, color: 'bg-gray-500' }
}

// 根據訂單狀態回傳對應的底色 class（直接使用 main.css 中定義的訂單狀態顏色變數）
const statusBgClass = computed(() => {
  const status = props.order?.status

  const map = {
    [TABLE_STATUS.AVAILABLE]: 'bg-ordstatus-0-primary',   // 0: 未開桌
    [TABLE_STATUS.OCCUPIED]: 'bg-ordstatus-1-primary',   // 1: 已開桌
    [TABLE_STATUS.WARNING]: 'bg-ordstatus-2-primary',    // 2: 提醒桌
    [TABLE_STATUS.OVERTIME]: 'bg-ordstatus-3-primary',   // 3: 超時桌
    [TABLE_STATUS.CHECKED_OUT]: 'bg-ordstatus-4-primary', // 4: 已結帳
    [TABLE_STATUS.CLEANING]: 'bg-ordstatus-5-primary',   // 5: 待清潔桌
    [TABLE_STATUS.RESERVED]: 'bg-ordstatus-9-primary',   // 9: 預定桌
  }

  return map[status] || 'bg-layer-dark-tertiary'
})

// 獲取狀態顯示文字
const statusLabel = computed(() => {
  const status = props.order?.status
  if (typeof status === 'number') {
    return getStatusLabel(status)
  }
  return status || '未知狀態'
})
</script>

    <template>
      <div class="flex h-full flex-col items-center">
        <div class="flex w-full h-full flex-col items-center rounded-2xl shadow-xl overflow-hidden bg-layer-primary">
          <!-- Header 訂單資訊列(桌號、訂單狀態)-->
          <div class="flex w-full h-12 shrink-0 items-start">
            <div class="flex w-22 flex-col justify-center items-center shrink-0 self-stretch bg-layer-dark-primary">
              <div class="text-center font-noto pl-1 text-lg tracking-[0.2em] leading-tight text-text-on-color" >{{ order.tableNumber }}</div>
            </div>
            <div class="flex justify-center items-center gap-4 flex-1 self-stretch" :class="statusBgClass">
              <div class="flex items-center gap-1">
                <div class="flex w-icon-md h-icon-md justify-center items-center">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.9997 16C14.533 16 13.2775 15.4778 12.233 14.4333C11.1886 13.3889 10.6663 12.1333 10.6663 10.6666C10.6663 9.19998 11.1886 7.94442 12.233 6.89998C13.2775 5.85554 14.533 5.33331 15.9997 5.33331C17.4663 5.33331 18.7219 5.85554 19.7663 6.89998C20.8108 7.94442 21.333 9.19998 21.333 10.6666C21.333 12.1333 20.8108 13.3889 19.7663 14.4333C18.7219 15.4778 17.4663 16 15.9997 16ZM5.33301 24V22.9333C5.33301 22.1778 5.52767 21.4835 5.91701 20.8506C6.30634 20.2178 6.82279 19.7342 7.46634 19.4C8.84412 18.7111 10.2441 18.1946 11.6663 17.8506C13.0886 17.5066 14.533 17.3342 15.9997 17.3333C17.4663 17.3324 18.9108 17.5049 20.333 17.8506C21.7552 18.1964 23.1552 18.7129 24.533 19.4C25.1775 19.7333 25.6943 20.2169 26.0837 20.8506C26.473 21.4844 26.6672 22.1786 26.6663 22.9333V24C26.6663 24.7333 26.4055 25.3613 25.8837 25.884C25.3619 26.4066 24.7339 26.6675 23.9997 26.6666H7.99967C7.26634 26.6666 6.63879 26.4058 6.11701 25.884C5.59523 25.3622 5.3339 24.7342 5.33301 24Z" fill="white"/>
                  </svg>
                </div>
                <div class="text-text-on-color font-inter text-lg font-medium leading-tight">{{ order.diners }}</div>
              </div>
              <div class="flex items-center gap-3">
                <div class="text-text-on-color font-noto text-lg font-normal leading-tight">{{ statusLabel }}</div>
                <div class="w-18 text-text-on-color text-center font-inter text-lg font-medium leading-tight">{{ order.diningTime }}</div>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div class="flex flex-col items-start self-stretch shrink-0 overflow-hidden">
            <!-- Total -->
            <div class="flex h-16 items-center self-stretch px-4 border-b border-border-primary bg-layer-primary">
              <div class="flex items-start flex-1">
                <div class="w-full text-text-primary font-noto text-xl font-normal leading-tight">總計</div>
              </div>
              <div class="flex justify-end">
                <div class="text-text-amount-positive text-right font-inter text-3xl font-bold leading-tight">{{ totalAmount.toLocaleString() }}</div>
              </div>
            </div>

            <!-- Paid -->
            <div class="flex h-16 items-center self-stretch px-4 border-b border-border-primary bg-layer-primary">
              <div class="flex items-start flex-1">
                <div class="max-w-48 text-text-primary font-noto text-xl font-normal leading-tight">已付</div>
              </div>
              <div class="flex justify-end">
                <div class="text-text-amount-positive text-right font-inter text-3xl font-bold leading-tight">{{ paidAmount.toLocaleString() }}</div>
              </div>
            </div>

            <!-- Unpaid -->
            <div class="flex h-16 items-center self-stretch px-4 border-b border-border-primary bg-layer-highlight-yellow">
              <div class="flex items-start flex-1">
                <div class="max-w-48 text-text-primary font-noto text-xl font-normal leading-tight">未結</div>
              </div>
              <div class="flex justify-end">
                <div class="text-text-amount-negative text-right font-inter text-3xl font-bold leading-tight">{{ Math.max(0, unpaidAmount).toLocaleString() }}</div>
              </div>
            </div>

            <!-- Change -->
            <div
              class="flex h-16 items-center self-stretch px-4 border-b border-border-primary"
              :class="changeAmount > 0 ? 'bg-layer-highlight-red' : 'bg-layer-primary'"
            >
              <div class="flex items-start flex-1">
                <div class="max-w-48 text-text-primary font-noto text-xl font-normal leading-tight">找零</div>
              </div>
              <div class="flex justify-end">
                <div
                  class="text-right font-inter text-3xl font-bold leading-tight"
                  :class="changeAmount > 0 ? 'text-text-amount-negative' : 'text-text-amount-positive'"
                >
                  {{ changeAmount.toLocaleString() }}
                </div>
              </div>
            </div>
          </div>

          <!-- Payment List -->
          <div class="flex p-2 flex-col items-start gap-2 flex-1 min-h-0 self-stretch bg-layer-tertiary overflow-auto scrollbar-hide">
            <div
              v-for="(payment, index) in payments"
              :key="index"
              class="flex min-h-16 items-center gap-3 self-stretch rounded-md bg-layer-primary shadow-sm "
            >
              <div
                class="flex w-10 justify-center items-center self-stretch rounded-l-md"
                :class="getPaymentConfig(payment.type).color"
              >
                <component
                  v-if="getPaymentConfig(payment.type).icon"
                  :is="getPaymentConfig(payment.type).icon"
                  class="w-icon-lg h-icon-lg text-text-on-color"
                />
              </div>
              <div class="flex items-center flex-1">
                <div class="max-w-32 text-text-primary font-noto text-lg font-normal leading-tight">
                  {{ getPaymentConfig(payment.type).displayLabel }}
                </div>
              </div>
              <div class="flex justify-end items-center gap-1">
                <div class="text-text-amount-positive text-right font-inter text-xl font-bold tracking-[-0.02em] leading-tight">
                  {{ payment.amount.toLocaleString() }}
                </div>
              </div>
              <div class="flex items-center self-stretch">
                <button
                  @click="removePayment(index)"
                  class="flex w-16 h-full justify-center items-center bg-button-highlight-red hover:bg-button-highlight-red-hover active:bg-button-highlight-red-hover transition-colors group rounded-r-md"
                  >
                  <X class="w-icon-lg h-icon-lg text-text-disabled" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

