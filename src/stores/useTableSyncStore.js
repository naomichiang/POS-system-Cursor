import { defineStore } from 'pinia'
import { TABLE_STATUS } from '../config/tableStatus'

/**
 * 桌次同步 Store：存放各桌即時狀態，並訂閱 WebSocket 以接收後端廣播
 * - A 平板開桌後，後端寫入 DB 並廣播 → B 平板收到 WS 更新，桌次頁該桌號變色且不可再開桌
 */
export const useTableSyncStore = defineStore('tableSync', {
  state: () => ({
    /** 桌號 -> 狀態 (TABLE_STATUS)，未在 map 內視為 0 未開桌 */
    tableStatusMap: {},
    /** WebSocket 連線狀態 */
    wsConnected: false,
    /** WebSocket 實例（僅內部使用） */
    _ws: null
  }),

  getters: {
    /** 取得指定桌號狀態，預設 0（未開桌） */
    getTableStatus: (state) => (tableId) => {
      return state.tableStatusMap[tableId] ?? TABLE_STATUS.AVAILABLE
    }
  },

  actions: {
    /**
     * 單筆更新桌位狀態（API 成功後本地更新，或收到 WS 時呼叫）
     * @param {string} tableId - 桌號，例如 'B1'
     * @param {number} status - TABLE_STATUS
     */
    setTableStatus(tableId, status) {
      if (!tableId) return
      this.tableStatusMap = { ...this.tableStatusMap, [tableId]: status }
    },

    /**
     * 批次更新桌位狀態（後端可一次回傳多桌）
     * @param {Record<string, number>} map - 桌號 -> 狀態
     */
    setTableStatusBatch(map) {
      if (!map || typeof map !== 'object') return
      this.tableStatusMap = { ...this.tableStatusMap, ...map }
    },

    /**
     * 處理後端 WebSocket 訊息
     * 預期格式：{ type: 'table_updated', tableId: 'B1', status: 1 } 或
     *          { type: 'order_created', tableNumber: 'B1', status: 1 }
     */
    handleWsMessage(payload) {
      if (!payload || typeof payload !== 'object') return
      const type = payload.type
      const tableId = payload.tableId ?? payload.tableNumber
      const status = payload.status

      if (type === 'table_updated' || type === 'order_created') {
        if (tableId != null && status != null) {
          this.setTableStatus(String(tableId), Number(status))
        }
      }
    },

    /**
     * 建立 WebSocket 連線並訂閱桌次更新
     * 僅在設定 VITE_WS_URL 時連線；開發階段未設定則不連線，避免連到 Vite 的 port 噴錯
     * 後端需廣播：{ type: 'table_updated' | 'order_created', tableId/tableNumber, status }
     */
    connectWs() {
      if (this._ws?.readyState === WebSocket.OPEN) return

      const wsUrl = getWsUrl()
      if (!wsUrl) return

      let ws
      try {
        ws = new WebSocket(wsUrl)
      } catch (e) {
        console.warn('[TableSync] WebSocket 連線失敗:', e)
        return
      }

      this._ws = ws
      ws.onopen = () => {
        this.wsConnected = true
      }
      ws.onclose = () => {
        this.wsConnected = false
        this._ws = null
      }
      ws.onerror = () => {
        // 不噴 console，避免開發時無後端 WS 一直刷錯誤
      }
      ws.onmessage = (event) => {
        try {
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
          this.handleWsMessage(data)
        } catch (_) {
          // ignore parse error
        }
      }
    },

    /** 關閉 WebSocket */
    disconnectWs() {
      if (this._ws) {
        this._ws.close()
        this._ws = null
      }
      this.wsConnected = false
    }
  }
})

/** 僅在設定 VITE_WS_URL 時回傳 URL；未設定則不連線（開發階段無後端 WS 時不噴錯） */
function getWsUrl() {
  const base = import.meta.env.VITE_WS_URL
  if (base && String(base).trim()) return String(base).trim()
  return null
}
