# POS 系統 — 點餐頁

← [返回索引](POS-index.md)

---

## 進入點

1. 桌次頁成功開桌後，自動導向 `/order/:tableId`
2. 桌次頁點選用餐中桌位 → 功能選單 → 點擊「點餐」

---

## 一、二階段點餐設計

### 階段一：選品模式（Selection Mode）

- 使用者透過 `CatTabs` 切換主類別
- `SubCatList` 以大圖網格形式呈現子品項
- **快速點餐**：商品無客製化選項（`optionGroups` 為空）→ 點擊後直接進入 OrderPanel 清單

### 階段二：配置模式（Configuration Mode）

- 商品具備客製化選項 → 點擊後觸發 `mode = 'config'`
- 右側主區塊轉換為客製化面板；左側顯示 `ItemSideMenu` 快速切換同類別商品
- 底部彈出 `QtyBar` 進行數量確認與加入購物車
- **強制重繪**：`OptGroup` 綁定 `:key="selectedItemId"`，確保切換商品時高度計算精確

---

## 二、佈局架構

頁面採用 Flexbox，嚴格控制各元件的擠壓關係：

- **左側主控區**（`flex-1`）：`CatTabs`（固定高度）+ `ModeSwitchContent`（自動撐開）
  - OrderPanel 收合時，此區域平滑伸展接管空間
- **右側 OrderPanel**（常駐）：寬度由元件內部控制（展開 `w-[430px]`，收合 `w-60`）
- **間距規範**：主元件間距 `gap-3`（12px），頁面邊緣 `p-4`（16px）

---

## 三、關鍵邏輯

### 購物車（Store Connection）

使用 [useOrderStore](POS-store.md)：

- **`cartItemId`**：每筆進入購物車的品項皆有獨立 ID
  - `merge` 模式：同屬性商品共用 ID（合併數量）
  - `split` 模式：每筆商品 ID 皆唯一
- **精準刪除**：`removeFromCart` 必須比對 `cartItemId`，避免 split 模式下誤刪同名商品

### 計算屬性

- **動態加價**：`extraPrice` 由 `OptGroup` 選擇結果即時加總至 `finalUnitPrice`
- **總數統計**：`totalCount` 用 `reduce` 累加所有 `item.quantity`（反映總份數非總行數）

---

## 四、元件通訊

| 來源 | 事件 | 接收 | 行為 |
|------|------|------|------|
| `CatTabs` | `@change` | OrderPage | 切換主類別，重新渲染 SubCatList |
| `OrderPage` | 內部觸發 | OptGroup | 進入配置模式前執行 `buildDefaultConfig`，透過 v-model 傳入預設值 |
| `OptGroup` | `update:modelValue` | OrderPage | 修改選項時即時回傳暫存 |
| `ItemSideMenu` | `@select` | OrderPage | 配置模式切換商品，重新初始化並刷新內容 |
| `SubCatList` | `@select` | OrderPage | 點擊商品，有選項則啟動初始化並切換 config 模式 |
| `QtyBar` | `@add` | OrderStore | 將當前配置品項推入購物車 |
| `OrderPanel` | `@delete-item` | OrderStore | 傳入 `cartItemId` 呼叫 `removeFromCart` |
| `OrderPanel` | `@delete-all` | OrderPage | 觸發全單清空確認邏輯 |
| `OrderPanel` | `@toggle` | OrderPage | 切換側邊欄收合，觸發寬度過渡動畫 |

---

## 五、OrderPanel（右側明細欄）

### 動態寬度

| 狀態 | 寬度 | 顯示內容 |
|------|------|---------|
| 展開 | 430px | 序號、份數、備註、單價 |
| 收合 | 240px | 僅刪除按鈕與餐點名稱 |

### 份數顯示邏輯（`aggregationStrategy`）

- `v-if="isExpanded && item.quantity > 1"`
- `merge` 模式：數量 > 1 時顯示 `x {{ quantity }}`
- `split` 模式：每行數量恆為 1，份數自動隱藏

### 排版細節

- 名稱最多兩行（`line-clamp-2`）
- 備註（Options）全數顯示，不限行數
- 底線左右縮進 16px（`left-4 right-4`）
- **刪除動畫**：TransitionGroup `name="fade"`，向下滑動 4px 並淡出（250ms）
- Toolbar 增加 `z-index: 10` 解決清單按鈕穿透陰影

