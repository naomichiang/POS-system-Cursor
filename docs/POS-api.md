# POS 系統 — API 規格

← [返回索引](../README.md)

---

## 一、現有 REST 實作（`src/api/orders.js`）

### `createOrder(payload)` → POST `/api/orders`

開桌時呼叫，建立新訂單。

| Payload 欄位 | 型別 | 說明 |
|-------------|------|------|
| `tableNumber` | String | 桌號（例如 `'B1'`） |
| `diners` | Number | 用餐人數 |
| `serviceType` | String | 預設 `'dine-in'` |
| `customerInfo` | Object | Step 3 額外選項（extraFields preferences） |
| `customerInfo2` | Object | Step 4 額外選項（extraFields2 preferences） |

- **環境變數**：透過 `VITE_API_BASE` 設定 base URL；未設定時以相對路徑發送
- **錯誤處理**：HTTP 非 200 時拋出含 `status` 與 `body` 屬性的 Error
- **回傳**：後端回傳的訂單物件（含 `orderId`、`tableNumber`、`status` 等）

---

## 二、API 需求規格（待串接）

### 1. 初始化資料

**時機**：APP 啟動或重新整理頁面時

### 2. 桌位狀態同步（Table Management）

**時機**：進入桌次頁、收到 WebSocket 通知時

- `GET /api/v1/tables`
  - 狀態碼對接：0-未開桌, 1-用餐中, 9-預定桌...（詳見 [POS-config.md](POS-config.md)）
  - WS 推送格式：`{ "type": "table_updated", "tableId": "B1", "status": 1 }`

### 3. 開桌與預約（Check-in & Reservation）

**時機**：店員點擊桌位並提交開桌資訊時

- `GET /api/v1/reservations`：取得當日預約清單（欄位需含 `id` 供帶位識別）
- `POST /api/v1/reservations/{id}/check-in`：執行帶位，將預約轉為訂單
- `POST /api/v1/orders/open-table`：建立新訂單（非預約客）

### 4. 提交訂單與結帳（Order & Checkout）

**時機**：點擊點餐頁「送出」、結帳頁「完成結帳」時

- `POST /api/v1/orders/{orderId}/items`：增點品項（需處理 `cartItemId` 唯一性）
- `POST /api/v1/orders/{orderId}/pay`：提交支付明細（支援多筆支付方式加總）

### 5. 讀取已下單品項（Fetch Placed Items）

**時機**：進入點餐頁（`/order/:tableId`）或執行加點時

- `GET /api/v1/orders/{tableId}/items`
  - 回傳該桌位「已送出」的所有品項
  - 前端將其併入 OrderPanel 顯示，並鎖定修改權限

### 6. 增點品項（Add Items to Order）

**時機**：已開桌狀態下，點擊點餐頁「送出」時

- `POST /api/v1/orders/{tableId}/items`
  - 僅發送購物車中 `status !== 'placed'` 的新選品項
  - 後端寫入成功後，回傳更新後的完整品項清單

### 7. 帳單調整與暫存（Bill Adjust & Checkout Draft）

**情境**：店員 A 於帳單調整頁（`/bill-adjust/:tableId`）對品項設定招待／折扣等後點「暫存」；之後店員 B 自桌次頁進入同一桌帳單調整頁，需看到**已還原的暫存內容**（含單品招待、整單折扣等）。

**原則**：

- **權威資料在後端**：暫存必須持久化，不能只存在前端 [useOrderStore](POS-store.md)（記憶體）。
- **前端 store**：進頁時以 API 回應灌入 `currentOrder`、`globalDiscount` 等，作為畫面工作副本。

#### 7.1 讀取：進入帳單調整頁

**時機**：`BillAdjustPage` `onMounted`（或路由進入時）

**建議端點**（路徑與方法需與後端拍板，下列為提案）：

- `GET /api/v1/orders/by-table/{tableId}/checkout`
  - 或 `GET /api/v1/orders/{orderId}`（若路由僅帶 `orderId`）

**回傳**：需能還原下列前端結構（與 [orderMock](../src/mock/orderMock.js)／store 欄位對齊，欄位名稱可與後端統一後由前端做 normalize）。

| 回傳欄位（建議） | 型別 | 說明 |
|-----------------|------|------|
| `orderId` | String | 訂單識別，暫存與結帳 API 使用 |
| `tableInfo` | Object | `tableNumber`、`diners`、`status`、`openTime` 等（與現有畫面一致） |
| `items` | Array | 明細列，見下表「品項列」 |
| `summary` | Object | `totalItems`、`subtotal`、`totalAmount` 等（或由後端只給明細、約定由誰重算） |
| `globalDiscount` | Object \| null | 整單折扣；無則 `null` |
| `revision` | Number 或 String | （可選）版本號，供暫存衝突偵測 |
| `updatedAt` | String (ISO-8601) | （可選）最後更新時間 |

**品項列 `items[]`（與前端調整邏輯對齊）**：

