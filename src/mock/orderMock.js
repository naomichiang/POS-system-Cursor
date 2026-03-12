/**
 * 模擬後端 API 回傳的訂單資料
 * 用於開發階段模擬 fetchOrderData 的資料流程
 */
export const MockOrder001 = {
  orderId: 'ORD-20260312-001',
  tableInfo: {
    tableNumber: 'A2',
    diners: 8,
    status: 1,
    openTime: '2026-03-12T14:30:00Z'
  },
  items: [
    { name: '豬肉炒飯', unitPrice: 250, quantity: 1, subtotal: 250, isGift: false },
    { name: '牛肉丼飯', unitPrice: 280, quantity: 2, subtotal: 560, isGift: false },
    { name: '味噌湯', unitPrice: 80, quantity: 1, subtotal: 0, isGift: true },
    { name: '可樂', unitPrice: 60, quantity: 2, subtotal: 120, isGift: false },
    { name: '茶碗蒸', unitPrice: 120, quantity: 1, subtotal: 120, isGift: false }
  ],
  summary: {
    totalItems: 7,
    subtotal: 1050,
    totalAmount: 1050
  }
}
