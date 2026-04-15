import { defineStore } from 'pinia'
import { TABLE_STATUS, getStatusLabel } from '../config/tableStatus'
import { formatDiningTime } from '@/utils/formatDiningTime'
import { DEFAULT_RESTAURANT_CONFIG } from '@/config/restaurantConfig'
import { MockOrder001 } from '@/mock/orderMock'

export const useOrderStore = defineStore('order', {
  state: () => ({
    /** 當前訂單（由 fetchOrderData 載入，模擬 API 回傳） */
    currentOrder: null,
    /** 帳單調整面板中，目前選取中的餐點 index（對應 currentOrder.items 的索引） */
    selectedOrderItemIndex: null,
    /** 當前桌號（fetchOrderData 時設定，供 getter 預設值使用） */
    currentTableId: null,
    /** 是否正在載入訂單 */
    isLoading: false,
    /** 整單折扣資訊（由結帳調整頁套用） */
    globalDiscount: null,

    // 訂單資訊
    orderInfo: {
      orderId: null,
      tableNumber: null,
      diners: null,
      status: TABLE_STATUS.AVAILABLE, // 預設為 0: 未開桌
      serviceType: null, // 'dine-in' | 'takeaway'
      customerInfo: { preferences: {} },   // Step3 額外選項（extraFields）
      customerInfo2: { preferences: {} }   // Step4 額外選項（extraFields2）
    },

    // 購物車（未下單）
    cart: {
      items: [] // 每個 item 包含: cartItemId, id, name, price, quantity, note, modifiers
    },

    // 已下單餐點（已送出給廚房，加點時顯示）
    placedItems: [],

    // 支付資訊
    payment: {
      receivedAmount: 0,
      details: [], // 支付方式陣列
      isPaid: false
    }
  }),

  getters: {
    // 計算購物車小計：加總所有未下單商品的 price * quantity
    subtotal: (state) => {
      return state.cart.items.reduce((sum, item) => {
        const itemTotal = Number(item.price) * Number(item.quantity)
        return Number(sum) + Number(itemTotal)
      }, 0)
    },

    // 計算已下單餐點小計
    placedSubtotal: (state) => {
      return state.placedItems.reduce((sum, item) => {
        const itemTotal = Number(item.price) * Number(item.quantity)
        return Number(sum) + Number(itemTotal)
      }, 0)
    },

    // 計算總金額：已下單 + 未下單
    totalAmount() {
      return this.placedSubtotal + this.subtotal
    },

    // 計算找零金額：receivedAmount - totalAmount
    changeAmount() {
      const totalAmount = this.totalAmount
      const change = Number(this.payment.receivedAmount) - Number(totalAmount)
      return Math.max(0, change) // 確保找零不會是負數
    },

    /**
     * 訂單顯示用資訊（整合 tableInfo 與 summary，含 formatDiningTime、getStatusLabel）
     * 若 currentOrder 或 tableInfo 為空，回傳基礎預設值
     */
    orderInfoForDisplay(state) {
      const order = state.currentOrder
      const tableInfo = order?.tableInfo

      if (!order || !tableInfo) {
        return {
          tableNumber: state.currentTableId || '-',
          diners: 0,
          status: TABLE_STATUS.AVAILABLE,
          statusLabel: '未開桌',
          diningTime: '00:00',
          totalItems: 0,
          totalAmount: 0
        }
      }

      const status = tableInfo.status ?? TABLE_STATUS.OCCUPIED
      return {
        tableNumber: tableInfo.tableNumber || state.currentTableId || '-',
        diners: tableInfo.diners ?? 0,
        status,
        statusLabel: getStatusLabel(status),
        diningTime: formatDiningTime(tableInfo.openTime),
        totalItems: order.summary?.totalItems ?? 0,
        totalAmount: Number(order.summary?.totalAmount ?? 0) + Number(state.globalDiscount?.amount ?? 0)
      }
    }
  },

  actions: {
    /**
     * 初始化桌次與訂單資訊（開桌時存桌位、人數、customerInfo、customerInfo2）
     * @param {Object} tableData - 桌次資料，包含 tableNumber, diners, orderId, serviceType, customerInfo, customerInfo2
     */
    setTable(tableData) {
      this.orderInfo = {
        orderId: tableData.orderId || null,
        tableNumber: tableData.tableNumber || null,
        diners: tableData.diners || null,
        status: tableData.status !== undefined ? tableData.status : TABLE_STATUS.AVAILABLE,
        serviceType: tableData.serviceType || null,
        customerInfo: tableData.customerInfo ?? { preferences: {} },
        customerInfo2: tableData.customerInfo2 ?? { preferences: {} }
      }
    },

    /**
     * 產生購物車品項唯一 id（用於 split 模式及 removeFromCart）
     */
    _generateCartItemId(product) {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID()
      }
      return `${product.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`
    },

    /**
     * 判斷兩筆是否為「同商品且客製化相同」（供 merge 模式比對）
     */
    _isSameProductAndCustomization(item, product) {
      if (item.id !== product.id) return false
      const itemMod = JSON.stringify(item.modifiers || [])
      const productMod = JSON.stringify(product.modifiers || [])
      if (itemMod !== productMod) return false
      return (item.note || '') === (product.note || '')
    },

    /**
     * 新增商品到購物車
     * - split：每次點擊為獨立項目，以 cartItemId 區分
     * - merge：同 id 且客製化相同則累加 quantity，否則新增
     * @param {Object} product - 商品資料，包含 id, name, price, quantity, note (可選), modifiers (可選)
     */
    addToCart(product) {
      const strategy = DEFAULT_RESTAURANT_CONFIG.aggregationStrategy || 'merge'

      if (strategy === 'split') {
        const cartItemId = this._generateCartItemId(product)
        this.cart.items.push({
          cartItemId,
          id: product.id,
          name: product.name,
          price: Number(product.price),
          quantity: Number(product.quantity || 1),
          note: product.note || '',
          modifiers: product.modifiers || []
        })
        return
      }

      // merge：找同商品且客製化相同的項目
      const existingItemIndex = this.cart.items.findIndex(item =>
        this._isSameProductAndCustomization(item, product)
      )

      if (existingItemIndex !== -1) {
        const existingItem = this.cart.items[existingItemIndex]
        this.cart.items[existingItemIndex] = {
          ...existingItem,
          quantity: Number(existingItem.quantity) + Number(product.quantity || 1)
        }
      } else {
        const cartItemId = this._generateCartItemId(product)
        this.cart.items.push({
          cartItemId,
          id: product.id,
          name: product.name,
          price: Number(product.price),
          quantity: Number(product.quantity || 1),
          note: product.note || '',
          modifiers: product.modifiers || []
        })
      }
    },

    /**
     * 清空當前購物車
     */
    clearCart() {
      this.cart.items = []
    },

    /**
     * 設定已下單餐點（加點時從 mock/MockPlacedOrders 或 API 載入）
     * @param {Array} items - 已送出給廚房的餐點陣列
     */
    setPlacedItems(items) {
      this.placedItems = Array.isArray(items) ? [...items] : []
    },

    /**
     * 設定 / 切換目前選取中的已下單餐點
     * - 再次點擊同一筆則取消選取
     * @param {number} index - currentOrder.items 的索引
     */
    setSelectedOrderItem(index) {
      const order = this.currentOrder
      if (!order || !Array.isArray(order.items)) {
        this.selectedOrderItemIndex = null
        return
      }
      if (index == null || index < 0 || index >= order.items.length) {
        this.selectedOrderItemIndex = null
        return
      }

      if (this.selectedOrderItemIndex === index) {
        // 再次點擊同一筆 → 取消選取
        this.selectedOrderItemIndex = null
      } else {
        this.selectedOrderItemIndex = index
      }
    },

    /**
     * 對目前選取中的餐點套用折扣並重算小計與總額
     * @param {{ type: 'gift' | 'complimentary' | 'delete' | 'percentage', label: string, value?: number }} payload
     */
    applyDiscountToSelectedItem(payload) {
      const order = this.currentOrder
      const idx = this.selectedOrderItemIndex
      if (!order || !Array.isArray(order.items) || idx == null || idx < 0 || idx >= order.items.length) {
        return
      }

      const target = order.items[idx]
      const type = payload?.type
      const label = payload?.label || ''

      const unitPrice = Number(target.unitPrice ?? target.price)
      const quantity = Number(target.quantity) || 0
      const baseSubtotal = unitPrice * quantity

      let newSubtotal = baseSubtotal

      if (type === 'gift' || type === 'complimentary' || type === 'delete') {
        // 招待 / 禮物 / 刪除（單品作廢）→ 新價 0、帳單列顯示劃線與紅字標籤
        newSubtotal = 0
        target.isGift = true
      } else if (type === 'percentage') { // 百分比折扣
        const value = Number(payload.value)
        if (!Number.isFinite(value)) return
        const rate = value / 100
        // 四捨五入到整數金額
        newSubtotal = Math.round(baseSubtotal * rate)
        target.isGift = false
        target.discountValue = value
      }

      target.discountType = type
      target.discountLabel = label
      target.subtotal = newSubtotal

      this._recalculateCurrentOrderSummary()
    },

    /**
     * 清除目前選取餐點的單品折扣，小計恢復為原價（單價 × 數量）
     */
    clearDiscountFromSelectedItem() {
      const order = this.currentOrder
      const idx = this.selectedOrderItemIndex
      if (!order || !Array.isArray(order.items) || idx == null || idx < 0 || idx >= order.items.length) {
        return
      }

      const target = order.items[idx]
      const unitPrice = Number(target.unitPrice ?? target.price)
      const quantity = Number(target.quantity) || 0
      const baseSubtotal = unitPrice * quantity

      target.isGift = false
      target.discountType = null
      target.discountLabel = null
      target.discountValue = null
      target.subtotal = baseSubtotal

      this._recalculateCurrentOrderSummary()
    },

    /**
     * 套用整單折扣（以目前餐點總額為基準）
     * @param {{ title: string, label: string, rate: number }} payload
     */
    applyGlobalDiscount(payload) {
      const order = this.currentOrder
      if (!order || !Array.isArray(order.items)) return

      const rate = Number(payload?.rate)
      if (!Number.isFinite(rate)) return

      // 整單折扣一律以「所有餐點小計總和」為基準，不受餐點選取狀態影響
      const baseTotal = order.items.reduce((sum, item) => {
        return sum + (Number(item.subtotal) || 0)
      }, 0)
      const discountedTotal = Math.round(baseTotal * rate)
      const amount = discountedTotal - baseTotal

      this.globalDiscount = {
        title: payload?.title || '整單折扣',
        label: payload?.label || '',
        rate,
        amount
      }

      // 套用整單折扣後，取消任何單一餐點選取狀態
      this.selectedOrderItemIndex = null
    },

    /**
     * 移除整單折扣（恢復原始總額）
     */
    clearGlobalDiscount() {
      this.globalDiscount = null
    },

    /**
     * 依據 currentOrder.items 重新計算 summary（總品項數量與總金額）
     */
    _recalculateCurrentOrderSummary() {
      const order = this.currentOrder
      if (!order || !Array.isArray(order.items)) return

      let totalItems = 0
      let totalAmount = 0
      order.items.forEach(item => {
        const qty = Number(item.quantity) || 0
        const subtotal = Number(item.subtotal) || 0
        totalItems += qty
        totalAmount += subtotal
      })

      order.summary = {
        ...(order.summary || {}),
        totalItems,
        subtotal: totalAmount,
        totalAmount
      }
    },

    /**
     * 根據購物車品項 id (cartItemId) 從購物車中刪除單一品項
     * @param {string} cartItemId - 要刪除的購物車品項唯一 id（相容舊資料：若品項無 cartItemId 則以 id 比對）
     */
    removeFromCart(cartItemId) {
      this.cart.items = this.cart.items.filter(
        item => (item.cartItemId != null ? item.cartItemId !== cartItemId : String(item.id) !== String(cartItemId))
      )
    },


    /**
     * 模擬載入訂單資料（模擬 API 延遲 500ms）
     * @param {string} [tableId] - 桌號，可於正式串接時傳入 API
     */
    async fetchOrderData(tableId) {
      this.isLoading = true
      this.currentOrder = null
      this.selectedOrderItemIndex = null
      this.currentTableId = tableId ?? null
      this.globalDiscount = null
      await new Promise(resolve => setTimeout(resolve, 500))
      // 深拷貝品項與 summary，避免調整帳單時改到共用 mock 參照
      this.currentOrder = {
        ...MockOrder001,
        items: MockOrder001.items.map(item => ({ ...item })),
        summary: { ...(MockOrder001.summary || {}) },
      }
      this.isLoading = false
    },

    /**
     * 重置所有狀態為初始值
     */
    resetOrder() {
      this.orderInfo = {
        orderId: null,
        tableNumber: null,
        diners: null,
        status: TABLE_STATUS.AVAILABLE,
        serviceType: null,
        customerInfo: { preferences: {} },
        customerInfo2: { preferences: {} }
      }

      this.cart = {
        items: []
      }

      this.placedItems = []

      this.payment = {
        receivedAmount: 0,
        details: [],
        isPaid: false
      }

      this.currentOrder = null
      this.selectedOrderItemIndex = null
      this.currentTableId = null
      this.isLoading = false
      this.globalDiscount = null
    }
  }
})
