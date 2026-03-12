/**
 * 模擬假資料：預約桌資料（開發階段使用）
 *
 * 資料結構：陣列形式，支援同一桌多個預約
 *
 * @typedef {Object} ReserveDetail
 * @property {string} id - 預約序號（唯一）
 * @property {string} tableId - 桌位 ID（例如 "A5"）
 * @property {string} tableLabel - 顯示用的桌號名稱（例如 "A5 桌"）
 * @property {string} customerName - 預約人
 * @property {string} reserveTime - 預約時間
 * @property {number|string} dinerCount - 預約人數
 * @property {string} phone - 預約電話
 */

/** @type {ReserveDetail[]} */
export const MOCK_RESERVE_LIST = [
  {
    id: 'RES-A5-001',
    tableId: 'A5',
    tableLabel: 'A5 桌',
    customerName: '小火龍 先生',
    reserveTime: '12:30',
    dinerCount: 4,
    phone: '0923 123 456'
  },
  {
    id: 'RES-A5-002',
    tableId: 'A5',
    tableLabel: 'A5 桌',
    customerName: '皮卡丘 小姐',
    reserveTime: '14:00',
    dinerCount: 2,
    phone: '0912 345 678'
  }
]
