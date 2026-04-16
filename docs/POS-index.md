# POS 系統文件索引

> 實體平板（iPad／Android Tablet）餐飲點餐與結帳系統

---

## 文件導覽

| 檔案 | 涵蓋內容 |
|------|---------|
| [POS-layout.md](POS-layout.md) | 佈局規範、通用元件（BaseModal、ExtraField、BillActionFooter、TopBar、AppSidebar） |
| [POS-config.md](POS-config.md) | 餐廳配置規範（RestaurantConfig）、桌位狀態碼、點餐合併/拆分策略 |
| [POS-table-selection.md](POS-table-selection.md) | 開桌作業流程（Step 1–4）、預約帶位、多裝置同步 |
| [POS-order.md](POS-order.md) | 點餐頁（選品模式、配置模式、購物車） |
| [POS-bill.md](POS-bill.md) | 結帳調整頁（折扣、招待）、結帳支付頁（付款、找零） |
| [POS-store.md](POS-store.md) | Pinia Store（useOrderStore）、Composables、Utils |
| [POS-api.md](POS-api.md) | API 需求端點、現有 REST（`createOrder`）、**§7 帳單調整與暫存**（GET 載入／PUT 暫存草案、`lineId`、409）— 見該檔「### 7.」小節 |

---

## 一、專案總覽

本專案為實體平板使用情境設計的餐飲點餐與結帳系統，重點在於：

- 快速點餐與桌況切換
- 訂單資料在頁面間順暢傳遞
- 結帳流程（折扣／招待／刪除／付款／找零／結案）

| 項目 | 技術 |
|------|------|
| 前端框架 | Vue 3 + Vite |
| 狀態管理 | Pinia |
| 樣式系統 | Tailwind CSS + 自訂 `main.css` 變數 |
| 桌位狀態 | 數字狀態碼（詳見 [POS-config.md](POS-config.md)） |

---

## 二、目錄架構（src）

```
src/
├── api/
│   └── orders.js                # REST API：開桌（createOrder）
│
├── assets/                      # 靜態資源（Logo、全域 CSS）
│
├── components/
│   ├── bill/
│   │   ├── BillAdjustPanel.vue  # AdjustPage：右側明細欄
│   │   ├── GlobalAdjust.vue     # AdjustPage：整單折扣專案網格
│   │   ├── ItemAdjust.vue       # AdjustPage：單品折扣操作網格
│   │   ├── BillPayPanel.vue     # BillPay：明細欄
│   │   ├── BillPayCalculator.vue# BillPay：計算器與支付操作
│   │   └── BillActionFooter.vue # 結帳頁通用底部操作列
│   ├── layout/
│   │   ├── TopBar.vue           # 頂部列：Logo、時間、快捷鍵
│   │   └── AppSidebar.vue       # 側邊選單：桌次、點餐、訂單
│   ├── common/
│   │   ├── BaseModal.vue        # 全域彈窗基底
│   │   └── ExtraField.vue       # 單/多選按鈕群組
│   ├── order/                   # CatTab、QtyBar、OptGroup、ItemSideMenu、SubCatList、OrderPanel
│   └── table-selection/         # Step1_Table、Step2_DinerCount、Step3_RestaurantMainOption、Step4_RestaurantSubOption、DinerPicker、StepNavigationButtons
│
├── views/
│   ├── bill/
│   │   ├── BillAdjustPage.vue
│   │   └── BillPayPage.vue
│   ├── order/
│   │   └── OrderPage.vue
│   └── TableSelectionPage.vue
│
├── composables/
│   └── useScrollControls.ts     # 上下/左右捲動控制
│
├── utils/
│   └── formatDiningTime.js      # ISO → HH:MM 用餐時長
│
├── config/
│   ├── tableStatus.js
│   ├── paymentMethods.js
│   └── restaurantConfig.js
│
├── mock/
│   ├── menuMock.js
│   ├── orderMock.js
│   ├── MockPlacedOrders.js
│   ├── MockGlobalDiscount.js
│   └── reserveTableDataMock.js
│
├── stores/
│   ├── useOrderStore.js
│   └── useTableSyncStore.js
│
├── router/
│   └── index.js
│
└── App.vue
```

---

## 路由對照

| 路徑                      | 頁面                 | 說明                       |
| ----------------------- | ------------------ | ------------------------ |
| `/`                     | redirect           | 自動跳轉至 `/table-selection` |
| `/table-selection`      | TableSelectionPage | 桌次選擇、開桌流程                |
| `/order/:tableId`       | OrderPage          | 點餐主頁                     |
| `/bill-adjust/:tableId` | BillAdjustPage     | 結帳調整（折扣/招待）              |
| `/bill-pay/:tableId`    | BillPayPage        | 結帳支付（付款/找零）              |

帳單調整頁載入／暫存 API 契約：**[POS-api.md](POS-api.md)** 內 **§二 → `### 7.` 帳單調整與暫存**。
