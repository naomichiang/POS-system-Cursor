<script setup lang="ts">
import { UtensilsCrossed, UserCircle2 } from 'lucide-vue-next'

const menuItems = [
  { icon: 'stockpot', label: '桌次' },
  { icon: 'stockpot', label: '點餐' },
  { icon: 'stockpot', label: '外帶' },
  { icon: 'stockpot', label: '訂單' },
  { icon: 'stockpot', label: '功能' },
  { icon: 'stockpot', label: '設定' }
]
</script>

<template>
  <div
    class="flex flex-col justify-between items-center w-24 flex-shrink-0 bg-ash-800 h-full min-w-[96px]"
  >
    <div class="flex flex-col items-center w-full">
      <div
        v-for="(item, index) in menuItems"
        :key="index"
        class="flex flex-col justify-center items-center w-full h-28 cursor-pointer hover:bg-ash-700 transition-colors"
      >
        <UtensilsCrossed class="w-8 h-8 text-ash-200" />
        <div class="text-white text-center font-noto text-2xl font-medium mt-1">
          {{ item.label }}
        </div>
      </div>
    </div>

    <!-- User Profile -->
    <div
      class="flex w-full h-28 pb-1 flex-col justify-center items-center gap-1 self-stretch bg-ash-700"
    >
      <UserCircle2 class="w-8 h-8 text-white" />
      <div class="text-white text-center font-noto text-2xl font-medium mt-1">
        王小明
      </div>
    </div>
  </div>
</template>
