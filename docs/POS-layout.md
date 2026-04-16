# POS 系統 — 佈局規範 & 通用元件

← [返回索引](../README.md)

---

## 一、系統佈局規範

### 1. Viewport & Scaling

- **基準字級**：平板尺寸（≥ 768px）設為 18px，筆電尺寸（≥ 1280px）設為 16px
- **高度處理**：全站使用 `dvh`（Dynamic Viewport Height）單位，解決平板瀏覽器網址列遮擋底部按鈕的問題
- **防縮放**：已鎖定 `user-scalable=no`，防止雙擊或縮放導致介面跑位

### 2. 重點組件尺寸

| 元件 | 規格 | 備註 |
|------|------|------|
| 側邊結帳面板 | 寬度 330px | 面板外的操作區隨視窗動態調整 |
| 觸控按鈕高度 | `btn-h-md` (80px) / `btn-h-sm` (64px) | 優先使用 btn-h-md；btn-h-sm 用於網格或多按鈕組合 |
| 觸控按鈕最小寬度 | `min-w-18` | |

---

## 二、通用元件

### BaseModal.vue

全站共用彈窗基底。

**規格**：
- **插槽**：支援 `header`、`default`、`footer` 三個具名插槽
- **Teleport**：所有彈窗皆傳送至 `body` 層級，避免被父層 `overflow-hidden` 裁切
- **動畫**：內建 scale 與 opacity 的 Transition 過渡效果
- **關閉控制**：`show-close="false"` 時隱藏關閉按鈕且點擊背景無效（用於強制確認場景）

**使用場景**：

| 使用位置 | 觸發情境 | 文件 |
|---------|---------|------|
| TableSelectionPage | 預約確認燈箱、清潔確認燈箱、已開桌功能選單 | [POS-table-selection.md](POS-table-selection.md) |
| GlobalAdjust.vue | 整單折扣套用確認（含折扣金額預覽、詳細說明 accordion） | [POS-bill.md](POS-bill.md) |
| BillPayCalculator.vue | 餘額未結清提醒、找零確認、結帳成功動畫 | [POS-bill.md](POS-bill.md) |

---

### ExtraField.vue

單選／多選按鈕群組元件，由後端配置驅動渲染。

**使用場景**：

| 使用位置 | mode | 文件 |
|---------|------|------|
| Step3_RestaurantMainOption、Step4_RestaurantSubOption | `table-selection`（開桌額外欄位） | [POS-table-selection.md](POS-table-selection.md) |
| OptGroup（點餐客製化） | `order`（客製化選項） | [POS-order.md](POS-order.md) |

**共用規格**：
- `isMultiple`（Boolean）：決定單選或多選模式。群組設定優先於 props 全域設定
- `isLargeBtn`（Boolean）：`true` → 大寬度按鈕 (`min-w-60`)；`false` → 標準按鈕 (`min-w-44`)
- 反選邏輯：單選模式下再次點擊已選中項，值設為 `undefined`（配合必填校驗）

**`mode="order"` 樣式規範**（點餐頁客製化用）：
- 左側標籤：固定寬度 `w-10`，限制字數 2 字，對齊第一行按鈕文字
- 右側按鈕高度：固定 `h-btn-h-sm` (64px)，寬度 `min-w-22` 至 `max-w-48`
- 加價顯示：`option.price > 0` 時顯示加價金額，以獨立背景色塊視覺隔離
- 按鈕狀態色：選中 `bg-button-selected` / 未選中 `bg-button-primary`

---

### BillActionFooter.vue

兩個結帳頁面（BillAdjustPage、BillPayPage）共用的底部操作列。

**使用場景**：

| 使用位置 | 文件 |
|---------|------|
| BillAdjustPage | [POS-bill.md](POS-bill.md) |
| BillPayPage | [POS-bill.md](POS-bill.md) |

**Props**：

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `secondButtonText` | String | `''` | 次要按鈕文字，空字串時不渲染 |
| `primaryButtonText` | String | `'完成'` | 主要 CTA 按鈕文字 |
| `ctaDanger` | Boolean | `true` | 主要按鈕是否使用危險樣式（紅色） |

**Emits**：`second-click`、`primary-click`

**插槽**：`leftGroup`（靠左區域，用於放置發票、暫存等輔助按鈕）

**版面結構**：高度固定 `h-24`，三段排列：`leftGroup` slot（靠左）→ `flex-1` 空白 → 次要按鈕 + 主要 CTA（靠右）

---

### TopBar.vue

頂部列：Logo、當前時間、全域快捷鍵。固定於所有頁面頂端。

---

### AppSidebar.vue

左側邊導覽選單：桌次、點餐、訂單三個主要入口。固定顯示，不隨頁面切換消失。
