<script setup>
defineOptions({ name: 'GlobalAdjust' })
import { MOCK_GLOBAL_DISCOUNT_COLUMNS } from '@/mock/MockGlobalDiscount'

const emit = defineEmits(['apply-discount'])

const columns = MOCK_GLOBAL_DISCOUNT_COLUMNS

const sectionBgClasses = {
  yellow: 'bg-layer-highlight-yellow',
  blue: 'bg-blue-100',
  red: 'bg-layer-highlight-red',
}

function handleDiscountClick(section, button) {
  emit('apply-discount', {
    title: section.title,
    label: button.label,
    rate: button.discountRate,
  })
}
</script>

<template>
  <div class="flex flex-col h-full min-h-0 bg-layer-secondary overflow-hidden">
    <div class="flex-1 min-h-0 grid grid-cols-2 overflow-hidden">
      <!-- 兩大欄：各自獨立的折扣專案 -->
      <div v-for="(sections, colIndex) in columns" :key="colIndex"
        class="flex flex-col min-h-0 overflow-y-auto border-r border-ash-600 last:border-r-0">
        <section v-for="(section, sectionIndex) in sections" :key="`${colIndex}-${sectionIndex}`" :class="[
          'flex shrink-0 flex-col gap-2 p-3',
          sectionBgClasses[section.bg],
          sectionIndex < sections.length - 1
            ? 'border-b border-l border-r border-ash-600'
            : 'flex-1 min-h-0 border-l border-r border-ash-600',
        ]">
          <p class="font-noto text-md font-normal leading-[1.2] text-text-primary">
            {{ section.title }}
          </p>
          <button v-for="(btn, btnIndex) in section.buttons" :key="btnIndex" type="button"
            class="flex h-btn-h-md w-full shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-ash-600 font-noto text-xl font-medium leading-[1.2] text-text-on-color transition-colors active:bg-ash-700"
            @click="handleDiscountClick(section, btn)">
            {{ btn.label }}
          </button>
        </section>
      </div>
    </div>
  </div>
</template>
