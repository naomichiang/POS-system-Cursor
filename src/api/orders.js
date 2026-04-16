/**
 * 訂單相關 API
 * 後端基於 WebSocket 廣播桌次更新，此處僅負責 REST 開桌（Create Order）
 *
 * 帳單調整／暫存契約見 docs/POS-api.md §7。下列 `getCheckoutDraft` / `saveCheckoutDraft`
 * 目前為 mock，串接後改為實際 `fetch` 即可。
 */

import { MockOrder001 } from '@/mock/orderMock'

/**
 * @typedef {Object} CheckoutTableInfo
 * @property {string} [tableNumber]
 * @property {number} [diners]
 * @property {number} [status]
 * @property {string} [openTime]
 */

/**
 * @typedef {Object} CheckoutLineItem
 * @property {string} [lineId]
 * @property {string} name
 * @property {number} unitPrice
 * @property {number} quantity
 * @property {number} subtotal
 * @property {boolean} [isGift]
 * @property {string} [discountLabel]
 * @property {string} [discountType]
 * @property {number} [discountValue]
 */

/**
 * @typedef {Object} CheckoutGlobalDiscount
 * @property {string} [title]
 * @property {string} [label]
 * @property {number} [rate]
 * @property {number} [amount]
 */

/**
 * GET /api/v1/.../checkout 回傳（見 POS-api.md §7.1）
 * @typedef {Object} CheckoutDraftGetResponse
 * @property {string} orderId
 * @property {CheckoutTableInfo} tableInfo
 * @property {CheckoutLineItem[]} items
 * @property {{ totalItems?: number, subtotal?: number, totalAmount?: number }} summary
 * @property {CheckoutGlobalDiscount | null} [globalDiscount]
 * @property {number|string} [revision]
 * @property {string} [updatedAt]
 * @property {{ details: Array<{ type: string, amount: number }>, receivedAmount: number }} [payment] - 結帳頁已收／付款明細（mock 與 GET 一併回傳）
 * @property {number|string} [paymentRevision] - 付款暫存版本號
 */

/**
 * 結帳頁暫存「已收金額／付款明細」PUT body
 * @typedef {Object} PaymentDraftSavePayload
 * @property {string} [orderId]
 * @property {string} [tableId]
 * @property {Array<{ type: string, amount: number }>} details
 * @property {number} receivedAmount
 * @property {number|string} [revision]
 */

/**
 * @typedef {Object} PaymentDraftSaveResponse
 * @property {number|string} [revision]
 * @property {string} [updatedAt]
 */

/**
 * PUT 暫存 request body（見 POS-api.md §7.2）
 * @typedef {Object} CheckoutDraftSavePayload
 * @property {string} [orderId]
 * @property {string} [tableId]
 * @property {string} [tableNumber]
 * @property {CheckoutLineItem[]} items
 * @property {CheckoutGlobalDiscount | null} [globalDiscount]
 * @property {number|string} [revision]
 */

/**
 * PUT 暫存成功回傳（見 POS-api.md §7.2）
 * @typedef {Object} CheckoutDraftSaveResponse
 * @property {number|string} [revision]
 * @property {string} [updatedAt]
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

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 取得該桌帳單調整用訂單（含暫存折扣）；串接後改為 GET 真實端點。
 * @param {string} [tableId] - 路由桌號（如 `A2`）
 * @returns {Promise<CheckoutDraftGetResponse>}
 */
export async function getCheckoutDraft(tableId) {
  await delay(200)
  const tid = tableId != null && tableId !== '' ? String(tableId) : MockOrder001.tableInfo.tableNumber
  return {
    orderId: MockOrder001.orderId,
    tableInfo: {
      ...MockOrder001.tableInfo,
      tableNumber: tid
    },
    items: MockOrder001.items.map((item) => ({ ...item })),
    summary: { ...MockOrder001.summary },
    globalDiscount: null,
    revision: 1,
    updatedAt: new Date().toISOString(),
    payment: {
      details: [],
      receivedAmount: 0
    },
    paymentRevision: 1
  }
}

/**
 * 將目前 Pinia `useOrderStore` 狀態組成暫存 payload（供 `saveCheckoutDraft`）。
 * @param {{ currentOrder: object | null, globalDiscount: CheckoutGlobalDiscount | null, checkoutDraftRevision?: number|string|null }} orderStore - `useOrderStore()` 實例
 * @param {string} [tableId] - 路由 `params.tableId`
 * @returns {CheckoutDraftSavePayload}
 */
export function buildCheckoutDraftPayload(orderStore, tableId) {
  const co = orderStore.currentOrder
  const tid = tableId != null && tableId !== '' ? String(tableId) : ''
  /** @type {CheckoutDraftSavePayload} */
  const payload = {
    orderId: co?.orderId ?? null,
    tableId: tid,
    tableNumber: co?.tableInfo?.tableNumber ?? (tid || undefined),
    items: Array.isArray(co?.items) ? co.items.map((item) => ({ ...item })) : [],
    globalDiscount: orderStore.globalDiscount
      ? { ...orderStore.globalDiscount }
      : null
  }
  if (orderStore.checkoutDraftRevision != null) {
    payload.revision = orderStore.checkoutDraftRevision
  }
  return payload
}

/**
 * 暫存帳單調整；串接後改為 PUT 真實端點。
 * @param {CheckoutDraftSavePayload} payload
 * @returns {Promise<CheckoutDraftSaveResponse>}
 */
export async function saveCheckoutDraft(payload) {
  if (import.meta.env.DEV) {
    console.debug('[saveCheckoutDraft mock]', payload)
  }
  await delay(400)
  const prev = Number(payload.revision)
  const nextRevision = Number.isFinite(prev) ? prev + 1 : 1
  return {
    revision: nextRevision,
    updatedAt: new Date().toISOString()
  }
}

/**
 * 將結帳頁目前 `payment` 組成暫存 payload（供 `savePaymentDraft`）。
 * @param {{ currentOrder: object | null, payment: { details: Array, receivedAmount: number }, paymentDraftRevision?: number|string|null }} orderStore
 * @param {string} [tableId]
 * @returns {PaymentDraftSavePayload}
 */
export function buildPaymentDraftPayload(orderStore, tableId) {
  const tid = tableId != null && tableId !== '' ? String(tableId) : ''
  /** @type {PaymentDraftSavePayload} */
  const payload = {
    orderId: orderStore.currentOrder?.orderId ?? null,
    tableId: tid,
    details: Array.isArray(orderStore.payment?.details)
      ? orderStore.payment.details.map((p) => ({ ...p }))
      : [],
    receivedAmount: Number(orderStore.payment?.receivedAmount) || 0
  }
  if (orderStore.paymentDraftRevision != null) {
    payload.revision = orderStore.paymentDraftRevision
  }
  return payload
}

/**
 * 暫存結帳頁已收／付款明細；串接後改為 PUT 真實端點。
 * @param {PaymentDraftSavePayload} payload
 * @returns {Promise<PaymentDraftSaveResponse>}
 */
export async function savePaymentDraft(payload) {
  if (import.meta.env.DEV) {
    console.debug('[savePaymentDraft mock]', payload)
  }
  await delay(400)
  const prev = Number(payload.revision)
  const nextRevision = Number.isFinite(prev) ? prev + 1 : 1
  return {
    revision: nextRevision,
    updatedAt: new Date().toISOString()
  }
}
