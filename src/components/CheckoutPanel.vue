<script setup>
import { computed } from 'vue'
import { X } from 'lucide-vue-next'
import { getPaymentMethodById } from '../config/paymentMethods'

// 定義 props 和 emits（使用純 JavaScript，避免 TS 解析問題）
const props = defineProps({
  order: {
    type: Object,
    default: () => ({
      tableNumber: '2A桌',
      diners: 5,
      status: '已開桌',
      diningTime: '01:13',
      totalAmount: 17500
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
</script>

    <template>
      <div class="flex h-full flex-col items-center">
        <div class="flex w-full h-full flex-col items-center rounded-2xl shadow-xl overflow-hidden bg-layer-primary">
          <!-- Header 訂單資訊列(桌號、訂單狀態)-->
          <div class="flex w-full h-14 shrink-0 items-start">
            <div class="flex w-24 flex-col justify-center items-center shrink-0 self-stretch bg-layer-dark-primary">
              <div class="text-center font-noto text-xl tracking-[0.2em] leading-tight text-text-on-color" >{{ order.tableNumber }}</div>
            </div>
            <div class="flex justify-center items-center gap-6 flex-1 self-stretch bg-layer-dark-tertiary">
              <div class="flex items-center gap-2">
                <div class="flex w-icon-md h-icon-md justify-center items-center">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.9997 16C14.533 16 13.2775 15.4778 12.233 14.4333C11.1886 13.3889 10.6663 12.1333 10.6663 10.6666C10.6663 9.19998 11.1886 7.94442 12.233 6.89998C13.2775 5.85554 14.533 5.33331 15.9997 5.33331C17.4663 5.33331 18.7219 5.85554 19.7663 6.89998C20.8108 7.94442 21.333 9.19998 21.333 10.6666C21.333 12.1333 20.8108 13.3889 19.7663 14.4333C18.7219 15.4778 17.4663 16 15.9997 16ZM5.33301 24V22.9333C5.33301 22.1778 5.52767 21.4835 5.91701 20.8506C6.30634 20.2178 6.82279 19.7342 7.46634 19.4C8.84412 18.7111 10.2441 18.1946 11.6663 17.8506C13.0886 17.5066 14.533 17.3342 15.9997 17.3333C17.4663 17.3324 18.9108 17.5049 20.333 17.8506C21.7552 18.1964 23.1552 18.7129 24.533 19.4C25.1775 19.7333 25.6943 20.2169 26.0837 20.8506C26.473 21.4844 26.6672 22.1786 26.6663 22.9333V24C26.6663 24.7333 26.4055 25.3613 25.8837 25.884C25.3619 26.4066 24.7339 26.6675 23.9997 26.6666H7.99967C7.26634 26.6666 6.63879 26.4058 6.11701 25.884C5.59523 25.3622 5.3339 24.7342 5.33301 24Z" fill="white"/>
                  </svg>
                </div>
                <div class="text-text-on-color font-inter text-xl font-medium leading-tight">{{ order.diners }}</div>
              </div>
              <div class="flex items-center gap-6">
                <div class="text-text-on-color font-noto text-xl font-normal leading-tight">{{ order.status }}</div>
                <div class="w-18 text-text-on-color text-center font-inter text-xl font-medium leading-tight">{{ order.diningTime }}</div>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div class="flex flex-col items-start self-stretch shrink-0 overflow-hidden">
            <!-- Total -->
            <div class="flex h-18 items-center self-stretch px-4 border-b border-border-primary bg-layer-primary">
              <div class="flex items-start flex-1">
                <div class="w-full text-text-primary font-noto text-xl font-normal leading-tight">總計</div>
              </div>
              <div class="flex justify-end">
                <div class="text-text-amount-positive text-right font-inter text-4xl font-bold leading-tight">{{ totalAmount.toLocaleString() }}</div>
              </div>
            </div>

            <!-- Paid -->
            <div class="flex h-18 items-center self-stretch px-4 border-b border-border-primary bg-layer-primary">
              <div class="flex items-start flex-1">
                <div class="max-w-48 text-text-primary font-noto text-xl font-normal leading-tight">已付</div>
              </div>
              <div class="flex justify-end">
                <div class="text-text-amount-positive text-right font-inter text-4xl font-bold leading-tight">{{ paidAmount.toLocaleString() }}</div>
              </div>
            </div>

            <!-- Unpaid -->
            <div class="flex h-18 items-center self-stretch px-4 border-b border-border-primary bg-layer-highlight-yellow">
              <div class="flex items-start flex-1">
                <div class="max-w-48 text-text-primary font-noto text-xl font-normal leading-tight">未結</div>
              </div>
              <div class="flex justify-end">
                <div class="text-text-amount-negative text-right font-inter text-4xl font-bold leading-tight">{{ unpaidAmount.toLocaleString() }}</div>
              </div>
            </div>

            <!-- Change -->
            <div class="flex h-18 items-center self-stretch px-4 border-b border-border-primary bg-layer-primary">
              <div class="flex items-start flex-1">
                <div class="max-w-48 text-text-primary font-noto text-xl font-normal leading-tight">找零</div>
              </div>
              <div class="flex justify-end">
                <div class="text-text-amount-positive text-right font-inter text-4xl font-bold leading-tight">{{ changeAmount.toLocaleString() }}</div>
              </div>
            </div>
          </div>

          <!-- Payment List -->
          <div class="flex p-3 flex-col items-start gap-2 flex-1 min-h-0 self-stretch bg-layer-tertiary overflow-auto scrollbar-hide">
            <div
              v-for="(payment, index) in payments"
              :key="index"
              class="flex min-h-16 items-center gap-3 self-stretch rounded-sm bg-layer-primary shadow-sm "
            >
              <div
                class="flex w-12 justify-center items-center self-stretch rounded-l-sm"
                :class="getPaymentConfig(payment.type).color"
              >
                <component
                  v-if="getPaymentConfig(payment.type).icon"
                  :is="getPaymentConfig(payment.type).icon"
                  class="w-icon-md h-icon-md text-text-on-color"
                />
              </div>
              <div class="flex items-center flex-1">
                <div class="max-w-32 text-text-primary font-noto text-lg font-normal leading-tight">
                  {{ getPaymentConfig(payment.type).displayLabel }}
                </div>
              </div>
              <div class="flex justify-end items-center gap-1">
                <div class="text-text-amount-positive text-right font-inter text-2xl font-semibold leading-tight">
                  {{ payment.amount.toLocaleString() }}
                </div>
              </div>
              <div class="flex items-center self-stretch">
                <button
                  @click="removePayment(index)"
                  class="flex w-16 h-full justify-center items-center bg-button-highlight-red hover:bg-button-highlight-red-hover transition-colors group rounded-r-sm"
                  >
                  <X class="w-icon-lg h-icon-lg text-text-disabled" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
