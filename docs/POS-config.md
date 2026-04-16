# POS 系統 — 配置規範

← [返回索引](POS-index.md)

---

## 一、桌位狀態碼（TABLE_STATUS）

定義於 `src/config/tableStatus.js`，全系統採用統一數字碼。

| 狀態碼 | 常數名 | 說明 | 視覺行為 |
|--------|--------|------|---------|
| 0 | AVAILABLE | 未開桌，可直接執行開桌流程 | 灰色 |
| 1 | OCCUPIED | 用餐中，開始計時 | 品牌主色（ash） |
| 2 | WARNING | 接近用餐時間上限 | 警告色（黃） |
| 3 | OVERTIME | 超過預定用餐時間 | 危險色（紅） |
| 4 | CHECKED_OUT | 客人已買單，準備清桌 | 綠色 |
| 5 | CLEANING | 桌面雜亂，不可開桌 | 灰背景/深紅文字 |
| 9 | RESERVED | 已被訂位，需確認身分後開桌 | 亮藍色/預定文字 |

狀態碼對應的底色 class（用於 BillAdjustPanel header）：

| 狀態碼 | Tailwind class |
|--------|---------------|
| 0 | `bg-ordstatus-0-primary` |
| 1 | `bg-ordstatus-1-primary` |
| 2 | `bg-ordstatus-2-primary` |
| 3 | `bg-ordstatus-3-primary` |
| 4 | `bg-ordstatus-4-primary` |
| 5 | `bg-ordstatus-5-primary` |
| 9 | `bg-ordstatus-9-primary` |
| 其他 | `bg-layer-dark-tertiary`（Fallback） |

---

## 二、餐廳配置規範（RestaurantConfig）

定義於 `src/config/restaurantConfig.js`。採用**配置驅動架構**，前端介面不寫死特定欄位，根據 `RestaurantConfig` 動態決定渲染內容，以因應不同餐廳類型（火鍋店、單人拉麵店、親子餐廳）的業務差異。

### RestaurantConfig Schema

| 屬性名稱 | 型別 | 說明 |
|---------|------|------|
| `restaurantId` | String | 餐廳/分店唯一識別代號 |
| `tableAreas` | TableArea[] | Step 1：定義座位區數量、標籤與各區桌數 |
| `aggregationStrategy` | `'merge'` \| `'split'` | 點餐策略（見下方） |
| `dinerPickers` | DinerPickerItem[] | Step 2：定義人數拆分維度 |
| `extraFields` | ExtraField[] | Step 3：額外必填資訊 |
| `extraFields2` | ExtraField[] | Step 4：與 Step 3 結構相同，作為下一步驟 |

### tableAreas（Step 1 桌位地圖）

- `key`：區域識別（如 `'A'`、`'VIP'`）
- `label`：介面顯示名稱（如「A 區」、「包廂區」）
- `tableCount`：該區域的實體桌數

### dinerPickers（Step 2 人數計數器）

| 參數名 | 說明 | 範例值 |
|--------|------|--------|
| `key` | 資料識別碼（對應 API 寫入欄位） | `"adults"`, `"children"` |
| `label` | UI 顯示標籤文字 | `"成人"`, `"小孩"` |
| `quickOptions` | 快速選擇按鈕數值陣列 | `[2, 4, 6]` |
| `min / max` | 可輸入的數值邊界 | `0 / 99` |
| `unit` | 顯示單位 | `"人"` |
| `isPrimary` | 是否為主要欄位（數值主導訂單總人數） | `true / false` |
| `defaultValue` | 預設值 | `2` |
| `showSeparatorAfter` | 下方是否顯示分隔線 | `true / false` |

### extraFields / extraFields2（Step 3+4 額外欄位）

由 `preferenceGroups` 陣列動態生成 [ExtraField.vue](POS-layout.md#extrafield-vue)：

- `key`：識別碼，作為 `preferences` 物件的屬性名稱
- `label`：介面顯示的群組名稱
- `type`：欄位型別，目前支援 `select`（單/多選按鈕組）
- `options`：選項清單，每項含 `value`（儲存值）與 `label`（UI 文字）
- `isMultiple`（Boolean）：決定單/多選模式
- `isLargeBtn`（Boolean）：`true` → `min-w-60`；`false` → `min-w-44`
- `required`（Boolean）：必填，控制導覽按鈕啟用狀態

---

## 三、點餐合併與拆分策略（Aggregation Strategy）

根據 `aggregationStrategy` 決定 `useOrderStore.addToCart` 的寫入行為。詳見 [POS-store.md](POS-store.md)。

### `merge`（自動合併）

- **判定**：`id` 相同且 `modifiers` 序列化後完全一致
- **行為**：存在相同項則累加 `quantity`；否則新增

### `split`（獨立拆分）

- **判定**：無，每次點擊皆為獨立事件
- **行為**：透過 `_generateCartItemId` 生成唯一 ID（UUID），強制推入新行

---

## 四、業務場景範例

| 餐廳類型 | Step 2（人數） | Step 3（額外資訊） |
|---------|--------------|-----------------|
| A 餐廳（吃到飽） | 總人數、成人、小孩、長者 | 聚餐用途、方案（999/799/599） |
| B 餐廳（單點/套餐） | 總人數、男性、女性、小孩 | 用餐方案（1788 吃到飽 / 單點） |
| C 餐廳（酒吧） | 總人數（Min: 1） | 無需填寫額外欄位 |
