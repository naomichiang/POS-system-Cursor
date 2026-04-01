/**
 * 模擬假資料：整單折扣專案（開發階段使用）
 * 兩欄各自獨立的折扣專案，每欄 sections 的 buttons 建議數量為 1~3 個
 * discountRate: 折扣率，例如 8 折為 0.8、95 折為 0.95
 */
export const MOCK_GLOBAL_DISCOUNT_COLUMNS = [
  [ // 第一欄
    {
      title: '(銀)中信平日刷刷購',
      bg: 'yellow', // 專案區塊背景色
      description: '活動期間持中國信託指定信用卡於本百貨全館一般消費單筆滿 NT$2,000，即享 85 折優惠；週三單筆滿 NT$3,000 再享加碼 8 折回饋。部分專櫃及禮券、代收代售商品不適用，詳細以現場公告為準。',
      buttons: [
        { label: 'ㄧ二五 85 折', discountRate: 0.85 },
        { label: '週三 8 折', discountRate: 0.8 },
        { label: '週四 75折', discountRate: 0.75 },
      ],
    },
    {
      title: '(銀)台新VISA玫瑰卡',
      bg: 'blue',
      description: '台新銀行 VISA 玫瑰卡卡友於週末檔期，全館當日累積滿 NT$5,000 享 20% 回饋，累積滿 NT$10,000 再享 25% 加碼折扣。回饋以現金折抵結帳金額方式提供，每卡每日回饋上限 NT$3,000。',
      buttons: [
        { label: '太陽 20 %', discountRate: 0.8 },
        { label: '寰宇 25 %', discountRate: 0.75 },
      ],
    },
    {
      title: '(銀)星展JCB 刷卡 98 折',
      bg: 'red',
      description: '持星展銀行 JCB 卡於指定檔期來店消費，全館單筆滿 NT$1,000 享 98 折，單筆滿 NT$3,000 再享 85 折優惠。每筆交易限擇一優惠使用，不得與其他銀行卡友活動合併。',
      buttons: [
        { label: 'JCB 85折', discountRate: 0.85 },
        { label: 'JCB 85折', discountRate: 0.85 },
      ],
    },
  ],
  [ // 第二欄
    {
      title: '壽星優惠',
      bg: 'yellow',
      description: '當月壽星憑身分證件至 1F 服務台完成登錄，可享當日全館結帳金額 9 折優惠一次，單筆最高折抵金額 NT$2,000。化妝品、3C 商品及部分專櫃恕不配合，詳細限制請洽服務人員。',
      buttons: [{ label: '10%', discountRate: 0.9 }],
    },
    {
      title: '(金)玉山 Pi 卡',
      bg: 'green',
      description: '持玉山 Pi 卡於本百貨全館一般消費，當日單筆滿 NT$1,000 享 8 折；單筆滿 NT$2,000 享 75 折；單筆滿 NT$10,000 享 65 折。每卡每日最高折抵金額 NT$5,000，活動名額有限送完為止。',
      buttons: [
        { label: '滿千 8 折', discountRate: 0.8 },
        { label: '滿兩千 75折', discountRate: 0.75 },
        { label: '滿萬 65折', discountRate: 0.65 },
      ],
    },
  ],
]