| 欄位 | 型別 | 說明 |
|------|------|------|
| `lineId` | String | （強烈建議）後端穩定列識別；招待／折價以列為單位對應，避免僅依陣列 index |
| `name` | String | 品項名稱 |
| `unitPrice` | Number | 單價 |
| `quantity` | Number | 數量 |
| `subtotal` | Number | 該列小計 |
| `isGift` | Boolean | 是否為招待等致小計為 0 之情境 |
| `discountLabel` | String | 顯示用標籤（例如：招待） |
| `discountType` | String | 例如：`gift`、`complimentary`、`delete`、`percentage`（與前端 `applyDiscountToSelectedItem` 一致） |
| `discountValue` | Number | 例如百分比折扣時之數值 |

**`globalDiscount`（可為 `null`）**：

| 欄位 | 型別 | 說明 |
|------|------|------|
| `title` | String | 例如：整單折扣 |
| `label` | String | 顯示用 |
| `rate` | Number | 折扣係數（與現有 store 一致） |
| `amount` | Number | 折讓金額（通常為負數或依約定） |

#### 7.2 寫入：點擊「暫存」

**時機**：帳單調整頁底部次要按鈕「暫存」（`BillActionFooter` → `second-click`）

**建議端點**（提案）：

- `PUT /api/v1/orders/{orderId}/checkout-draft`
  - 若後端以桌號為主鍵，可改為 `PUT /api/v1/tables/{tableId}/checkout-draft`（需與 7.1 讀取路徑一致）

**Request body（建議）**：

| 欄位 | 型別 | 說明 |
|------|------|------|
| `orderId` | String | 與路徑一致時可省略 body 內重複 |
| `tableNumber` 或 `tableId` | String | 與路由／桌次一致（依專案慣例擇一） |
| `items` | Array | 與 7.1 品項列結構相同；**建議每列含 `lineId`** |
| `globalDiscount` | Object \| null | 與 7.1 相同；`null` 表示清除整單折扣 |
| `revision` | Number 或 String | （可選）若與上次 GET 相同則樂觀鎖；不符時回 `409` |

**回傳**（建議）：

- `200`：成功，可回傳更新後 `revision`、`updatedAt` 與（可選）完整訂單快照，供前端更新 store。

**錯誤**：

- `409 Conflict`：版本衝突；body 建議含最新訂單或錯誤碼，前端應提示並重新執行 GET。

#### 7.3 與前端 store 對應（供實作對齊）

| 後端／API | 前端 [useOrderStore](POS-store.md) |
|-----------|-----------------------------------|
| 完整訂單 JSON | `currentOrder`（含 `orderId`、`tableInfo`、`items`、`summary`） |
| 整單折扣 | `globalDiscount` |
| 讀取失敗或空桌 | 依產品顯示空狀態或錯誤提示 |
| `payment`、`paymentRevision`（建議與 GET 一併） | `payment.details`、`payment.receivedAmount`、`paymentDraftRevision` |

#### 7.4 結帳頁「已收／付款明細」暫存（Bill Pay）

**時機**：結帳支付頁（`/bill-pay/:tableId`）底部「暫存」— 與帳單調整暫存分開，**只持久化已輸入的收款**（`payment.details`、加總後之 `receivedAmount`）。

**前端 mock**：`src/api/orders.js` 的 `buildPaymentDraftPayload`、`savePaymentDraft`；載入時可由 `getCheckoutDraft` 回傳的 `payment`、`paymentRevision` 還原（見上表）。

**建議後端**（需拍板）：

- 與 **7.1 GET** 合併回傳 `payment`、`paymentRevision`，或獨立 `GET .../payment-draft`。
- **PUT** 暫存：`details[]`（每筆含支付方式 `type`、金額 `amount`）、`receivedAmount`、`revision`（樂觀鎖）；成功回傳新 `paymentRevision`。

---

## 三、關鍵資料流說明

### 寫入時機（Local vs Global）

| 流程 | 何時寫入全域 |
|------|------------|
| 開桌流程 | 前端用 `formData`（Local State）暫存，**只有在最後一步點擊「確認開桌」**時，才呼叫 API 並寫入 [useOrderStore](POS-store.md) |
| 點餐流程 | 點擊「加入」僅進入前端購物車，**點擊右側面板「送出」時**，才正式發送 API 給後端 |
| 帳單調整／暫存 | 進入 `/bill-adjust/:tableId` 時 **GET** 載入（含暫存）；點「暫存」時 **PUT** 寫入後端；**不可**僅依前端記憶體作為跨店員唯一來源 |

---

## 四、下一步（前端／後端協作）

1. **後端**：確認 7.1／7.2 的**正式 URL、方法、路徑參數**（`orderId` vs `tableId`）與錯誤碼（含 `409` body 格式）。
2. **後端**：確認品項是否提供穩定 **`lineId`**；若否，需約定「以何種鍵」對應招待／折價列，避免僅用陣列 index。
3. **前端**：在 `src/api/orders.js` 新增對應函式（GET 載入、PUT 暫存），並於 `useOrderStore` 內串接、必要時新增 `normalizeOrderFromApi`。
4. **前端**：於 `BillAdjustPage` 綁定 `@second-click` → 呼叫暫存 API；成功／失敗提示；`409` 時引導重新載入。
5. **共同**：釐清「暫存」與「已結帳」狀態邊界，以及結帳完成後是否由現有 `POST .../pay` 清空草稿（或後端自動處理）。

