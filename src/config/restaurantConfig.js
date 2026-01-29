/**
 * 餐廳用餐設定（給後端的溝通規格）
 *
 * - POS 只要吃「這間餐廳的設定」，就能決定：
 *   - Step1：有哪些區（A 區 / B 區 / 包廂…）、每區有幾桌
 *   - Step2：用餐人數要怎麼拆（總人數、大人/小孩/長者 或 男/女/小孩…）
 *   - Step3：這間餐廳還要問什麼額外資訊（聚餐用途、吃到飽方案、單點/吃到飽…）
 *
 * 建議由後端在「依餐廳、依分店」的 API 回傳一個 RestaurantConfig 給前端。
 */

/**
 * Step1：座位區設定
 * 例如：A 區 10 桌、B 區 5 桌，都應該由後端決定。
 *
 * @typedef {Object} TableArea
 * @property {string} key - 唯一識別（例如 'A', 'B', 'VIP'）
 * @property {string} label - 顯示名稱（例如 'A 區', 'B 區', 'VIP 包廂'）
 * @property {number} tableCount - 此區有幾桌（前端可用來畫桌子與檢查是否超出）
 */

/**
 * Step2：用餐人數 picker 設定
 *
 * @typedef {Object} DinerPickerItem
 * @property {string} key - 唯一識別（例如 'total'、'adult'、'child'…）
 * @property {string} label - 顯示名稱
 * @property {number[]} quickOptions - 快速選擇按鈕數值
 * @property {number} min - 最小值
 * @property {number} max - 最大值
 * @property {string} [unit='人'] - 單位
 * @property {boolean} [isPrimary] - 是否為主 picker（其值對應 modelValue / 訂單用餐人數）
 * @property {boolean} [showSeparatorAfter] - 是否在此 picker 下方顯示分隔線（由後端控制，用來區隔主 picker）
 * @property {number} [defaultValue] - 預設值（例如預設 2 人）
 */

/**
 * Step3 / Step4 共用：額外欄位設定（聚餐用途、吃到飽方案、單點/吃到飽…）
 *
 * 這裡只定義最常見的 select 類型，若之後需要文字輸入、checkbox 等型別可再擴充。
 *
 * @typedef {Object} ExtraFieldOption
 * @property {string} value - 實際儲存值
 * @property {string} label - 顯示文字
 *
 * @typedef {Object} ExtraField
 * @property {string} key - 唯一識別（例如 'purpose'、'planType'）
 * @property {string} label - 顯示名稱
 * @property {'select'} type - 欄位型別，目前先支援 select
 * @property {ExtraFieldOption[]} options - 選項
 * @property {string} [placeholder] - 無選擇時顯示文字
 * @property {boolean} [required] - 是否必填（由後端決定）
 * @property {boolean} [isMultiple=false] - 是否允許多選，預設為 false（單選）
 * @property {boolean} [isLargeBtn=false] - 此組選項是否為大寬度按鈕，預設小寬度
 */

/**
 * 整體餐廳設定，建議由後端依「餐廳 / 分店」回傳。
 *
 * @typedef {Object} RestaurantConfig
 * @property {string} restaurantId - 餐廳代號（例如 'A_RESTAURANT'）
 * @property {TableArea[]} tableAreas - Step1：座位區與桌數
 * @property {DinerPickerItem[]} dinerPickers - Step2：人數拆法（大人/小孩/長者 或 男/女/小孩…）
 * @property {ExtraField[]} extraFields - Step3：額外資訊（聚餐用途、方案…），使用與 Step4 相同的 ExtraField 格式
 * @property {ExtraField[]} [extraFields2] - Step4：額外資訊（用餐方案、其他選項…），使用與 Step3 相同的 ExtraField 格式與顯示樣式
 */

/**
 * 以下為「開發用範例」，實際上應該由後端 API 提供。
 * 你可以把這兩個當作後端未接好前的 mock。
 */

