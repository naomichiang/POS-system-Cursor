<script setup>
/**
 * 追加金額面板: 提供選擇追加金額項目並輸入金額的功能
 * 觸發時機: 點擊「追加金額」按鈕
 */
import { computed, ref, watch } from 'vue'
import { Delete, DollarSign } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const addAmountTypes = ['清潔費', '額外服務費', '訂位費', '外送費', '包廂費', '其他']
const numpadRows = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['C', '0', 'backspace'],
]

const selectedType = ref(addAmountTypes[0])
const inputAmount = ref('0')

const formattedAmount = computed(() => {
  const numeric = inputAmount.value.replace(/[^\d]/g, '')
  const amount = Number(numeric || '0')
  return amount.toLocaleString('en-US')
})

const resetInput = () => {
  inputAmount.value = '0'
}

const closePanel = () => {
  resetInput()
  emit('update:modelValue', false)
}

const handleNumberClick = (num) => {
  if (inputAmount.value === '0') {
    inputAmount.value = num
    return
  }
  inputAmount.value += num
}

const handleClear = () => {
  inputAmount.value = '0'
}

const handleBackspace = () => {
  if (inputAmount.value.length > 1) {
    inputAmount.value = inputAmount.value.slice(0, -1)
  } else {
    inputAmount.value = '0'
  }
}

const handleSubmit = () => {
  const amount = Number(inputAmount.value.replace(/[^\d]/g, '') || '0')
  if (amount <= 0) return
  emit('submit', { name: selectedType.value, amount })
  closePanel()
}

watch(
  () => props.modelValue,
  (visible) => {
    if (!visible) {
      resetInput()
    }
  }
)
</script>

<template>
  <div class="fixed inset-0 z-90" :class="modelValue ? 'pointer-events-auto' : 'pointer-events-none'">
    <div class="absolute inset-0 bg-modal-bg/60 transition-opacity duration-300"
      :class="modelValue ? 'opacity-100' : 'opacity-0'" />
    <aside
      class="absolute inset-y-0 right-0 flex w-full max-w-[520px] flex-col rounded-l-3xl border-l border-border-primary bg-layer-primary shadow-2xl transition-transform duration-300 ease-out"
      :class="modelValue ? 'translate-x-0' : 'translate-x-full'">
      <div class="flex h-full px-5 py-4 gap-4 flex-col overflow-hidden">
        <div class="pt-4 gap-4 flex flex-col">
          <h2 class="text-text-primary font-noto text-lg font-medium leading-[128%]">
            選擇追加項目並輸入金額
          </h2>
          <div class="grid grid-cols-3 gap-2">
            <button v-for="type in addAmountTypes" :key="type" type="button"
              :data-state="type === selectedType ? 'Tertiary' : 'Secondary'" :class="[
                'h-btn-h-sm min-w-20 px-4 rounded-xl flex justify-center items-center',
                'text-center text-text-on-color text-xl font-medium font-noto leading-7',
                'transition-colors active:scale-[0.98]',
                type === selectedType
                  ? 'bg-button-selected active:bg-button-selected-hover'
                  : 'bg-button-primary active:bg-button-primary-hover'
              ]" @click="selectedType = type">
              {{ type }}
            </button>
          </div>
        </div>

        <div class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-layer-secondary">
          <div class="flex h-8-16 px-8 justify-end items-center gap-2 self-stretch  border-b-2 border-border-primary">
            <div class="flex pt-0.5 items-center self-stretch">
              <div class="flex w-icon-lg h-icon-lg justify-center items-center">
                <DollarSign class="w-icon-xl h-icon-xl text-yellow-500" />
              </div>
            </div>
            <div class="text-text-amount-positive text-right font-inter text-[56px] font-semibold leading-[120%]">
              {{ formattedAmount }}
            </div>
          </div>

          <div class="flex flex-col items-start flex-1 self-stretch">
            <div v-for="(row, rowIndex) in numpadRows" :key="rowIndex" class="flex items-center flex-1 self-stretch">
              <button v-for="key in row" :key="key" type="button"
                @click="key === 'C' ? handleClear() : key === 'backspace' ? handleBackspace() : handleNumberClick(key)"
                :class="[
                  'flex flex-col justify-center items-center flex-1 self-stretch transition-all',
                  'bg-layer-secondary hover:bg-layer-secondary-hover active:bg-layer-secondary-hover active:scale-98',
                  'border-border-primary',
                  rowIndex !== 3 ? 'border-b-2' : '',
                  key !== row[row.length - 1] ? 'border-r-2' : ''
                ]">
                <template v-if="key === 'backspace'">
                  <Delete class="w-icon-lg h-icon-lg text-text-disabled" />
                </template>
                <div v-else :class="[
                  'self-stretch text-center font-inter text-3xl font-semibold leading-[120%]',
                  key === 'C' ? 'text-text-disabled' : 'text-ash-700'
                ]">
                  {{ key }}
                </div>
              </button>
            </div>
          </div>
        </div>

        <div class="sticky bottom-0 z-10 flex items-center gap-4 ">
          <button type="button"
            class="flex-1 h-btn-h-md rounded-xl bg-button-primary active:bg-button-primary-hover text-text-on-color text-center font-noto text-2xl font-medium leading-[128%] tracking-[0.05em] transition-colors active:scale-[0.98]"
            @click="closePanel">
            關閉
          </button>
          <button type="button"
            class="flex-1 h-btn-h-md rounded-xl bg-button-danger active:bg-button-danger-hover text-text-on-color text-center font-noto text-2xl font-medium leading-[128%] tracking-[0.05em] transition-colors active:scale-[0.98]"
            @click="handleSubmit">
            送出
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>
