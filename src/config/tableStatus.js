/**
 * 桌位/訂單狀態定義
 * 使用數字表示狀態，便於系統處理和擴展
 */
export const TABLE_STATUS = {
  // 0: 未開桌（可執行開桌）
  AVAILABLE: 0,
  // 1: 已開桌（開始計時）
  OCCUPIED: 1,
  // 2: 提醒桌（接近用餐時間上限）
  WARNING: 2,
  // 3: 超時桌（超過用餐時間上限）
  OVERTIME: 3,
  // 4: 已結帳（已完成結帳）
  CHECKED_OUT: 4,
  // 5: 待清潔桌（不可開桌）
  CLEANING: 5,
  // 9: 預定桌（確認訂位資料後，可執行開桌）
  RESERVED: 9
}

/**
 * 狀態顯示文字映射
 */
export const STATUS_LABELS = {
  [TABLE_STATUS.AVAILABLE]: '未開桌',
  [TABLE_STATUS.OCCUPIED]: '已開桌',
  [TABLE_STATUS.WARNING]: '提醒桌',
  [TABLE_STATUS.OVERTIME]: '超時桌',
  [TABLE_STATUS.CHECKED_OUT]: '已結帳',
  [TABLE_STATUS.CLEANING]: '待清潔桌',
  [TABLE_STATUS.RESERVED]: '預定桌'
}

/**
 * 根據狀態數字獲取顯示文字
 */
export const getStatusLabel = (status) => {
  return STATUS_LABELS[status] || '未知狀態'
}

/**
 * 檢查狀態是否可選擇（可開桌）
 */
export const isStatusSelectable = (status) => {
  return status === TABLE_STATUS.AVAILABLE || status === TABLE_STATUS.RESERVED
}
