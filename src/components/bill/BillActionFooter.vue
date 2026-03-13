<script setup>
defineOptions({ name: 'BillActionFooter' })

defineProps({
  /** 次要按鈕文字，未傳入則不顯示該按鈕 */
  secondButtonText: {
    type: String,
    default: '',
  },
  /** 主要 CTA 按鈕文字 */
  primaryButtonText: {
    type: String,
    default: '完成',
  },
  /** 主要按鈕是否使用危險樣式（紅色） */
  ctaDanger: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['second-click', 'primary-click'])
</script>

<template>
  <div class="flex h-24 w-full p-3 items-start gap-3 self-stretch border-t border-border-primary">
    <!-- 靠左 slot：內容由左至右排列、整體靠左對齊 -->
    <div class="shrink-0 flex h-full items-center justify-start gap-2">
      <slot name="leftGroup" />
    </div>

    <!-- 彈性撐滿中間空白區域 -->
    <div class="flex-1"></div>

    <!-- 靠右的按鈕組：次要按鈕 + 主要 CTA -->
    <div class="flex h-full justify-end items-center gap-3 shrink-0">
      <button v-if="secondButtonText"
        class="flex w-btn-md h-full justify-center items-center rounded-2xl bg-button-primary active:bg-button-primary-hover transition-colors"
        @click="emit('second-click')">
        <div
          class="shrink-0 text-text-on-color text-center font-noto text-2xl font-medium leading-[128%] tracking-[0.05em]">
          {{ secondButtonText }}
        </div>
      </button>
      <button :class="[
        'flex w-btn-lg h-full min-w-btn-md px-4 justify-center items-center rounded-2xl transition-colors',
        ctaDanger
          ? 'bg-button-danger active:bg-button-danger-hover'
          : 'bg-button-primary active:bg-button-primary-hover',
      ]" @click="emit('primary-click')">
        <div
          class="shrink-0 text-text-on-color text-center font-noto text-2xl font-medium leading-[128%] tracking-[0.05em]">
          {{ primaryButtonText }}
        </div>
      </button>
    </div>
  </div>
</template>
