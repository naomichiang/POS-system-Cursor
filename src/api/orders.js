/**
 * 訂單相關 API
 * 後端基於 WebSocket 廣播桌次更新，此處僅負責 REST 開桌（Create Order）
 */

const getBaseUrl = () => {
  const base = import.meta.env.VITE_API_BASE
  if (base) return base.replace(/\/$/, '')
  return ''
}

/**
 * 開桌：建立訂單（Create Order）
 * @param {Object} payload - 開桌資訊
 * @param {string} payload.tableNumber - 桌號（例如 'B1'）
 * @param {number} payload.diners - 用餐人數
 * @param {string} [payload.serviceType='dine-in'] - 用餐類型
 * @param {Object} [payload.customerInfo] - Step3 額外選項
 * @param {Object} [payload.customerInfo2] - Step4 額外選項
 * @returns {Promise<{ orderId: string, tableNumber: string, status: number, ... }>}
 */
export async function createOrder(payload) {
  const url = `${getBaseUrl()}/api/orders`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tableNumber: payload.tableNumber,
      diners: payload.diners,
      serviceType: payload.serviceType ?? 'dine-in',
      customerInfo: payload.customerInfo ?? {},
      customerInfo2: payload.customerInfo2 ?? {}
    })
  })

  if (!res.ok) {
    const err = new Error(`開桌失敗: ${res.status}`)
    err.status = res.status
    try {
      err.body = await res.json()
    } catch {
      err.body = await res.text()
    }
    throw err
  }

  return res.json()
}