### 已下單品項（加點場景）

- 背景色：`bg-yellow-50/50`，分隔線：`border-dashed`
- `item.status === 'placed'` → 隱藏刪除按鈕
- `totalAmount` 加總已下單與新點選所有品項小計

---

## 六、購物車品項資料結構（Cart Item Schema）

| 欄位名 | 類型 | 說明 |
|--------|------|------|
| `cartItemId` | String | 唯一索引，用於 `:key` 與刪除識別 |
| `name` | String | 餐點名稱（支援 break-all） |
| `price` | Number | 含客製化後的最終小計 |
| `quantity` | Number | 點購份數 |
| `modifiers` | Object | 含 `optionSelections` 與 `displayGroups` |
| `optionSelections` | Object | 使用者選取的原始值（Key-Value） |
| `optionGroups` | Array | 該餐點可用的選項定義（用於反查 Label） |

**格式解析**：
- 優先讀 `item.modifiers.displayGroups`；無則降級讀 `item.optionGroups`
- 支援多選（Array）與單選（Value）兩種類型
- 所有標籤以「、」串接，無選項回傳空字串

---

## 七、CatTabs（主類別標籤）

- 高度：`h-btn-h-sm`（64px），按鈕寬度 `w-28`（`min-w-20`）
- 選中：`bg-yellow-800`，`text-xl` 粗體；未選中：`bg-button-primary`
- 水平溢出偵測：`ResizeObserver` 監測 `scrollWidth > clientWidth`，動態顯示左右箭頭
- 捲動行為：`scrollBy({ left: 200, behavior: 'smooth' })`

---

## 八、SubCatList（子品項網格）

| 特性 | 規格 |
|------|------|
| 佈局 | `flex-wrap` 網格，自動填滿剩餘空間 |
| 按鈕高度 | `h-btn-h-sm`（64px） |
| 按鈕寬度 | `min-w-24` 至 `max-w-48` |
| 文字顯示 | `line-clamp-2` 限制行數，`break-all` 防止溢出 |

---

## 九、ItemSideMenu（配置模式左側選單）

| 特性 | 規格 |
|------|------|
| 導航觸發 | `scrollHeight > clientHeight` 時顯示上下切換按鈕 |
| 視覺層次 | 選中時 `shadow-md` + `z-10`，未選中縮進 8px |
| 防錯機制 | 捲動到盡頭時按鈕 `opacity-30` + `disabled` |

- **Active 樣式**：`w-full`，`rounded-r-none`，與右側面板視覺黏合
- **Inactive 樣式**：`w-[calc(100%-8px)]`，右側保留 8px 空間感
- **動態邊緣銜接**：`isFirstItem` 為 true 時，右側區域左上角切換為直角

---

## 十、QtyBar（底部數量操作列）

### 1. 內容捲動導覽（Scroll Navigation）

使用 [useScrollControls](POS-store.md#usescrollcontrolsts)，接收 `OptGroup` 的 DOM ref。

- 閾值：5px
- 固定捲動步長：150px；距邊界 < 步長時強制捲到頂/底
- 切換商品時執行 `scrollTop = 0` 並延遲 50ms 重新計算，確保按鈕狀態正確

### 2. 數量增減

- 預設範圍：1 至 99；達到邊界時按鈕進入 `disabled`

### 3. 加入清單

點擊「加入」→ `@add` 事件 → 將品項名稱、最終單價、客製化選項、數量打包送往 `OrderStore`

---

## 十一、預設配置初始化（buildDefaultConfig）

觸發時機：從 `SubCatList` 點選商品，或在 `ItemSideMenu` 切換商品。

- 掃描 `optionGroups` 中標記為 `isDefault: true` 的選項
- 單選 → 儲存為單一 `value`；多選 → 儲存為 `[value1, value2]` 陣列
- 設計意圖：最大化減少店員點擊次數，實現「點進去即配置完成」

**資料傳遞路徑**：
1. `menuConfig.js` 定義品項與 `isDefault` 標籤
2. `OrderPage.vue` 讀取標籤並初始化 `optionSelections`（v-model）
3. [ExtraField.vue](POS-layout.md#extrafield-vue) 根據 `optionSelections` 亮起對應按鈕
4. `QtyBar` 觸發 `addItemToCart`，將配置打包送往 [useOrderStore](POS-store.md)
