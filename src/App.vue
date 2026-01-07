<script setup lang="ts">
  import TopBar from './components/TopBar.vue'
  import Sidebar from './components/Sidebar.vue'
  import CheckoutPanel from './components/CheckoutPanel.vue'
  import CheckoutArea from './components/CheckoutArea.vue'
  </script>
  
<template>
    <div class="flex flex-col w-full h-screen overflow-hidden bg-ash-100 font-noto">
      <TopBar class="flex-shrink-0 z-10" />
  
      <div class="flex flex-1 overflow-hidden">
        
        <Sidebar class="w-20 flex-shrink-0" />
  
        <CheckoutPanel class="w-[440px] flex-shrink-0" />
  
        <CheckoutArea class="flex-1 overflow-y-auto bg-ash-50" />
        
      </div>
    </div>
  </template>
  
<style scoped></style>
  