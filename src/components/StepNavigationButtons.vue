<!-- 用在 TableSelectionPage，用於導航步驟的按鈕

 @description 步驟導航按鈕
 @param {Boolean} isFirstStep 是否為第一步
 @param {Boolean} isLastStep 是否為最後一步
 @param {Boolean} canProceed 是否可以 proceed
 @param {Function} prev 上一步
 @param {Function} next 下一步
 @param {Function} submit 確認開桌
 -->

<script setup>
import { ArrowLeft, ArrowRight, Check } from 'lucide-vue-next'

defineProps({
  isFirstStep: {
    type: Boolean,
    required: true
  },
  isLastStep: {
    type: Boolean,
    required: true
  },
  canProceed: {
    type: Boolean,
    required: true
  },
  submitLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['prev', 'next', 'submit'])
</script>

<template>
  <div class="flex items-center justify-between p-4 gap-4 border-t border-border-primary">
    <button
      @click="emit('prev')"
      :disabled="isFirstStep"
      :class="[
        'flex w-btn-lg h-btn-h-md min-w-btn-sm px-4 justify-center items-center gap-2 rounded-2xl transition-colors',
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
      @click="emit('next')"
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
      @click="emit('submit')"
      :disabled="!canProceed || submitLoading"
      :class="[
        'flex w-btn-lg h-btn-h-md min-w-btn-md px-4 justify-center items-center gap-2 rounded-2xl transition-colors',
        canProceed && !submitLoading
          ? 'bg-button-danger hover:bg-button-danger-hover active:bg-button-danger-hover text-text-on-color'
          : 'bg-button-primary-disabled text-text-disabled cursor-not-allowed'
      ]"
    >
      <Check class="w-icon-md h-icon-md" />
      <div class="text-center font-noto text-2xl font-medium leading-[128%] tracking-[0.05em]">
        {{ submitLoading ? '處理中…' : '確認開桌' }}
      </div>
    </button>
  </div>
</template>
