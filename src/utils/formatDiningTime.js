/**
 * 從 openTime (ISO) 計算用餐時間 HH:MM
 * @param {string} openTime - ISO 格式的開桌時間
 * @returns {string} HH:MM 格式的用餐時長
 */
export function formatDiningTime(openTime) {
  if (!openTime) return '00:00'
  try {
    const start = new Date(openTime).getTime()
    const elapsed = Date.now() - start
    const totalMinutes = Math.max(0, Math.floor(elapsed / 60000))
    const hours = Math.floor(totalMinutes / 60)
    const mins = totalMinutes % 60
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
  } catch {
    return '00:00'
  }
}
