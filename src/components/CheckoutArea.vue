<script setup lang="ts">
import { ref, computed } from 'vue'
// 1. 引入 Lucide 圖示
import {
  Banknote,    // 現金
  CreditCard,  // 信用卡
  Smartphone,  // 電子支付
  Ticket,      // 禮券
  Delete,      // 退格鍵
  Eraser,      // 清除鍵 (C)
  CircleDollarSign, // 金額顯示圖示
  Calculator // 計算機圖示
} from 'lucide-vue-next'

// 定義鍵盤佈局
const numpadRows = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['C', '0', 'backspace']
]

const emit = defineEmits<{
  'add-payment': [payment: { type: 'cash' | 'credit' | 'mobile' | 'gift', amount: number }]
}>()

const inputValue = ref('500')

// 付款方式列表

// 1. 「白名單」
type PaymentId = 'cash' | 'credit' | 'mobile' | 'gift';

// 2. 讓陣列明確知道它的 id 必須符合這份名單
const paymentMethods: { id: PaymentId; label: string }[] = [
  { id: 'cash', label: '現 金' },
  { id: 'credit', label: '信 用 卡' },
  { id: 'mobile', label: '電子支付' },
  { id: 'gift', label: 'SOGO 現金券' }
]
const selectedPayment = ref<PaymentId | null>(null)

// 顯示用千分位格式
const formattedAmount = computed(() => {
  const numeric = inputValue.value.replace(/[^\d]/g, '')
  const n = Number(numeric || '0')
  return n.toLocaleString('en-US')
})

const handleNumberClick = (num: string) => {
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
const handlePayment = (paymentId: PaymentId) => {
  selectedPayment.value = paymentId
  // 發送付款金額到父組件
  const amount = Number(inputValue.value.replace(/[^\d]/g, '') || '0')
  if (amount > 0) {
    emit('add-payment', { type: paymentId, amount })
  }
  inputValue.value = '0'
}

// 完成結帳
const handleCompleteCheckout = () => {
  console.log({
    amount: inputValue.value,
    method: selectedPayment.value
  })
}
</script>

<template>
  <div
    class="flex flex-col justify-center items-start flex-1 self-stretch rounded-2xl bg-white overflow-hidden"
  >
    <div class="flex items-start flex-1 self-stretch bg-ash-200">
      <!-- Input & Numpad -->
      <div
        class="flex flex-col items-center flex-1 self-stretch border-r border-border-primary overflow-hidden"
      >
        <!-- Input Display -->
        <div
          class="flex h-[170px] px-10 justify-end items-center gap-2 self-stretch border-b-2 border-ash-200 bg-white"
        >
          <div class="flex pt-0.5 items-center gap-2.5 self-stretch">
            <div class="flex w-8 h-8 justify-center items-center">
              <Calculator class="w-8 h-8 text-ash-400" />
            </div>
          </div>
          <div
            class="text-ash-800 text-right font-inter text-[56px] font-semibold leading-[120%]"
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
                'bg-ash-100 hover:bg-ash-200 active:bg-ash-300 active:scale-[0.98]',
                'border-ash-300',
                // 處理邊框，避免重複疊加：最後一行不加底邊框，每行最後一個按鍵不加右邊框
                rowIndex !== 3 ? 'border-b-2' : '',
                key !== row[row.length - 1] ? 'border-r-2' : ''
              ]"
            >
              <template v-if="key === 'backspace'">
                <Delete class="w-10 h-10 text-ash-700" />
              </template>
              <div
                v-else
                :class="[
                  'self-stretch text-center font-inter text-[40px] font-semibold leading-[120%]',
                  key === 'C' ? 'text-gray-500' : 'text-ash-700'
                ]"
              >
                {{ key }}
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="flex flex-col items-start self-stretch border-r border-border-primary">
        <div
          class="flex flex-col items-start gap-px flex-1 self-stretch overflow-hidden"
        >
          <button
            v-for="method in paymentMethods"
            :key="method.id"
            @click="handlePayment(method.id)"
            :class="[
              'flex w-[280px] h-[90px] min-w-[100px] max-w-[280px] px-4 justify-center items-center transition-colors',
              method.id !== 'gift' ? 'pr-6 gap-4' : 'gap-2',
              /* 這裡刪除了判斷式，改用下面這兩行控制顏色 */
             'bg-ash-600 hover:bg-ash-700',
             'active:bg-ash-700 active:scale-95'
            ]"
          >
            <!-- Icon (前三個有 icon，現金 / 信用卡 / 電子支付) -->
            <div
              v-if="method.id !== 'gift'"
              class="flex w-7 h-7 justify-center items-center flex-shrink-0"
            >
              <CircleDollarSign
                v-if="method.id === 'cash'"
                class="w-7 h-7 text-white"
              />
              <CreditCard
                v-else-if="method.id === 'credit'"
                class="w-7 h-7 text-white"
              />
              <Smartphone
                v-else-if="method.id === 'mobile'"
                class="w-7 h-7 text-white"
              />
            </div>

            <!-- Label -->
            <div
              class="text-white text-center font-noto text-[22px] font-medium leading-[120%]"
            >
              {{ method.label }}
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Actions -->
    <div
      class="flex h-[122px] p-4 items-start gap-4 self-stretch border-t border-ash-200"
    >
      <button
        class="flex w-[140px] h-[90px] px-4 justify-center items-center gap-2 rounded-2xl bg-ash-600 hover:bg-ash-700 transition-colors"
      >
        <div
          class="w-[87px] flex-shrink-0 text-white text-center font-noto text-[28px] font-medium leading-[128%] tracking-[1.12px]"
        >
          發票
        </div>
      </button>
      <div class="flex justify-end items-center gap-4 flex-1">
        <button
          class="flex w-[180px] h-[90px] px-4 justify-center items-center gap-2 rounded-2xl bg-ash-600 hover:bg-ash-700 transition-colors"
        >
          <div
            class="w-[87px] flex-shrink-0 text-white text-center font-noto text-[28px] font-medium leading-[128%] tracking-[1.12px]"
          >
            暫存
          </div>
        </button>
        <button
          class="flex w-[220px] h-[90px] min-w-[180px] max-w-[220px] px-4 justify-center items-center gap-2 rounded-2xl bg-indianred-600 hover:bg-indianred-600/90 transition-colors"
          @click="handleCompleteCheckout"
        >
          <div
            class="text-white text-center font-noto text-[28px] font-medium leading-[128%] tracking-[1.12px]"
          >
            完成結帳
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
