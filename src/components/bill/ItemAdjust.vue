<script setup>
defineOptions({ name: 'ItemAdjust' })
import { CircleDollarSign } from 'lucide-vue-next'

const iconMap = {
  CircleDollarSign,
}

const gridItems = [
  { label: '招待', type: 'action', action: 'complimentary', variant: 'secondary', colSpan: 1, cellClass: 'border-b border-r border-white' },
  { label: '禮物', type: 'action', action: 'gift', variant: 'secondary', colSpan: 1, cellClass: 'border-b border-white' },
  { label: '刪除', type: 'action', action: 'delete', variant: 'danger', colSpan: 1, cellClass: 'border-b border-r border-white' },
  { label: '', type: 'placeholder', variant: 'empty', colSpan: 1, cellClass: 'border-b border-white' },
  { label: '', type: 'placeholder', variant: 'empty', colSpan: 1, cellClass: 'border-b border-r border-white' },
  { label: '', type: 'placeholder', variant: 'empty', colSpan: 1, cellClass: 'border-b border-white' },
  { label: '', type: 'placeholder', variant: 'empty', colSpan: 1, cellClass: 'border-r border-white' },
  { label: '', type: 'placeholder', variant: 'empty', colSpan: 1, cellClass: '' },
  { label: '追加金額', type: 'addAmount', variant: 'primary', colSpan: 2, cellClass: '', icon: 'CircleDollarSign' },
  { label: '90 %', type: 'percentage', value: 90, variant: 'secondary', colSpan: 1, cellClass: 'border-b border-r border-white' },
  { label: '85 %', type: 'percentage', value: 85, variant: 'secondary', colSpan: 1, cellClass: 'border-b border-white' },
  { label: '80 %', type: 'percentage', value: 80, variant: 'secondary', colSpan: 1, cellClass: 'border-b border-r border-white' },
  { label: '75 %', type: 'percentage', value: 75, variant: 'secondary', colSpan: 1, cellClass: 'border-b border-white' },
  { label: '70 %', type: 'percentage', value: 70, variant: 'secondary', colSpan: 1, cellClass: 'border-r border-white' },
  { label: '其他', type: 'action', action: 'other', variant: 'secondary', colSpan: 1, cellClass: '' },
]

const variantClasses = {
  secondary: 'bg-ash-600 active:bg-ash-700',
  danger: 'bg-indianred-500 active:bg-indianred-600',
  primary: 'bg-blue-600 active:bg-blue-700',
  empty: 'bg-app-bg',
}

const baseCellClass = 'flex min-h-0 items-center justify-center font-noto text-xl font-medium leading-[1.2] text-text-on-color transition-colors'

function handleClick(item) {
  if (item.type === 'placeholder') return
  if (item.type === 'action') {
    console.log('ItemAdjust action:', item.action)
  } else if (item.type === 'percentage') {
    console.log('ItemAdjust percentage:', item.value)
  } else if (item.type === 'addAmount') {
    console.log('ItemAdjust addAmount')
  }
}

function getCellClasses(item) {
  const variant = variantClasses[item.variant] || ''
  return [baseCellClass, item.cellClass, variant].filter(Boolean).join(' ')
}
</script>

<template>
  <div class="flex flex-col h-full min-h-0 overflow-hidden rounded-tl-2xl bg-app-bg">
    <div class="flex-1 min-h-0 grid grid-cols-2 grid-rows-[repeat(8,1fr)]">
      <template v-for="(item, index) in gridItems" :key="index">
        <button v-if="item.type !== 'placeholder'" type="button" :class="[
          getCellClasses(item),
          item.colSpan === 2 ? 'col-span-2' : '',
          item.icon ? 'gap-2' : '',
        ]" @click="handleClick(item)">
          <component v-if="item.icon" :is="iconMap[item.icon]" class="w-icon-md h-icon-md shrink-0" :stroke-width="2" />
          {{ item.label }}
        </button>
        <div v-else :class="[
          getCellClasses(item),
          item.colSpan === 2 ? 'col-span-2' : '',
        ]" />
      </template>
    </div>
  </div>
</template>
