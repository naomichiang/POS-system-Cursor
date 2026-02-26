/**
 * 模擬假資料：已下單訂單資料（開發階段使用）
 * 以 tableId 為 Key，內容為該桌「已經送出給廚房」的餐點陣列
 */
export const MOCK_PLACED_ORDERS = {
  A2: [
    {
      cartItemId: 'item-001-mock',
      name: '黃金開口笑',
      price: 220,
      quantity: 1,
      status: 'placed', // 建議加上狀態位，方便在 UI 區隔已出餐
      modifiers: {
        optionSelections: {
          portion: 'small',
          spicy: 'none'
        },
        // 3. 這裡的結構必須跟商品定義的 optionGroups 一致，formatOptions 才能反查 Label
        displayGroups: [
          {
            key: 'portion',
            label: '份量',
            options: [
              { value: 'small', label: '小份' },
              { value: 'large', label: '大份' }
            ]
          },
          {
            key: 'spicy',
            label: '辣度',
            options: [
              { value: 'none', label: '不辣' },
              { value: 'mild', label: '小辣' }
            ]
          }
        ]
      }
    }
  ]
}
