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
  // 內容寬度樣式，md 版預設 580px、最小高度 300px
  widthClass: {
    type: String,
    default: 'w-[400px] max-w-[90vw] min-h-[100px]',
  },
})

const emit = defineEmits(['close', 'primary', 'secondary'])

const handleClose = () => {
  emit('close')
}

const handlePrimary = () => {
  emit('primary')
}

const handleSecondary = () => {
  emit('secondary')
}
</script>

<template>
  <!-- 燈箱：覆蓋全畫面，點外面無作用；內容垂直置中 -->
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
  >
    <div
      :class="[
        'relative rounded-2xl bg-white shadow-2xl px-6 py-8 flex flex-col items-stretch ',
        widthClass,
      ]"
    >
      <!-- Header：Icon + 標題 + 副標題（整體水平置中） -->
      <div class="relative mb-4">
        <!-- 置中的 Icon + 標題 + 副標 -->
        <div class="flex flex-col items-center justify-center gap-2">
          <div
            v-if="headerIcon"
            class="flex w-icon-xl h-icon-xl items-center justify-center rounded-full bg-layer-secondary"
          >
            <component
              :is="headerIcon"
              class="w-icon-md h-icon-md text-text-secondary"
            />
          </div>
          <div class="flex flex-col gap-1 items-center text-center">
            <h2
              v-if="title"
              class="text-text-primary font-noto text-xl font-semibold leading-tight text-center"
            >
              {{ title }}
            </h2>
            <p
              v-if="subTitle"
              class="text-text-helper font-noto text-sm leading-snug text-center"
            >
              {{ subTitle }}
            </p>
          </div>
        </div>

        <!-- 右上角關閉按鈕，不影響標題置中 -->
        <button
          v-if="showClose"
          type="button"
          class="absolute right-0 -top-2 flex w-icon-lg h-icon-lg items-center justify-center rounded-full hover:bg-ash-100 transition-colors"
          @click="handleClose"
        >
          <X class="w-icon-md h-icon-md text-text-disabled" />
        </button>
      </div>

      <!-- Body：文字或自訂 slot，與整體一起垂直置中 -->
      <div class="flex items-center justify-center my-2">
        <div class="w-full flex justify-center text-center">
          <slot>
            <p
              v-if="content"
              class="text-text-secondary font-noto text-lg leading-relaxed text-center"
            >
              {{ content }}
            </p>
          </slot>
        </div>
      </div>

      <!-- Footer：按鈕列（可為 1 顆 / 2 顆），也可用 slot 覆蓋，水平置中 -->
      <div class="mt-6 flex justify-center gap-3">
        <slot name="footer">
          <button
            v-if="secondaryButtonText"
            type="button"
            class="min-w-btn-md px-4 h-btn-h-md rounded-2xl bg-button-secondary hover:bg-button-secondary-hover text-text-on-color font-noto text-2xl font-medium"
            @click="handleSecondary"
          >
            {{ secondaryButtonText }}
          </button>
          <button
            v-if="primaryButtonText"
            type="button"
            class="min-w-btn-md px-4 h-btn-h-md rounded-2xl bg-button-primary hover:bg-button-primary-hover text-text-on-color font-noto text-2xl font-medium"
            @click="handlePrimary"
          >
            {{ primaryButtonText }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