/** A 餐廳範例：需要 總人數（大人、小孩、長者）、聚餐用途、吃到飽方案 */
export const MOCK_RESTAURANT_A_CONFIG = {
  restaurantId: 'A_RESTAURANT',
  tableAreas: [
    { key: 'A', label: 'A 區', tableCount: 5 },
    { key: 'B', label: 'B 區', tableCount: 8 }
  ],
  dinerPickers: [
    {
      key: 'total',
      label: '總人數',
      quickOptions: [2, 4, 6],
      min: 0,
      max: 20,
      isPrimary: true,
      defaultValue: 2,
      showSeparatorAfter: true
    },
    { key: 'adult', label: '成人人數', quickOptions: [1, 2, 3], min: 0, max: 50 },
    { key: 'child', label: '小孩人數', quickOptions: [0, 1, 2], min: 0, max: 50 },
    { key: 'senior', label: '長者人數', quickOptions: [0, 1, 2], min: 0, max: 50 }
  ],
  extraFields: [
    {
      key: 'purpose',
      label: '聚餐用途',
      type: 'select',
      required: false,
      placeholder: '請選擇聚餐用途',
      options: [
        { value: 'business', label: '商務' },
        { value: 'family', label: '家庭' },
        { value: 'dating', label: '約會' },
        { value: 'friends', label: '朋友' },
        { value: 'festival', label: '節日紀念' }
      ]
    },
    {
      key: 'plan',
      label: '方案',
      type: 'select',
      required: true,
      // isMultiple: true, 這一組就會變成多選
      placeholder: '請選擇吃到飽方案',
      isLargeBtn: true,
      options: [
        { value: '999', label: '999 元吃到飽' },
        { value: '799', label: '799 元吃到飽' },
        { value: '599', label: '599 元吃到飽' }
      ]
    }
  ],
  // Step4：用餐方案按鈕
  extraFields2: [
    {
      key: 'purpose',
      label: '聚餐用途2222',
      type: 'select',
      required: false,
      placeholder: '請選擇聚餐用途',
      isLargeBtn: true,
      options: [
        { value: 'business', label: '商務聚餐' },
        { value: 'family', label: '家庭聚餐' },
        { value: 'dating', label: '約會聚餐' },
        { value: 'friends', label: '朋友聚餐' },
        { value: 'festival', label: '節日紀念' }
      ]
    }
  ]
}

/** B 餐廳範例：需要 總人數（男性、女性、小孩）、用餐方案（吃到飽 or 單點） */
export const MOCK_RESTAURANT_B_CONFIG = {
  restaurantId: 'B_RESTAURANT',
  tableAreas: [
    { key: 'MAIN', label: '主用餐區', tableCount: 15 },
    { key: 'ROOM', label: '包廂區', tableCount: 4 }
  ],
  dinerPickers: [
    {
      key: 'total',
      label: '總人數',
      quickOptions: [2, 4, 8],
      min: 0,
      max: 60,
      isPrimary: true,
      defaultValue: 2,
      showSeparatorAfter: true
    },
    { key: 'male', label: '男性', quickOptions: [1, 2, 3], min: 0, max: 60 },
    { key: 'female', label: '女性', quickOptions: [1, 2, 3], min: 0, max: 60 },
    { key: 'child', label: '小孩', quickOptions: [0, 1, 2], min: 0, max: 60 }
  ],
  extraFields: [
    {
      key: 'planType',
      label: '用餐方案',
      type: 'select',
      required: true,
      placeholder: '請選擇用餐方案',
      isLargeBtn: true,
      options: [
        { value: 'buffet_1788', label: '1788 吃到飽' },
        { value: 'a_la_carte', label: '單點' }
      ]
    }
  ],
  // Step4：用餐方案按鈕，可留空

}

/**
 * 開發階段的預設餐廳設定。
 * 真正串接時，請改成由後端 API 取得對應餐廳／分店的 RestaurantConfig。
 */
export const DEFAULT_RESTAURANT_CONFIG = MOCK_RESTAURANT_A_CONFIG

/**
 * 目前 Step2_DinerCount 使用的預設人數 picker。
 * 實際專案中，建議在進入流程前先呼叫後端 API 取得 RestaurantConfig，
 * 再把其中的 dinerPickers 傳給 Step2_DinerCount 使用。
 *
 * 這裡先用「A 餐廳」的設定當作預設值。
 */
export const DEFAULT_DINER_PICKER_CONFIG = MOCK_RESTAURANT_A_CONFIG.dinerPickers

