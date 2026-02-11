<script setup>
/**
 * 點餐頁（OrderPage）
 * - 二段式導覽：
 *   1) 選品模式：主類別 + 商品大按鈕網格
 *   2) 配置模式：左側商品清單 + 右側細項設定（ExtraField / OptGroup）+ 底部 QtyBar
 *
 * 資料來源：
 * - 開發階段：config/menuConfig.js 的 DEFAULT_MENU_CATEGORIES
 * - 正式串接時：可改由 API 或 Store 傳入同樣結構的 config
 */
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useOrderStore } from '../stores/useOrderStore'
import { DEFAULT_MENU_CATEGORIES } from '../config/menuConfig'
import CatTabs from './order/CatTab.vue'
import SubCatList from './order/SubCatList.vue'
import ItemSideMenu from './order/ItemSideMenu.vue'
import OptGroup from './order/OptGroup.vue'
import OrderPanel from './order/OrderPanel.vue'
import QtyBar from './order/QtyBar.vue'

const route = useRoute()
const orderStore = useOrderStore()
const tableId = route.params.tableId

// ---------------- 菜單分類（完整資料來自 menuConfig，之後可改由 props/store 傳入） ----------------
const categories = ref([...DEFAULT_MENU_CATEGORIES])

// ---------------- 狀態：主類別 / 商品 / 模式 ----------------
const activeCatKey = ref(categories.value[0]?.key ?? null)

const activeCategory = computed(() =>
  categories.value.find(cat => cat.key === activeCatKey.value) || null
)

// 當前顯示的商品（在兩種模式共用）
const selectedItemId = ref(activeCategory.value?.items?.[0]?.id ?? null)

const currentItem = computed(() => {
  const cat = activeCategory.value
  if (!cat) return null
  return cat.items.find(item => item.id === selectedItemId.value) || cat.items[0] || null
})

// 模式：selection | config
const mode = ref('selection')

// 細項選擇（ExtraField v-model 結構：{ [groupKey]: value | value[] }）
const optionSelections = ref({})

// 數量控制
const quantity = ref(1)

/**
 * 根據商品的 optionGroups 掃描 isDefault: true 的選項，建立預設配置
 * - 單選 (isMultiple: false)：currentConfig[groupKey] = defaultValue
 * - 多選 (isMultiple: true)：currentConfig[groupKey] = [defaultValue1, defaultValue2, ...]
 */
const buildDefaultConfig = (item) => {
  if (!item || !Array.isArray(item.optionGroups)) return {}
  const config = {}
  for (const group of item.optionGroups) {
    const groupKey = group.key || group.label
    const isMultiple = group.isMultiple === true
    const defaultOptions = (group.options || []).filter(o => o.isDefault === true)
    const defaultValues = defaultOptions.map(o => o.value ?? o.label)

    if (defaultValues.length === 0) continue

    if (isMultiple) {
      config[groupKey] = [...defaultValues]
    } else {
      config[groupKey] = defaultValues[0]
    }
  }
  return config
}

// 切換主類別：回到選品模式並預設第一個商品
const handleCatChange = (key) => {
  activeCatKey.value = key
  const cat = categories.value.find(c => c.key === key)
  const firstItem = cat?.items?.[0] || null
  selectedItemId.value = firstItem?.id ?? null
  mode.value = 'selection'
  optionSelections.value = {}
  quantity.value = 1
}

// 選品模式下選擇商品（SubCatList 點擊觸發）
const handleSelectItemFromGrid = (item) => {
  if (!item) return
  selectedItemId.value = item.id
  quantity.value = 1

  // 若商品有細項設定：先初始化預設配置，再進入配置模式
  if (Array.isArray(item.optionGroups) && item.optionGroups.length > 0) {
    optionSelections.value = buildDefaultConfig(item)
    mode.value = 'config'
  } else {
    optionSelections.value = {}
    addItemToCart(item)
  }
}

// 配置模式左側選單切換商品
const handleSideMenuSelect = (itemId) => {
  selectedItemId.value = itemId
  quantity.value = 1
  const item = activeCategory.value?.items?.find(i => i.id === itemId)
  optionSelections.value = item ? buildDefaultConfig(item) : {}
}

