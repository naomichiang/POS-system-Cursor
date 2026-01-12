<script setup>
import { computed } from 'vue'
import { Banknote, CreditCard, Smartphone, Ticket, X } from 'lucide-vue-next'

// 定義 props 和 emits（使用純 JavaScript，避免 TS 解析問題）
const props = defineProps({
  payments: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['remove-payment'])

// 計算總計金額 (假設總計為 17500)
const totalAmount = 17500

// 計算已付金額
const paidAmount = computed(() => {
  return props.payments.reduce((sum, payment) => sum + payment.amount, 0)
})

// 計算未結金額
const unpaidAmount = computed(() => {
  return totalAmount - paidAmount.value
})

// 計算找零金額
const changeAmount = computed(() => {
  return paidAmount.value > totalAmount ? paidAmount.value - totalAmount : 0
})

const removePayment = (index) => {
  emit('remove-payment', index)
}

// 根據付款類型獲取顯示名稱
const getPaymentLabel = (type) => {
  const labels = {
    cash: '現金',
    credit: '信用卡',
    mobile: '電子支付',
    gift: 'SOGO 現金券',
  }
  return labels[type] || type
}
</script>

    <template>
      <div class="flex h-[938px] flex-col justify-center items-center">
        <div class="flex w-[440px] flex-col items-center flex-1 rounded-2xl shadow-lg overflow-hidden">
          <!-- Header -->
          <div class="flex w-[440px] h-[72px] items-start">
            <div class="flex w-[160px] px-6 flex-col justify-center items-center shrink-0 self-stretch bg-ash-900">
              <div class="text-white text-center font-noto text-[22px] font-normal leading-[120%]">2Ａ桌</div>
            </div>
            <div class="flex justify-center items-center gap-6 flex-1 self-stretch bg-ash-700">
              <div class="flex items-center gap-1">
                <div class="flex w-8 h-8 justify-center items-center">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.9997 16C14.533 16 13.2775 15.4778 12.233 14.4333C11.1886 13.3889 10.6663 12.1333 10.6663 10.6666C10.6663 9.19998 11.1886 7.94442 12.233 6.89998C13.2775 5.85554 14.533 5.33331 15.9997 5.33331C17.4663 5.33331 18.7219 5.85554 19.7663 6.89998C20.8108 7.94442 21.333 9.19998 21.333 10.6666C21.333 12.1333 20.8108 13.3889 19.7663 14.4333C18.7219 15.4778 17.4663 16 15.9997 16ZM5.33301 24V22.9333C5.33301 22.1778 5.52767 21.4835 5.91701 20.8506C6.30634 20.2178 6.82279 19.7342 7.46634 19.4C8.84412 18.7111 10.2441 18.1946 11.6663 17.8506C13.0886 17.5066 14.533 17.3342 15.9997 17.3333C17.4663 17.3324 18.9108 17.5049 20.333 17.8506C21.7552 18.1964 23.1552 18.7129 24.533 19.4C25.1775 19.7333 25.6943 20.2169 26.0837 20.8506C26.473 21.4844 26.6672 22.1786 26.6663 22.9333V24C26.6663 24.7333 26.4055 25.3613 25.8837 25.884C25.3619 26.4066 24.7339 26.6675 23.9997 26.6666H7.99967C7.26634 26.6666 6.63879 26.4058 6.11701 25.884C5.59523 25.3622 5.3339 24.7342 5.33301 24Z" fill="white"/>
                  </svg>
                </div>
                <div class="text-white font-inter text-[22px] font-medium leading-[120%]">5</div>
              </div>
              <div class="flex items-center gap-6">
                <div class="text-white font-noto text-[22px] font-normal leading-[120%]">已開桌</div>
                <div class="w-[72px] text-white text-center font-inter text-[22px] font-medium leading-[120%]">01:13</div>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div class="flex flex-col items-start self-stretch overflow-hidden">
            <!-- Total -->
            <div class="flex min-h-[90px] px-6 items-center self-stretch border-b border-ash-200 bg-white">
              <div class="flex items-start flex-1">
                <div class="max-w-[192px] text-gray-700 font-noto text-[22px] font-normal leading-[120%]">總計</div>
              </div>
              <div class="flex pl-6 justify-end items-start gap-1">
                <div class="text-ash-800 text-right font-inter text-[40px] font-semibold leading-[120%]">17,500</div>
              </div>
            </div>

            <!-- Paid -->
            <div class="flex min-h-[90px] px-6 items-center self-stretch border-b border-ash-200 bg-white">
              <div class="flex items-start flex-1">
                <div class="max-w-[192px] text-gray-700 font-noto text-[22px] font-normal leading-[120%]">已付</div>
              </div>
              <div class="flex pl-6 justify-end items-start gap-1">
                <div class="text-ash-800 text-right font-inter text-[40px] font-semibold leading-[120%]">{{ paidAmount.toLocaleString() }}</div>
              </div>
            </div>

            <!-- Unpaid -->
            <div class="flex min-h-[90px] px-6 items-center self-stretch border-b border-ash-200 bg-[#FFF5E2]">
              <div class="flex items-start flex-1">
                <div class="max-w-[192px] text-gray-700 font-noto text-[22px] font-normal leading-[120%]">未結</div>
              </div>
              <div class="flex pl-6 justify-end items-start gap-1">
                <div class="text-indianred-600 text-right font-inter text-[40px] font-semibold leading-[120%]">{{ unpaidAmount.toLocaleString() }}</div>
              </div>
            </div>

            <!-- Change -->
            <div class="flex min-h-[90px] px-6 items-center self-stretch border-b border-ash-200 bg-white">
              <div class="flex items-start flex-1">
                <div class="max-w-[192px] text-gray-700 font-noto text-[22px] font-normal leading-[120%]">找零</div>
              </div>
              <div class="flex pl-6 justify-end items-start gap-1">
                <div class="text-ash-800 text-right font-inter text-[40px] font-semibold leading-[120%]">{{ changeAmount.toLocaleString() }}</div>
              </div>
            </div>
          </div>

          <!-- Payment List -->
          <div class="flex p-4 flex-col items-start gap-2 flex-1 self-stretch bg-ash-200 overflow-auto">
            <div
              v-for="(payment, index) in payments"
              :key="index"
              class="flex h-[90px] min-h-[72px] items-center gap-6 self-stretch rounded-2xl bg-white"
            >
              <div
                class="flex w-[60px] justify-center items-center self-stretch"
                :class="payment.type === 'cash' ? 'bg-yellow-400' : payment.type === 'credit' ? 'bg-green-500' : payment.type === 'mobile' ? 'bg-blue-500' : 'bg-purple-500'"
              >
                <div class="flex w-8 h-8 justify-center items-center shrink-0">
                  <Banknote
                    v-if="payment.type === 'cash'"
                    class="w-8 h-8 text-white"
                  />
                  <CreditCard
                    v-else-if="payment.type === 'credit'"
                    class="w-8 h-8 text-white"
                  />
                  <Smartphone
                    v-else-if="payment.type === 'mobile'"
                    class="w-8 h-8 text-white"
                  />
                  <Ticket
                    v-else
                    class="w-8 h-8 text-white"
                  />
                </div>
              </div>
              <div class="flex items-start flex-1">
                <div class="max-w-[128px] text-gray-700 font-noto text-[22px] font-normal leading-[120%]">
                  {{ getPaymentLabel(payment.type) }}
                </div>
              </div>
              <div class="flex justify-end items-start gap-1">
                <div class="text-gray-700 text-right font-inter text-[28px] font-medium leading-[120%]">
                  {{ payment.amount.toLocaleString() }}
                </div>
              </div>
              <div class="flex items-center self-stretch">
                <button
                  @click="removePayment(index)"
                  class="flex w-[90px] flex-col justify-center items-center self-stretch aspect-square bg-indianred-100 hover:bg-indianred-600 transition-colors group"
                >
                  <X class="w-8 h-8 text-[#92A7C0] group-hover:text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
