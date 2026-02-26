<script setup>
// 結帳頁：左右操作區，tableId 可從 useRoute().params.tableId 取得
</script>

<template>
  <main class="flex flex-1 p-4 gap-4 min-h-0 min-w-0">
    <!-- 左側操作區 -->
    <div
      class="w-[330px] h-full shrink-0 bg-white rounded-2xl shadow-sm overflow-hidden flex items-center justify-center">
      <span class="text-text-helper font-noto text-2xl">建置中</span>
    </div>

    <!-- 右側操作區 -->
    <div class="flex-1 bg-white rounded-2xl shadow-sm overflow-y-auto flex items-center justify-center">
      <span class="text-text-helper font-noto text-2xl">建置中</span>
    </div>
  </main>
</template>