// 計算加價金額
const extraPrice = computed(() => {
  const item = currentItem.value
  if (!item || !Array.isArray(item.optionGroups)) return 0

  let total = 0
  for (const group of item.optionGroups) {
    const key = group.key || group.label
    const selected = optionSelections.value[key]
    if (!selected) continue

    const addOptionPrice = (value) => {
      const opt = group.options?.find(o => (o.value ?? o.label) === value)
      if (opt && Number(opt.price) > 0) {
        total += Number(opt.price)
      }
    }

    if (Array.isArray(selected)) {
      selected.forEach(v => addOptionPrice(v))
    } else {
      addOptionPrice(selected)
    }
  }
  return total
})

const finalUnitPrice = computed(() => {
  const item = currentItem.value
  if (!item) return 0
  return Number(item.price) + Number(extraPrice.value)
})

// 數量加減
const increaseQty = () => {
  quantity.value = Math.min(99, Number(quantity.value || 1) + 1)
}
const decreaseQty = () => {
  quantity.value = Math.max(1, Number(quantity.value || 1) - 1)
}

// 新增到購物車
const addItemToCart = (itemOverride) => {
  const item = itemOverride || currentItem.value
  if (!item) return

  const modifiers = {
    optionSelections: optionSelections.value,
    displayGroups: item.optionGroups || []
  }

  // 用 base id + 選項 JSON 當作購物車 key，確保不同客製化可分別列出
  const optionKey = JSON.stringify(optionSelections.value || {})
  const cartId = `${item.id}:${optionKey}`

  orderStore.addToCart({
    id: cartId,
    name: item.name,
    price: finalUnitPrice.value,
    quantity: quantity.value,
    modifiers
  })

  // 加入後回到選品模式，保留目前類別
  mode.value = 'selection'
  optionSelections.value = {}
  quantity.value = 1
}

// 若 tableId 與 store 中不一致，簡單同步一下（之後可加強保護）
watch(
  () => orderStore.orderInfo.tableNumber,
  (val) => {
    if (!val && tableId) {
      orderStore.orderInfo.tableNumber = tableId
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="flex flex-1 w-full min-w-0 h-full min-h-0 overflow-hidden p-4 gap-3">
    <!-- 左側主內容區：扣除 OrderPanel 後的剩餘寬度，CatTab 固定高度、下方為 SubCatList/配置區 -->
    <div class="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden gap-3 basis-0">
      <!-- 上方主類別 tabs（固定高度、寬度受左欄約束，不撐開版面） -->
      <div class="shrink-0 h-14 w-full min-w-0 overflow-hidden">
        <CatTabs
          :categories="categories"
          :active-key="activeCatKey"
          @change="handleCatChange"
        />
      </div>

      <!-- 中間區塊：佔滿剩餘高度，依模式切換 -->
      <div class="flex-1 flex min-h-0 bg-layer-primary rounded-2xl shadow-sm overflow-hidden">
        <!-- 選品模式：大按鈕網格 -->
        <SubCatList
          v-if="mode === 'selection'"
          :items="activeCategory?.items || []"
          @select="handleSelectItemFromGrid"
        />

        <!-- 配置模式：左側清單 + 右側細項 -->
        <template v-else>
          <ItemSideMenu
            :items="activeCategory?.items || []"
            :active-id="selectedItemId"
            @select="handleSideMenuSelect"
          />

          <div class="flex-1 flex flex-col min-h-0 overflow-hidden bg-white">
            <div class="flex-1 overflow-y-auto scrollbar-hide p-4">
              <OptGroup
                v-if="currentItem?.optionGroups?.length"
                :groups="currentItem.optionGroups"
                v-model="optionSelections"
              />
            </div>

            <!-- 底部數量 / 加入 -->
            <QtyBar
              :item-name="currentItem?.name"
              :unit-price="finalUnitPrice"
              v-model:quantity="quantity"
              @increase="increaseQty"
              @decrease="decreaseQty"
              @add="addItemToCart"
            />
          </div>
        </template>
      </div>
    </div>

    <!-- 右側點餐明細（固定寬度、不被擠壓） -->
    <div class="shrink-0 flex-none h-full">
      <OrderPanel
        class="h-full"
        :items="orderStore.cart.items"
        :total-count="orderStore.cart.items.length"
        :total-amount="orderStore.subtotal.toLocaleString()"
        @delete-all="orderStore.cart.items = []"
      />
    </div>
  </div>
</template>
