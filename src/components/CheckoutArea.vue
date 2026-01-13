<script setup>
import { ref, computed } from 'vue'
import {
  CircleDollarSign,
  CreditCard,
  Smartphone,
  Ticket,
  Delete,
  DollarSign
} from 'lucide-vue-next'
import { paymentMethodsConfig } from '../config/paymentMethods'

// 圖標組件映射，確保 Vue 能正確識別組件
const iconMap = {
  CircleDollarSign,
  CreditCard,
  Smartphone,
  Ticket
}

// 獲取圖標組件的輔助函數

const getIconComponent = (icon) => {
  if (!icon) return null
  // 如果 icon 是組件，直接返回
  if (typeof icon === 'object' && (icon.render || icon.setup || icon.__name)) {
    return icon
  }
  // 如果 icon 是字符串，從映射中獲取
  if (typeof icon === 'string') {
    return iconMap[icon] || null
  }
  return icon
}

// 定義鍵盤佈局
const numpadRows = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['C', '0', 'backspace']
]

const emit = defineEmits(['add-payment'])

const inputValue = ref('500')

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
              <DollarSign class="w-icon-lg h-icon-lg text-yellow-500" />
            </div>
          </div>
          <div
            class="text-text-secondary text-right font-inter text-[56px] font-semibold leading-[120%]"
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
                'bg-layer-secondary hover:bg-layer-secondary-hover active:bg-layer-primary-disabled active:scale-[0.98]',
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
              'flex w-btn-lg h-[80px] min-w-[100px] max-w-[240px] px-4 justify-center items-center transition-colors',
              method.paddingClass,
              'bg-button-primary hover:bg-button-primary-hover',
              'active:bg-button-primary-disabled active:scale-[0.98]'
            ]"
          >
            <!-- Icon (動態渲染，根據配置決定是否顯示) -->
            <div
              v-if="method.hasIcon && getIconComponent(method.icon)"
              class="flex w-icon-md h-icon-md justify-center items-center shrink-0"
            >
              <component
                :is="getIconComponent(method.icon)"
                class="w-icon-md h-icon-md text-text-on-color"
              />
            </div>

            <!-- Label -->
            <div
              class="text-text-on-color text-center font-noto text-xl font-medium leading-[120%]"
            >
              {{ method.label }}
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Actions -->
    <div
      class="flex h-8-14 p-4 items-start gap-4 self-stretch border-t border-border-primary"
    >
      <button
        class="flex w-btn-md h-full px-4 justify-center items-center gap-2 rounded-2xl bg-button-primary hover:bg-button-primary-hover transition-colors">
        <div
          class="shrink-0 text-text-on-color text-center font-noto text-2xl font-medium leading-[128%] tracking-[1.12px]">
          發票
        </div>
      </button>
      <div class="flex h-full justify-end items-center gap-4 flex-1">
        <button
          class="flex w-btn-md h-full justify-center items-center rounded-2xl bg-button-primary hover:bg-button-prmary-hover transition-colors">
          <div class="shrink-0 text-text-on-color text-center font-noto text-2xl font-medium leading-[128%] tracking-[1.12px]">
            暫存
          </div>
        </button>
        <button
          class="flex w-btn-lg h-full min-w-btn-md max-w-[220px] px-4 justify-center items-center rounded-2xl bg-button-danger hover:bg-button-danger-hover transition-colors"
          @click="handleCompleteCheckout">
          <div class="shrink-0 text-text-on-color text-center font-noto text-2xl font-medium leading-[128%] tracking-[1.12px]">
            完成結帳
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
