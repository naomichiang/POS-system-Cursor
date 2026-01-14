<script setup>
import { X } from 'lucide-vue-next'

defineProps({
  // 是否顯示燈箱
  open: {
    type: Boolean,
    default: false,
  },
  // 是否顯示右上角關閉按鈕
  showClose: {
    type: Boolean,
    default: true,
  },
  // Header Icon（可選）
  headerIcon: {
    type: [Object, Function],
    default: null,
  },
  // Header Icon 顏色 class（預設為次要文字色）
  headerIconColorClass: {
    type: String,
    default: 'text-text-secondary',
  },
  // 主標題文字
  title: {
    type: String,
    default: '',
  },
  // 副標題文字
  subTitle: {
    type: String,
    default: '',
  },
  // 內容文字（若有 slot，會以 slot 為主）
  content: {
    type: String,
    default: '',
  },
  // 按鈕文字（若有 footer slot，會以 slot 為主）
  primaryButtonText: {
    type: String,
    default: '',
  },
  secondaryButtonText: {
    type: String,
    default: '',
  },
  // 紅色危險按鈕文字（若為空字串則不顯示）
  dangerButtonText: {
    type: String,
    default: '',
  },
  // 內容寬度樣式，預設 440px、最小高度 300px
  widthClass: {
    type: String,
    default: 'w-[440px] max-w-[90vw] min-h-[100px]',
  },
})

const emit = defineEmits(['close', 'primary', 'secondary', 'danger'])

const handleClose = () => {
  emit('close')
}

const handlePrimary = () => {
  emit('primary')
}

const handleSecondary = () => {
  emit('secondary')
}

const handleDanger = () => {
  emit('danger')
}
</script>

<template>
  <!-- 燈箱：覆蓋全畫面，點外面無作用；內容垂直置中 -->
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-modal-bg/60"
  >
    <div
      :class="[
        'relative rounded-3xl bg-white shadow-2xl px-4 pt-10 pb-4 flex flex-col items-stretch ',
        widthClass,
      ]"
    >
      <!-- Header：Icon + 標題 + 副標題（整體水平置中） -->
      <div class="relative">
        <!-- 置中的 Icon + 標題 + 副標 -->
        <div class="flex flex-col items-center justify-center gap-3 mb-1">
          <div
            v-if="headerIcon"
            class="flex w-18 h-18 items-center justify-center rounded-full bg-white"
          >
            <component
              :is="headerIcon"
              :class="['w-16 h-16', headerIconColorClass]"
            />
          </div>
          <div class="flex flex-col gap-1 items-center text-center">
            <h2
              v-if="title"
              class="mb-1 text-text-secondary font-noto text-2xl font-semibold leading-tight tracking-[0.05em] text-center"
            >
              {{ title }}
            </h2>
            <p
              v-if="subTitle"
              class="text-text-helper font-noto text-md leading-snug text-center"
            >
              {{ subTitle }}
            </p>
          </div>
        </div>

        <!-- 右上角關閉按鈕，不影響標題置中 -->
        <button
          v-if="showClose"
          type="button"
          class="absolute right-1.5 -top-4 flex w-icon-lg h-icon-lg items-center justify-center rounded-full active:bg-ash-100 transition-colors"
          @click="handleClose"
        >
          <X class="w-icon-xl h-icon-xl text-text-disabled" />
        </button>
      </div>

      <!-- Body：文字或自訂 slot，與整體一起垂直置中 -->
      <div class="flex items-center justify-center my-2">
        <div class="w-full flex justify-center text-center">
          <slot>
            <p
              v-if="content"
              class="text-text-primary font-noto text-md leading-relaxed text-center"
            >
              {{ content }}
            </p>
          </slot>
        </div>
      </div>

      <!-- Footer：按鈕列（可為 1 顆 / 2 顆），也可用 slot 覆蓋，水平置中 -->
      <div class="mt-4 flex justify-center gap-3">
        <slot name="footer">
          <button
            v-if="secondaryButtonText"
            type="button"
            class="w-full min-w-btn-md px-8 h-btn-h-md rounded-2xl bg-button-secondary active:bg-button-secondary-hover text-text-on-color font-noto text-2xl tracking-[0.05em] font-medium"
            @click="handleSecondary"
          >
            {{ secondaryButtonText }}
          </button>
          <button
            v-if="primaryButtonText"
            type="button"
            class="w-full min-w-btn-md px-8 h-btn-h-md rounded-2xl bg-button-primary active:bg-button-primary-hover text-text-on-color font-noto text-2xl tracking-[0.05em] font-medium"
            @click="handlePrimary"
          >
            {{ primaryButtonText }}
          </button>
          <button
            v-if="dangerButtonText"
            type="button"
            class="w-full min-w-btn-md px-8 h-btn-h-md rounded-2xl bg-button-danger active:bg-button-danger-hover text-text-on-color font-noto text-2xl tracking-[0.05em] font-medium"
            @click="handleDanger"
          >
            {{ dangerButtonText }}
          </button>

        </slot>
      </div>
    </div>
  </div>
</template>

