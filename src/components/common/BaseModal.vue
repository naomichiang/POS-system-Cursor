<!-- 用在 BaseModal，彈窗組件 -->

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
    default: 'text-modal-accent-icon',
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
    default: 'w-[440px] max-w-[90vw]',
  },
  // 內容高度樣式，預設 272px
  heightClass: {
    type: String,
    default: 'h-[272px] max-h-[90vh]',
  },
  // Body 內文字／區塊對齊（需靠左時設為 text-left）
  bodyContentClass: {
    type: String,
    default: 'text-center',
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
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-modal-bg/60">
    <div :class="[
      'relative rounded-3xl bg-modal-surface shadow-[var(--color-modal-shadow)] px-4 pt-8 pb-4 flex min-h-0 flex-col items-stretch gap-3',
      widthClass,
      heightClass,
    ]">
      <!-- Header：Icon + 標題 + 副標題（整體水平置中）；不與 body 搶縮排高度 -->
      <div class="relative shrink-0">
        <!-- 置中的 Icon + 標題 + 副標 -->
        <div class="flex flex-col items-center justify-center gap-3 mb-1">
          <div v-if="headerIcon" class="flex w-16 h-16 items-center justify-center rounded-full bg-modal-surface">
            <component :is="headerIcon" :class="['w-14 h-14', headerIconColorClass]" />
          </div>
          <div class="flex flex-col gap-1 items-center text-center">
            <h2 v-if="title"
              class="mb-1 text-modal-title font-noto text-2xl font-semibold leading-tight tracking-[0.05em] text-center">
              {{ title }}
            </h2>
            <p v-if="subTitle" class="text-modal-muted font-noto text-md leading-snug text-center">
              {{ subTitle }}
            </p>
          </div>
        </div>

        <!-- 右上角關閉按鈕，不影響標題置中 -->
        <button v-if="showClose" type="button"
          class="absolute -right-2 -top-6 flex w-14 h-14 items-center justify-center rounded-2xl transition-colors active:bg-modal-section-surface"
          @click="handleClose">
          <X class="w-icon-lg h-icon-lg text-modal-muted" />
        </button>
      </div>

      <!-- Body：撐滿 header 與 footer 之間；短文在此區垂直置中，過長可捲動 -->
      <div class="flex min-h-0 flex-1 flex-col">
        <div class="flex min-h-0 w-full flex-1 items-center justify-center overflow-y-auto">
          <div class="w-full flex justify-center" :class="bodyContentClass">
            <slot>
              <p v-if="content" class="text-modal-body font-noto text-md leading-relaxed text-center">
                {{ content }}
              </p>
            </slot>
          </div>
        </div>
      </div>

      <!-- Footer：貼齊卡片下緣區；外層 pb-8 與 pt-8 對稱，避免按鈕貼底 -->
      <div class="flex shrink-0 justify-center mt-1 gap-3">
        <slot name="footer">
          <button v-if="secondaryButtonText" type="button"
            class="w-full min-w-btn-md px-8 h-btn-h-md rounded-2xl bg-button-secondary active:bg-button-secondary-hover text-text-on-color font-noto text-2xl tracking-[0.05em] font-medium"
            @click="handleSecondary">
            {{ secondaryButtonText }}
          </button>
          <button v-if="primaryButtonText" type="button"
            class="w-full min-w-btn-md px-8 h-btn-h-md rounded-2xl bg-button-primary active:bg-button-primary-hover text-text-on-color font-noto text-2xl tracking-[0.05em] font-medium"
            @click="handlePrimary">
            {{ primaryButtonText }}
          </button>
          <button v-if="dangerButtonText" type="button"
            class="w-full min-w-btn-md px-8 h-btn-h-md rounded-2xl bg-button-danger active:bg-button-danger-hover text-text-on-color font-noto text-2xl tracking-[0.05em] font-medium"
            @click="handleDanger">
            {{ dangerButtonText }}
          </button>

        </slot>
      </div>
    </div>
  </div>
</template>
