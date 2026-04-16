# POS 系統 — Store、Composables、Utils

← [返回索引](../README.md)

---

## 一、useOrderStore（`src/stores/useOrderStore.js`）

Pinia store，管理訂單、購物車、支付與折扣的全域狀態。

### State

| 欄位 | 說明 |
|------|------|
| `currentOrder` | 由 `fetchOrderData()` 載入的結帳訂單（含 `tableInfo`、`items`、`summary`） |
| `selectedOrderItemIndex` | 帳單調整面板中目前選取的品項 index（對應 `currentOrder.items`） |
| `currentTableId` | 目前結帳桌號，供 getter 預設值使用 |
| `isLoading` | 是否正在載入訂單（UI 顯示「載入中...」） |
| `globalDiscount` | 套用中的整單折扣 `{ title, label, rate, amount }`，無折扣時為 `null` |
| `checkoutDraftRevision` | 帳單調整暫存版本號（與 [POS-api.md](POS-api.md) §7 GET／PUT 的 `revision` 對齊），`resetOrder` 時清空 |
| `paymentDraftRevision` | 結帳頁「已收／付款明細」暫存版本（`paymentRevision`／`savePaymentDraft`），`resetOrder` 時清空 |
| `orderInfo` | 開桌資訊：`orderId`、`tableNumber`、`diners`、`status`、`serviceType`、`customerInfo`、`customerInfo2` |
| `cart.items` | 購物車（未下單）品項陣列，每筆含 `cartItemId`、`id`、`name`、`price`、`quantity`、`note`、`modifiers` |
| `placedItems` | 已下單品項陣列（已送廚房，加點時顯示） |
| `payment` | 支付資訊：`receivedAmount`、`details`（支付方式陣列）、`isPaid` |

### Getters

| Getter | 說明 |
|--------|------|
| `subtotal` | 購物車（未下單）所有品項小計加總 |
| `placedSubtotal` | 已下單品項小計加總 |
| `totalAmount` | `placedSubtotal + subtotal`（購物車模式用） |
| `billTotalForCheckout` | 結帳應付總額。已載入 `currentOrder` 時以 `summary.totalAmount + globalDiscount.amount` 為準；否則回傳 `totalAmount` |
| `changeAmount` | `payment.receivedAmount - billTotalForCheckout`，最小為 0 |
| `orderInfoForDisplay` | 整合 `tableInfo` 與 `summary`，供結帳頁元件讀取（含 `tableNumber`、`diners`、`status`、`statusLabel`、`diningTime`、`totalItems`、`totalAmount`） |

### Actions

**購物車操作**：

| Action | 說明 |
|--------|------|
| `addToCart(product)` | 依 `aggregationStrategy` 決定 merge 或 split 寫入購物車 |
| `removeFromCart(cartItemId)` | 依 `cartItemId` 精準刪除單一品項 |
| `clearCart()` | 清空購物車 |
| `setPlacedItems(items)` | 設定已下單品項（加點時從 API 或 mock 載入） |

**開桌操作**：

| Action | 說明 |
|--------|------|
| `setTable(tableData)` | 一次性寫入開桌資訊至 `orderInfo`（確認開桌時呼叫） |

**折扣操作**：

| Action | 說明 |
|--------|------|
| `setSelectedOrderItem(index)` | 設定/切換選取品項，再次點擊同一筆則取消選取 |
| `applyDiscountToSelectedItem(payload)` | 對選取品項套用折扣，payload 格式：`{ type, label, value? }` |
| `clearDiscountFromSelectedItem()` | 清除選取品項的折扣，小計恢復為「單價 × 數量」 |
| `applyGlobalDiscount({ title, label, rate })` | 計算整單折扣並寫入 `globalDiscount`；同時清空 `selectedOrderItemIndex` |
| `clearGlobalDiscount()` | 移除整單折扣 |

**折扣 payload.type 對照**：

