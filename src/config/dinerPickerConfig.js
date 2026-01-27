/**
 * 用餐人數 Picker 設定
 * 實際數量與內容由後端提供，此為預設／開發用設定。
 * 對接後端時可改為依桌位等參數呼叫 API 取得，再傳入 Step2_DinersCount。
 *
 * 每個 picker 設定格式：
 * @typedef {Object} DinerPickerItem
 * @property {string} key - 唯一識別
 * @property {string} label - 顯示名稱
 * @property {number[]} quickOptions - 快速選擇按鈕數值
 * @property {number} min - 最小值
 * @property {number} max - 最大值
 * @property {string} [unit='人'] - 單位
 * @property {boolean} [isPrimary] - 是否為主 picker（其值對應 modelValue / 訂單用餐人數）
 */

/** 預設 picker 設定（開發用，可改為從後端 API 取得） */
export const DEFAULT_DINER_PICKER_CONFIG = [
  { key: 'total', label: '總人數', quickOptions: [2, 4, 6], min: 0, max: 50, isPrimary: true },
  { key: 'adult', label: '成人', quickOptions: [1, 2, 3], min: 0, max: 50 },
  { key: 'child', label: '小孩', quickOptions: [0, 1, 2], min: 0, max: 50 },
  { key: 'male', label: '男性', quickOptions: [1, 2, 3], min: 0, max: 50 },
  { key: 'female', label: '女性', quickOptions: [1, 2, 3], min: 0, max: 50 },
  { key: 'senior', label: '老年人', quickOptions: [0, 1, 2], min: 0, max: 50 }
]
