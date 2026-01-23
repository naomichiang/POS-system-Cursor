import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
  state: () => ({
    // 訂單資訊
    orderInfo: {
      orderId: null,
      tableNumber: null,
      diners: null,
      status: 'ordering' // 預設為 'ordering'
    },

    // 購物車
    cart: {
      items: [] // 每個 item 包含: id, name, price, quantity, note, modifiers
    },

    // 帳單資訊
    billing: {
      discountType: 'none', // 'none' | 'percent' | 'amount'
      discountValue: 0,
      serviceChargeRate: 0.1 // 預設服務費率 10%
    },

    // 支付資訊
    payment: {
      receivedAmount: 0,
      details: [], // 支付方式陣列
      isPaid: false
    }
  }),

  getters: {
    // 計算小計：加總所有商品的 price * quantity
    subtotal: (state) => {
      return state.cart.items.reduce((sum, item) => {
        const itemTotal = Number(item.price) * Number(item.quantity)
        return Number(sum) + Number(itemTotal)
      }, 0)
    },

    // 計算折扣金額
    discountAmount() {
      const subtotal = this.subtotal

      if (this.billing.discountType === 'percent') {
        return Number(subtotal) * (Number(this.billing.discountValue) / 100)
      } else if (this.billing.discountType === 'amount') {
        return Number(this.billing.discountValue)
      }
      return 0
    },

    // 計算總金額：(subtotal - discount) * (1 + serviceChargeRate)
    totalAmount() {
      const subtotal = this.subtotal
      const discount = this.discountAmount

      const amountAfterDiscount = Number(subtotal) - Number(discount)
      const serviceCharge = amountAfterDiscount * Number(this.billing.serviceChargeRate)
      return Number(amountAfterDiscount) + Number(serviceCharge)
    },

    // 計算找零金額：receivedAmount - totalAmount
    changeAmount() {
      const totalAmount = this.totalAmount
      const change = Number(this.payment.receivedAmount) - Number(totalAmount)
      return Math.max(0, change) // 確保找零不會是負數
    }
  },

  actions: {
    /**
     * 初始化桌次與訂單資訊
     * @param {Object} tableData - 桌次資料，包含 tableNumber, diners, orderId (可選)
     */
    setTable(tableData) {
      this.orderInfo = {
        orderId: tableData.orderId || null,
        tableNumber: tableData.tableNumber || null,
        diners: tableData.diners || null,
        status: tableData.status || 'ordering'
      }
    },

    /**
     * 新增商品到購物車
     * 若商品已在購物車中，則增加數量
     * @param {Object} product - 商品資料，包含 id, name, price, quantity, note (可選), modifiers (可選)
     */
    addToCart(product) {
      const existingItemIndex = this.cart.items.findIndex(
        item => item.id === product.id
      )

      if (existingItemIndex !== -1) {
        // 商品已存在，增加數量
        const existingItem = this.cart.items[existingItemIndex]
        this.cart.items[existingItemIndex] = {
          ...existingItem,
          quantity: Number(existingItem.quantity) + Number(product.quantity || 1)
        }
      } else {
        // 新增商品
        this.cart.items.push({
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
     * 更新折扣邏輯
     * @param {string} type - 折扣類型：'none' | 'percent' | 'amount'
     * @param {number} value - 折扣值（百分比或金額）
     */
    updateDiscount(type, value) {
      this.billing.discountType = type
      this.billing.discountValue = Number(value) || 0
    },

    /**
     * 重置所有狀態為初始值
     */
    resetOrder() {
      this.orderInfo = {
        orderId: null,
        tableNumber: null,
        diners: null,
        status: 'ordering'
      }

      this.cart = {
        items: []
      }

      this.billing = {
        discountType: 'none',
        discountValue: 0,
        serviceChargeRate: 0.1
      }

      this.payment = {
        receivedAmount: 0,
        details: [],
        isPaid: false
      }
    }
  }
})