| type | 行為 |
|------|------|
| `'gift'` / `'complimentary'` / `'delete'` | 小計設為 0，`isGift = true` |
| `'percentage'` | `Math.round(baseSubtotal × value/100)` |

**資料載入與重置**：

| Action | 說明 |
|--------|------|
| `fetchOrderData(tableId, { force? })` | 呼叫 `getCheckoutDraft`（目前為 mock，見 `src/api/orders.js`）灌入 `currentOrder`、`globalDiscount`、`checkoutDraftRevision`；若回傳含 `payment` 則同步 `payment` 與 `paymentDraftRevision`；同桌且已有訂單且未 `force` 時跳過重新載入 |
| `resetOrder()` | 重置所有 state 為初始值（結帳完成後呼叫） |

**內部私有方法**：

| 方法 | 說明 |
|------|------|
| `_generateCartItemId(product)` | 生成購物車品項唯一 ID（`crypto.randomUUID` 或時戳備用） |
| `_isSameProductAndCustomization(item, product)` | 判斷兩筆是否為同商品且客製化相同（供 merge 模式比對） |
| `_recalculateCurrentOrderSummary()` | 遍歷 `currentOrder.items`，重算 `summary.totalItems` 與 `summary.totalAmount` |

---

## 二、useTableSyncStore（`src/stores/useTableSyncStore.js`）

管理全系統桌位狀態的即時同步。詳見 [POS-table-selection.md](POS-table-selection.md#二多裝置狀態同步)。

---

## 三、useScrollControls.ts（`src/composables/`）

提供垂直或水平捲動的共用控制邏輯，由 `BillAdjustPanel`、`QtyBar`、`ItemSideMenu` 等多個元件引用。

**使用場景**：

| 使用位置 | axis | step | 文件 |
|---------|------|------|------|
| BillAdjustPanel | `vertical` | 200 | [POS-bill.md](POS-bill.md) |
| QtyBar（OptGroup 捲動） | `vertical` | 150 | [POS-order.md](POS-order.md) |
| CatTabs | `horizontal` | 200 | [POS-order.md](POS-order.md) |

**參數**：

| 參數 | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| `scrollEl` | `Ref<HTMLElement \| null>` | — | 要監控的捲動容器 DOM ref |
| `axis` | `'vertical' \| 'horizontal'` | `'vertical'` | 捲動方向 |
| `step` | Number | `200` | 每次捲動的像素步長 |
| `threshold` | Number | `5` | 判定頂/底部邊界的容差像素 |

**回傳值**：

| 回傳 | 說明 |
|------|------|
| `showArrows` | 是否需要顯示方向按鈕（內容超出容器） |
| `isAtStart` | 是否到達頂端（垂直）或左端（水平） |
| `isAtEnd` | 是否到達底端或右端 |
| `scrollPrev()` | 向上/左捲動；距邊界 < 步長時直接捲到邊界 |
| `scrollNext()` | 向下/右捲動；同上 |
| `updateScrollState()` | 手動重新計算狀態（切換商品後需 nextTick 延遲調用） |

**生命週期**：`watch(scrollEl)` 自動綁定 scroll 事件與 ResizeObserver；`onUnmounted` 自動清理，避免記憶體洩漏。

---

## 四、formatDiningTime.js（`src/utils/`）

```js
formatDiningTime(openTime: string) → string  // 'HH:MM'
```

**使用場景**：

| 使用位置 | 文件 |
|---------|------|
| `orderInfoForDisplay` getter（useOrderStore） | 本文件 |
| BillAdjustPanel header `diningTime` | [POS-bill.md](POS-bill.md) |

- 輸入：ISO 格式的開桌時間（`tableInfo.openTime`）
- 輸出：從開桌到當下的經過時長，格式 `HH:MM`（例如 `01:23`）
- 異常處理：`openTime` 為空或解析失敗時回傳 `'00:00'`
