/**
 * 模擬假資料：整單折扣專案（開發階段使用）
 * 兩欄各自獨立的折扣專案，每欄 sections 的 buttons 建議數量為 1~3 個
 * discountRate: 折扣率，例如 8 折為 0.8、95 折為 0.95
 */
export const MOCK_GLOBAL_DISCOUNT_COLUMNS = [
  [
    {
      title: '(銀)中信刷刷購',
      bg: 'yellow',
      buttons: [
        { label: '中信 85 折', discountRate: 0.85 },
        { label: '中信 8 折', discountRate: 0.8 },
        { label: '中信 75折', discountRate: 0.75 },
      ],
    },
    {
      title: '(銀)台新VISA玫瑰卡 8 折',
      bg: 'blue',
      buttons: [
        { label: 'VISA 8 折', discountRate: 0.8 },
        { label: '- 25 %', discountRate: 0.75 },
      ],
    },
    {
      title: '(銀)JCB 刷卡 98 折',
      bg: 'red',
      buttons: [
        { label: 'VISA 85折', discountRate: 0.85 },
        { label: 'JCB 85折', discountRate: 0.85 },
        { label: 'JCB 85折', discountRate: 0.85 },
      ],
    },
  ],
  [
    {
      title: '壽星優惠',
      bg: 'yellow',
      buttons: [{ label: '壽星優惠', discountRate: 0.9 }],
    },
    {
      title: '(金)玉山 Pi 卡',
      bg: 'blue',
      buttons: [
        { label: 'Pi 8 折', discountRate: 0.8 },
        { label: 'Pi 75折', discountRate: 0.75 },
        { label: 'Pi 7 折', discountRate: 0.7 },
      ],
    },
  ],
]
