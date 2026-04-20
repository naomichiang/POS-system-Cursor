# POS 系統 — 結帳頁面

← [返回索引](../README.md)

結帳流程分兩頁：
1. **BillAdjustPage**（`/bill-adjust/:tableId`）：帳單審閱、折扣調整、招待、刪除
2. **BillPayPage**（`/bill-pay/:tableId`）：付款計算、找零確認、結案

兩頁共用 [BillActionFooter.vue](POS-layout.md#billactionfooter-vue)。

---

## 一、結帳調整頁（BillAdjustPage）

### 1. BillAdjustPanel.vue — 右側明細欄

位於調整頁右側，顯示當前訂單明細與折扣後金額。**只讀，不提供互動按鈕**。

**資料來源（via [useOrderStore](POS-store.md)）**：

- `orderInfoForDisplay`：桌號、用餐人數、狀態顏色、用餐時間、合計金額、品項總數
- `currentOrder.items`：品項列表

**Header 顯示**：

- 桌號：「`{{ tableNumber }}桌`」，置於深色底（`bg-layer-dark-primary`）
- 狀態底色：依 `order.status` 對照 [TABLE_STATUS](POS-config.md)（詳見 [POS-config.md](POS-config.md#桌位狀態碼table_status)）
- `statusLabel`：由 store 統一計算，無值時顯示「查詢中」
- `diners`：人頭數字 + 人物 icon
- `diningTime`：用餐時長（`formatDiningTime`，詳見 [POS-store.md](POS-store.md#formatdiningtimejs)）

**品項列表**：

- `v-for` 逐行渲染，點擊任一列 → `orderStore.setSelectedOrderItem(index)` → 背景色 `bg-layer-highlight-yellow` + 左側色條
- `selectedOrderItemIndex` 由 store 管理，供 ItemAdjust.vue 共用

**列表顯示順序**：

`displayItems` 固定順序為：
1. 整單折扣（`globalDiscount`，若有）
2. 追加金額（`surcharge`，依新增先後排列）
3. 一般商品（`order-item`）

**序號規則**：`globalDiscount`、`surcharge` 顯示 `-`；僅 `order-item` 參與連號（1, 2, 3…）。

**整單折扣列（GlobalDiscount Item）**：

- 背景色：`bg-red-50`；名稱為紅色文字
- 顯示「刪除折扣」按鈕 → `orderStore.clearGlobalDiscount()`
- 不參與品項選取

**追加金額列（Surcharge Item）**：

- 來源：`orderStore.surchargeItems`，轉為 `{ type: 'surcharge', cartItemId: 'surcharge-${id}', name, amount, id }`
- 第一行：左側品項名稱、右側金額 + `$` icon（樣式與一般商品一致）
- 第二行：顯示「刪除」按鈕 → `orderStore.removeSurchargeItem(item.id)`
- 不參與品項選取

**金額顯示規則**：

| 情況 | 單價欄位 | 小計欄位 |
|------|---------|---------|
| 正常品項 | 正常顯示 + `$` icon | `subtotal.toLocaleString()` |
| 有折扣/招待 | 灰色 + 刪除線（原價參考） | `isGift` 時固定顯示 `0` |

**折扣標籤文案邏輯（`getDiscountDisplay`）**：

| 條件 | 顯示文案 |
|------|---------|
| `discountType === 'percentage'`，value = 90 | 九折 |
| value = 80 | 八折 |
| value = 70 | 七折 |
| value = 60 | 六折 |
| value = 50 | 五折 |
| 其他數值 | `${value}折`（如 85 → 85折） |
| 非 percentage 型別 | 直接顯示 `discountLabel`（如「員工價」） |

**捲動控制**：使用 [useScrollControls](POS-store.md#usescrollcontrolsts)，`step: 200`，`axis: 'vertical'`。

---

### 2. GlobalAdjust.vue — 整單折扣網格

位於 BillAdjustPage 左側主區，展示折扣專案供店員套用整單折扣。

**資料來源**：`MOCK_GLOBAL_DISCOUNT_COLUMNS`（`src/mock/MockGlobalDiscount.js`，正式串接後由 API 提供）

**版面結構**：雙欄 Grid，每欄獨立捲動；每個 `section`（折扣專案）包含標題 + 折扣按鈕組，背景色可設 yellow / blue / red / green。

**互動流程**：

1. 點擊折扣按鈕 → 觸發確認 [BaseModal](POS-layout.md#basemodal-vue)（`isConfirmOpen = true`）
2. 彈窗顯示折扣前、折扣金額、折扣後三行金額預覽
3. 可展開「查看詳細」accordion 顯示活動說明（高度 386px → 504px）
4. 確認套用 → `emit('apply-discount', { title, label, rate })` → 父層呼叫 `orderStore.applyGlobalDiscount()`
5. 套用後 `selectedOrderItemIndex` 自動清空

**折扣計算邏輯**：

| 欄位 | 說明 |
|------|------|
| `currentBillTotal` | `currentOrder.summary.totalAmount` |
| `discountRate` | 按鈕的 `discountRate`（例如 0.85） |
| `discountedTotal` | `Math.round(currentBillTotal × discountRate)` |
| `discountAmount` | `discountedTotal - currentBillTotal`（負值） |

---

### 3. ItemAdjust.vue — 單品折扣操作網格

2 欄 × 8 列固定操作網格，對 `selectedOrderItemIndex` 所指品項套用折扣或動作。

**按鈕清單**：

| 按鈕 | type | 說明 |
|------|------|------|
| 招待 | `action / complimentary` | 小計設 0，`isGift = true`，標籤「招待」 |
| 禮物 | `action / gift` | 小計設 0，`isGift = true`，標籤「禮物」 |
| 刪除 | `action / delete` | 小計設 0，`isGift = true`，標籤「刪除」 |
| 追加金額 | `addAmount` | 佔 2 欄，點擊後 emit `open-add-amount-panel`，由父層 BillAdjustPage 開啟 AddAmountPanel |
| 90% ～ 70% | `percentage` | 90 / 85 / 80 / 75 / 70 折，呼叫 `applyDiscountToSelectedItem` |
| 取消折扣 | `restorePrice` | 清除所有折扣，恢復原價 |

**狀態控制**：

- `canRestoreOriginalPrice`：品項有 `isGift`、`discountType` 或 `discountLabel` 任一有值 → 啟用「取消折扣」
- 否則按鈕 `opacity-45 + disabled`
- 所有操作呼叫 [useOrderStore](POS-store.md) 相關 action，結果由 BillAdjustPanel 即時反映

**Emits**：

| 事件 | 觸發時機 |
|------|---------|
| `open-add-amount-panel` | 點擊「追加金額」按鈕 |

---

### 4. AddAmountPanel.vue — 追加金額操作面板

從右側滑入的 slide-over 面板，供店員選擇追加項目類型並輸入金額，送出後寫入 store。

**Props**：

| 屬性 | 型別 | 說明 |
|------|------|------|
| `modelValue` | Boolean | 控制面板顯示/隱藏（v-model） |

**Emits**：

| 事件 | Payload | 觸發時機 |
|------|---------|---------|
| `update:modelValue` | `false` | 關閉面板（關閉按鈕或送出後） |
| `submit` | `{ name: String, amount: Number }` | 點擊「送出」且金額 > 0 |

**UI 結構（從上到下）**：

1. **標題**：「選擇追加項目並輸入金額」
2. **追加項目 Button Group**（2 欄 × 3 列，共 6 顆，單選）
   - 選項：`清潔費 / 服務費 / 停車費 / 外送費 / 包廂費 / 其他`
   - 預設選中：`清潔費`（第一顆）
3. **金額輸入區**：顯示區 + 數字鍵盤，互動模式參照 BillPayCalculator；支援 C 清空、backspace 退格
4. **Footer 按鈕（置底）**：
   - `關閉`：關閉面板並清空輸入金額
   - `送出`：僅 `amount > 0` 時可送出，emit `submit` 後自動關閉

**顯示層級與動畫**：

- `fixed` 絕對定位，右側滑入（`translate-x` transition）
- `z-index` 高於主內容
- 面板開啟時加入全畫面遮罩（`bg-modal-bg/60`，`fixed inset-0`），遮罩區域不可點擊

**父層串接（BillAdjustPage.vue）**：

```
ItemAdjust @open-add-amount-panel → showAddAmountPanel = true
AddAmountPanel v-model="showAddAmountPanel"
AddAmountPanel @submit → orderStore.addSurchargeItem(payload)
```

---

## 二、結帳支付頁（BillPayPage）

### 1. BillPayPanel.vue — 確認結帳面板

顯示未結金額、已付金額、找零金額。

- **未結金額**：`text-button-danger`，`text-3xl`
- **找零顏色**：紅色為欠款，綠色為找零
- 數字使用 `font-variant-numeric: tabular-nums` 確保寬度一致
- 使用 `computed` 即時計算餘額，嚴禁 template 內寫複雜運算

**付款流程**：
1. 數字鍵盤輸入金額
2. 點選支付方式 → 新增一筆付款記錄
3. 加總所有已支付細項 → 已付金額

---

### 2. BillPayCalculator.vue — 結帳計算器

核心操作區：數字鍵盤、支付方式選擇、完成結帳。

**Props**：

| 屬性 | 型別 | 說明 |
|------|------|------|
| `order` | Object | 桌次資訊（桌號、人數、狀態、用餐時間、總金額） |
| `payments` | Array | 已輸入的付款紀錄列表 |

**Emits**：

| 事件 | Payload | 觸發時機 |
|------|---------|---------|
| `add-payment` | `{ type, amount }` | 點選支付方式且輸入金額 > 0 |
| `confirm-checkout-success` | — | 結帳完成，通知父層跳轉至桌次頁 |

**內部狀態**：

| 名稱 | 類型 | 說明 |
|------|------|------|
| `inputValue` | ref | 當前輸入值，預設 `'0'` |
| `selectedPayment` | ref | 當前選中的付款方式 id |
| `showModal` | ref | 控制彈窗顯示 |
| `modalType` | ref | `'unpaid'`、`'change'`、`'success'`、`null` |
| `formattedAmount` | computed | 輸入值轉千分位 |
| `totalAmount` | computed | 從 Store 讀取訂單總金額 |
| `unpaidAmount` | computed | 總金額 - 已收金額，最小為 0 |
| `changeAmount` | computed | 從 Store 讀取找零金額 |

**數字鍵盤**：支援 0–9 輸入、C 清除、backspace 退位，首位為 0 時直接替換。

**付款方式**：從 `paymentMethodsConfig` 讀取，點擊後觸發 `add-payment` 並重置輸入值。

**完成結帳流程（`handleCompleteConfirmCheckout`）**：

1. `unpaidAmount > 0` → 顯示「餘額未結清」[BaseModal](POS-layout.md#basemodal-vue)，阻斷流程
2. `changeAmount > 0` → 顯示「提醒找零」[BaseModal](POS-layout.md#basemodal-vue)，等待確認
3. 兩者皆為 0 → 顯示「成功完成結帳」，1.5 秒後重置並跳轉

---

### 3. 完成結帳驗證彈窗（modalType）

使用 [BaseModal.vue](POS-layout.md#basemodal-vue)，`show-close="false"`（點擊外部無效）。

| modalType | 標題 | 行為 |
|-----------|------|------|
| `unpaid` | 餘額未結清 | 顯示欠款金額，僅提供「返回結帳」按鈕 |
| `change` | 提醒找零 | 大字體顯示找零金額，「完成找零」(Danger) 與「返回」；隱藏關閉鈕 |
| `success` | 成功完成結帳 | 全螢幕 SuccessOverlay 大勾動畫（1.5 秒）→ `resetOrder()` → 跳轉至桌次頁 |

**依賴關係**：

| 類型 | 名稱 | 用途 |
|------|------|------|
| Store | [useOrderStore](POS-store.md) | `totalAmount`、`changeAmount`、`resetOrder()` |
| 元件 | [BaseModal.vue](POS-layout.md#basemodal-vue) | 通用彈窗 |
| 元件 | [BillActionFooter.vue](POS-layout.md#billactionfooter-vue) | 底部操作列 |
| Config | `paymentMethodsConfig` | 付款方式清單 |
| Config | [TABLE_STATUS](POS-config.md) | 桌位狀態碼 |
