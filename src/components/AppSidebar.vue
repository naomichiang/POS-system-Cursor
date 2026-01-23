/* eslint-disable vue/multi-word-component-names */
<script setup>
import { useRouter } from 'vue-router'
import {
  Grid3x3,
  UtensilsCrossed,
  ShoppingBag,
  ClipboardList,
  Wrench,
  Settings,
  UserCircle2
} from 'lucide-vue-next'

const router = useRouter()

const menuItems = [
  { icon: Grid3x3, label: '桌次', path: '/table-selection' },
  { icon: UtensilsCrossed, label: '點餐', path: '/' },
  { icon: ShoppingBag, label: '外帶', path: '/' },
  { icon: ClipboardList, label: '訂單', path: '/' },
  { icon: Wrench, label: '功能', path: '/' },
  { icon: Settings, label: '設定', path: '/' },
]

const handleMenuClick = (path) => {
  router.push(path)
}
</script>

<template>
  <div
    class="flex flex-col justify-between items-center w-18 shrink-0 bg-layer-dark-secondary h-full min-w-[64px]">
    <div class="flex flex-col items-center w-full">
      <div
        v-for="(item, index) in menuItems"
        :key="index"
        @click="handleMenuClick(item.path)"
        class="flex flex-col justify-center items-center w-full h-20 gap-1 cursor-pointer hover:bg-layer-dark-tertiary transition-colors"
      >
        <component :is="item.icon" class="w-icon-md h-icon-md text-text-dark-secondary" />
        <div class="text-text-dark-primary text-center font-noto text-md font-medium mb-1">
          {{ item.label }}
        </div>
      </div>
    </div>

    <!-- User Profile -->
    <div
      class="flex w-full h-18 pb-1 flex-col justify-center items-center gap-1 self-stretch bg-layer-dark-tertiary"
    >
      <UserCircle2 class="w-icon-sm h-icon-sm text-text-dark-primary" />
      <div class="text-text-dark-primary text-center font-noto text-md font-medium">
        王小明
      </div>
    </div>
  </div>
</template>
