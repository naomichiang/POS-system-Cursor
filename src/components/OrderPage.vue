<script setup>
/**
 * 點餐頁（下一階段）
 * 目前為佔位頁，確認開桌後會跳轉至此：/order/:tableId
 */
import { useRoute } from 'vue-router'

const route = useRoute()
const tableId = route.params.tableId
</script>

<template>
  <div class="flex-1 flex flex-col items-center justify-center p-8 bg-app-bg font-noto">
    <p class="text-xl text-text-secondary">點餐頁（開發中）</p>
    <p class="mt-2 text-lg text-text-helper">桌號：{{ tableId }}</p>
  </div>
</template>
