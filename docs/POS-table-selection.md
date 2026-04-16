# POS 系統 — 桌次選擇頁 & 開桌流程

← [返回索引](../README.md)

---

## 一、開桌資料處理規範

系統採用**「本地暫存、最終提交」**機制，確保資料一致性。

| 階段 | formData（本地） | useOrderStore.orderInfo（全域） | 說明 |
|------|----------------|-------------------------------|------|
| 填表中（Step 1–4） | 即時更新 | 不變 | 修改不影響系統現有訂單狀態 |
| 點擊「確認開桌」 | 停止更新（唯讀） | 一次性寫入（`setTable`） | 所有欄位彙整後寫入 Store |

**中途退出**：步驟 1–4 間直接返回主頁，orderInfo 未被寫入，系統視為「放棄開桌」，不產生殘留訂單。

**導航觸發**：確認開桌後直接推進至 `/order/:tableId`。

### handleSubmit() 寫入欄位對照

| 寫入欄位 | 來源 / 邏輯 | 範例值 |
|---------|-----------|--------|
| `orderId` | 自動生成（`ORD-` + 時戳） | `ORD-1706320000000` |
| `tableNumber` | `formData.value.table` | `A1` |
| `diners` | `formData.value.diners` | `{ adult: 2, children: 1 }` |
| `status` | 固定為 `TABLE_STATUS.OCCUPIED` | `1` |
| `serviceType` | 固定為 `'dine-in'` | `dine-in` |
| `customerInfo` | `formData.customerInfo.preferences` | Object |
| `customerInfo2` | `formData.customerInfo2.preferences` | Object |

---

## 二、多裝置狀態同步

為防止多台平板重複開桌，系統採用 **WebSocket（WS）** 實作被動同步機制。

**技術實作：`useTableSyncStore`**（`src/stores/useTableSyncStore.js`）

- **全域 Map**：`tableStatusMap` 儲存全系統桌位狀態，作為 UI 渲染的唯一事實來源
- **WS 訂閱**：系統啟動時自動建立連線，接聽 `table_updated` 與 `order_created` 訊息
- **衝突處理**：B 平板收到 WS 通知某桌已開桌 → Step 1 桌位圖即時變色並鎖定點擊

---

## 三、配置驅動驗證邏輯

開桌流程推進受 `RestaurantConfig` 中的 `required` 屬性控管。詳見 [POS-config.md](POS-config.md)。

**驗證機制：`validateRequiredGroups`**
- 單選校驗：值不為 `null`、`undefined` 或空字串
- 多選校驗：陣列長度 > 0
- 未通過 → 導覽按鈕維持 Disabled 狀態

---

## 四、開桌作業流程（Step 1–4）

### Step 1：桌位選擇（`Step1_Table.vue`）

元件：`Step1_Table.vue`，讀取 [RestaurantConfig.tableAreas](POS-config.md) 渲染桌位地圖。

**桌位點擊行為**（依狀態碼，詳見 [POS-config.md](POS-config.md)）：

| 狀態碼 | 行為 |
|--------|------|
| `0`（AVAILABLE） | 直接選定並跳至 Step 2 |
| `9`（RESERVED） | 觸發「預約確認」[BaseModal](POS-layout.md#basemodal-vue)，顯示預約詳細資料 |
| `1, 2, 3`（OCCUPIED） | 開啟功能選單 [BaseModal](POS-layout.md#basemodal-vue)（點餐、結帳、拆桌、併桌、重印） |
| `4, 5`（CLEANING） | 觸發「清潔確認」[BaseModal](POS-layout.md#basemodal-vue)，確認後重置狀態為 0 |

**選中回饋**：`ring-4` + `ring-offset` 主色邊框，`active:scale-95` 觸控縮放感。

**資料同步**：選定後將桌號（如 `A1`）寫入 `formData.table`。

---

### Step 2：用餐人數（`Step2_DinerCount.vue` + `DinerPicker.vue`）

依據 [RestaurantConfig.dinerPickers](POS-config.md) 動態生成 `DinerPicker` 組件。

- 數值即時同步至 `formData.diners`（以配置的 `key` 為屬性名稱）
- 案例 A（親子餐廳）：成人、孩童 110cm 以上、幼童 110cm 以下、嬰兒
- 案例 B（酒吧）：僅總人數，`min: 1`

---

### Step 3 + 4：額外需求收集

元件：`Step3_RestaurantMainOption.vue`、`Step4_RestaurantSubOption.vue`，使用 [ExtraField.vue](POS-layout.md#extrafield-vue)。

- Step 3 資料存入：`formData.customerInfo.preferences`
- Step 4 資料存入：`formData.customerInfo2.preferences`
- 反選邏輯：單選模式再次點擊已選項 → 值設為 `undefined`，若為必填則導覽按鈕即時鎖定

---

### Step 5：確認開桌（`StepNavigationButtons.vue`）

底部導覽列，控制步驟推進與最終提交。`canProceed` 由必填驗證即時計算。

---

## 五、預約確認與帶位流程

支援「一桌多預約」場景，`id` 為唯一交易識別碼。

**預約資料結構（`MOCK_RESERVE_LIST`）**：

| 欄位名稱 | 型別 | 說明 | 範例 |
|---------|------|------|------|
| `id` | String | 預約序號（唯一） | `RES-A5-001` |
| `tableId` | String | 桌位唯一識別 ID | `A5` |
| `tableLabel` | String | 畫面顯示用桌號名稱 | `A5 桌` |
| `customerName` | String | 預約客戶姓名（含稱謂） | `小火龍 先生` |
| `reserveTime` | String | 預約入座時間 | `12:30` |
| `dinerCount` | Number | 預約用餐人數 | `4` |
| `phone` | String | 預約聯繫電話 | `0923 123 456` |
| `status` | Number | 待位中、已入座、已過期等 | |

**彈窗互動流程**：

| 來源 | 觸發動作 | 邏輯 |
|------|---------|------|
| TableMap | 點擊桌位 | 傳遞 `tableId`，開啟預約確認 [BaseModal](POS-layout.md#basemodal-vue) |
| BaseModal | 資料篩選 | 於 `MOCK_RESERVE_LIST` filter 匹配 `tableId`，取時間最接近者 |
| Primary Button | 執行帶位 | 傳回 `id` 至後端 API，更新狀態為「已入座」，同步桌位狀態為「用餐中」 |

- 無對應預約資料 → 顯示「查無預約資訊」，禁用「確認帶位」按鈕
- Secondary Button → 關閉彈窗，不變更任何狀態

**相關 API**：詳見 [POS-api.md](POS-api.md)
- `GET /api/v1/reservations`
- `POST /api/v1/reservations/{id}/check-in`

---

## 六、綜合資料流總結

| 階段 | 操作對象 | 資料流向 | 說明 |
|------|---------|---------|------|
| Step 1 | `formData.table` | 本地更新 | 紀錄目標桌號 |
| Step 2 | `formData.diners` | 本地更新 | 紀錄分層人數 |
| Step 3~4 | `formData.customerInfo` | 本地更新 | 處理 extraFields 動態輸入 |
| 提交時 | Order Store | 一次性寫入 | `setTable` 將 formData 彙整寫入 orderInfo |
