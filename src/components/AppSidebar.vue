/* eslint-disable vue/multi-word-component-names */
<script setup>
import {
  Grid3x3,
  UtensilsCrossed,
  ShoppingBag,
  ClipboardList,
  Wrench,
  Settings,
  UserCircle2
} from 'lucide-vue-next'

const menuItems = [
  { icon: Grid3x3, label: '桌次' },
  { icon: UtensilsCrossed, label: '點餐' },
  { icon: ShoppingBag, label: '外帶' },
  { icon: ClipboardList, label: '訂單' },
  { icon: Wrench, label: '功能' },
  { icon: Settings, label: '設定' },
]
</script>

<template>
  <div
    class="flex flex-col justify-between items-center w-20 shrink-0 bg-ash-800 h-full min-w-[64px]"
  >
    <div class="flex flex-col items-center w-full">
      <div
        v-for="(item, index) in menuItems"
        :key="index"
        class="flex flex-col justify-center items-center w-full h-24 gap-1 cursor-pointer hover:bg-ash-700 transition-colors"
      >
        <component :is="item.icon" class="w-6 h-6 text-ash-200" />
        <div class="text-white text-center font-noto text-lg font-medium mb-1">
          {{ item.label }}
        </div>
      </div>
    </div>

    <!-- User Profile -->
    <div
      class="flex w-full h-20 pb-1 flex-col justify-center items-center gap-1 self-stretch bg-ash-700"
    >
      <UserCircle2 class="w-6 h-6 text-white" />
      <div class="text-white text-center font-noto text-md font-medium mt-1">
        王小明
      </div>
    </div>
  </div>
</template>
