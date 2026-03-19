<script setup>
defineOptions({ name: 'GlobalAdjust' })

// 按鈕資料陣列，格式同 ItemAdjust：{ label, type, variant, colSpan?, cellClass?, icon?, action?, value? }
const gridItems = []
</script>

<template>
  <div class="flex flex-col h-full min-h-0 bg-layer-secondary overflow-hidden">
    <div class="flex shrink-0 items-center px-3 py-2 border-b border-border-primary bg-layer-dark-primary">
      <span class="font-noto text-lg font-medium text-text-on-color">整單折扣</span>
    </div>
    <div
      v-if="gridItems.length > 0"
      class="flex-1 min-h-0 grid grid-cols-2"
    >
      <!-- 待實作：使用 v-for 渲染 gridItems，橫跨整列使用 col-span-2 -->
    </div>
    <div
      v-else
      class="flex-1 min-h-0 flex items-center justify-center text-text-placeholder font-noto text-lg"
    >
      建置中
    </div>
  </div>
</template>
