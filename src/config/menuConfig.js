/**
 * 點餐頁商品與分類設定（config-driven）
 *
 * - 主要分類（對應 CatTabs）：如「炒飯」、「炒麵」、「台菜」…
 * - 每個分類底下有多個商品（對應 SubCatList / ItemSideMenu 的按鈕）
 * - 商品可附帶一組或多組 ExtraField-style 的 `optionGroups`，給 OptGroup + ExtraField 使用
 *
 * ExtraFieldOption 新增可選欄位：
 * - price?: number  // 若有加價，會在 order 模式下顯示「+N 元」
 */

/**
 * @typedef {Object} MenuOption
 * @property {string} value
 * @property {string} label
 * @property {number} [price] - 加價金額，預設 0
 *
 * @typedef {Object} MenuExtraField
 * @property {string} key
 * @property {string} label
 * @property {'select'} type
 * @property {MenuOption[]} options
 * @property {boolean} [required]
 * @property {boolean} [isMultiple=false]
 * @property {boolean} [isLargeBtn=false]
 *
 * @typedef {Object} MenuItem
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @property {MenuExtraField[]} [optionGroups] - 若有設定，點擊後會進入「配置模式」
 *
 * @typedef {Object} MenuCategory
 * @property {string} key
 * @property {string} label
 * @property {MenuItem[]} items
 */

/**
 * 開發用範例菜單（之後可由後端 API 取代）
 *
 * 這份設定主要是為了支援 OrderPage 的 config-driven UI，
 * 不是最終定案，只要結構穩定即可。
 */
export const DEFAULT_MENU_CATEGORIES = [
  {
    key: 'top_course',
    label: 'TOP',
    items: [
      {
        id: 'magic_panda_tofu',
        name: '大魔術熊貓豆腐',
        price: 280,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'small', label: '小份', price: 0, isDefault: true },
              { value: 'large', label: '大份', price: 109 }
            ]
          },
          {
            key: 'spicy',
            label: '辣度',
            type: 'select',
            options: [
              { value: 'none', label: '不辣' },
              { value: 'mild', label: '小辣' },
              { value: 'medium', label: '中辣', isDefault: true },
              { value: 'hot', label: '大辣' }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'tofu', label: '小魚豆腐', price: 20 },
              { value: 'bean_sprout', label: '鹹蛋豆芽菜', price: 20 },
              { value: 'veggie_soup', label: '蔬菜湯', price: 10 },
              { value: 'egg_soup', label: '蛋花湯', price: 10 }
            ]
          }
        ]
      },
      {
        id: 'master_dry_aged_ribeye',
        name: '極選 28天乾式熟成肋眼',
        price: 2680,
        optionGroups: [
          {
            key: 'beef_origin',
            label: '產地',
            type: 'select',
            options: [
              { value: 'usda_prime', label: '美國 USDA Prime', price: 0, isDefault: true },
              { value: 'au_wagyu_m9', label: '澳洲 M9 和牛', price: 1200 },
              { value: 'jp_a5_hyogo', label: '日本兵庫縣 A5 和牛', price: 2800 }
            ]
          },
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: '12oz', label: '12oz (標準)', price: 0, isDefault: true },
              { value: '16oz', label: '16oz (分享)', price: 800 },
              { value: '24oz', label: '24oz (戰斧等級)', price: 1800 }
            ]
          },
          {
            key: 'ripeness',
            label: '熟度',
            type: 'select',
            options: [
              { value: 'rare', label: '一分熟' },
              { value: 'medium_rare', label: '三分熟', isDefault: true },
              { value: 'medium', label: '五分熟' },
              { value: 'medium_well', label: '七分熟' },
              { value: 'well_done', label: '全熟' }
            ]
          },
          {
            key: 'crust_style',
            label: '外烤法',
            type: 'select',
            options: [
              { value: 'classic', label: '經典炙烤', isDefault: true },
              { value: 'pittsburgh', label: '匹茲堡焦黑 (Charred)' },
              { value: 'butter_basted', label: '法國發酵奶油淋澆', price: 150 }
            ]
          },
          {
            key: 'premium_sides',
            label: '升級',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'foie_gras', label: '現煎香料鵝肝', price: 680 },
              { value: 'shaved_truffle', label: '現磨新鮮黑松露', price: 500 },
              { value: 'lobster_tail', label: '波士頓龍蝦尾 (半隻)', price: 880 }
            ]
          }
        ]
      },
      {
        id: 'golden_laugh',
        name: '黃金開口笑',
        price: 220,
        optionGroups:[
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'small', label: '小份', price: 0, isDefault: true },
              { value: 'large', label: '大份', price: 49 }
            ]
          },
          {
            key: 'spicy',
            label: '辣度',
            type: 'select',
            options: [
              { value: 'none', label: '不辣', isDefault: true },
              { value: 'mild', label: '小辣' },
              { value: 'medium', label: '中辣' },
              { value: 'hot', label: '大辣' }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'tofu', label: '小魚豆腐', price: 20 },
              { value: 'bean_sprout', label: '鹹蛋豆芽菜', price: 20 },
              { value: 'veggie_soup', label: '蔬菜湯', price: 10 },
              { value: 'egg_soup', label: '蛋花湯', price: 10 }
            ]
          }
        ]
      },
      {
        id: 'soul_lost_rice',
        name: '黯然銷魂飯',
        price: 229,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'xs', label: '迷你份', price: 0 },
              { value: 'small', label: '小份', price: 22, isDefault: true },
              { value: 'medium', label: '中份', price: 40 }
            ]
          },
          {
            key: 'spicy',
            label: '辣度',
            type: 'select',
            options: [
              { value: 'none', label: '不辣', isDefault: true },
              { value: 'medium', label: '中辣' },
              { value: 'hot', label: '大辣' }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'tofu', label: '小魚豆腐', price: 20 },
              { value: 'bean_sprout', label: '鹹蛋豆芽菜', price: 20 },
              { value: 'veggie_soup', label: '蔬菜湯', price: 10 },
              { value: 'egg_soup', label: '蛋花湯', price: 10 }
            ]
          }
        ]
      },
      {
        id: 'fried_rice_chicken_crown',
        name: '一番雞皇炒飯',
        price: 200,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'small', label: '小份', price: 0, isDefault: true },
              { value: 'large', label: '大份', price: 49 }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'tofu', label: '小魚豆腐', price: 20 },
              { value: 'bean_sprout', label: '鹹蛋豆芽菜', price: 20 },
              { value: 'veggie_soup', label: '蔬菜湯', price: 10 },
              { value: 'egg_soup', label: '蛋花湯', price: 10 }
            ]
          }
        ]
      },
      {
        id: 'fried_rice_sea_king',
        name: '海霸王炒飯',
        price: 200,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'small', label: '小份', price: 0, isDefault: true },
              { value: 'large', label: '大份', price: 49 }
            ]
          },
          {
            key: 'spicy',
            label: '辣度',
            type: 'select',
            options: [
              { value: 'none', label: '不辣', isDefault: true },
              { value: 'hot', label: '大辣' }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'tofu', label: '小魚豆腐', price: 20 },
              { value: 'bean_sprout', label: '鹹蛋豆芽菜', price: 20 },
              { value: 'veggie_soup', label: '蔬菜湯', price: 10 },
              { value: 'egg_soup', label: '蛋花湯', price: 10 }
            ]
          }
        ]
      },
      {
        id: 'fried_rice_vegetarian',
        name: '素香椿炒飯',
        price: 200,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'small', label: '小份', price: 0, isDefault: true },
              { value: 'large', label: '大份', price: 49 }
            ]
          },
          {
            key: 'spicy',
            label: '辣度',
            type: 'select',
            options: [
              { value: 'none', label: '不辣', isDefault: true },
              { value: 'mild', label: '小辣' },
              { value: 'medium', label: '中辣' },
              { value: 'hot', label: '大辣' }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'tofu', label: '小魚豆腐', price: 20 },
              { value: 'bean_sprout', label: '鹹蛋豆芽菜', price: 20 },
              { value: 'veggie_soup', label: '蔬菜湯', price: 10 },
              { value: 'egg_soup', label: '蛋花湯', price: 10 }
            ]
          }
        ]
      },
      {
        id: 'fried_rice_SSR',
        name: '世紀厲害炒飯',
        price: 200,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'small', label: '小份', price: 0, isDefault: true },
              { value: 'large', label: '大份', price: 49 }
            ]
          },
          {
            key: 'spicy',
            label: '辣度',
            type: 'select',
            options: [
              { value: 'none', label: '不辣', isDefault: true },
              { value: 'mild', label: '小辣' },
              { value: 'medium', label: '中辣' },
              { value: 'hot', label: '大辣' }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'tofu', label: '小魚豆腐', price: 20 },
              { value: 'bean_sprout', label: '鹹蛋豆芽菜', price: 20 },
              { value: 'veggie_soup', label: '蔬菜湯', price: 10 },
              { value: 'egg_soup', label: '蛋花湯', price: 10 }
            ]
          }
        ]
      }
    ]
  },
  {
    key: 'appetizer',
    label: '前菜',
    items: [
      {
        id: 'crystal_phoenix',
        name: '鳳凰水晶',
        price: 180,
        optionGroups: [
          {
            key: 'spicy',
            label: '辣度',
            type: 'select',
            options: [
              { value: 'none', label: '不辣', isDefault: true },
              { value: 'mild', label: '小辣' },
              { value: 'medium', label: '中辣' },
              { value: 'hot', label: '大辣' }
            ]
          }
        ]
      },
      {
        id: 'master_dry_aged_ribeye',
        name: '極選 28天乾式熟成肋眼',
        price: 2680,
        optionGroups: [
          {
            key: 'beef_origin',
            label: '產地',
            type: 'select',
            options: [
              { value: 'usda_prime', label: '美國 USDA Prime', price: 0, isDefault: true },
              { value: 'au_wagyu_m9', label: '澳洲 M9 和牛', price: 1200 },
              { value: 'jp_a5_hyogo', label: '日本 兵庫縣 A5 和牛', price: 2800 }
            ]
          },
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: '12oz', label: '12oz (標準)', price: 0, isDefault: true },
              { value: '16oz', label: '16oz (分享)', price: 800 },
              { value: '24oz', label: '24oz (戰斧等級)', price: 1800 }
            ]
          },
          {
            key: 'ripeness',
            label: '熟度',
            type: 'select',
            options: [
              { value: 'rare', label: '一分熟' },
              { value: 'medium_rare', label: '三分熟', isDefault: true },
              { value: 'medium', label: '五分熟' },
              { value: 'medium_well', label: '七分熟' },
              { value: 'well_done', label: '全熟' }
            ]
          },
          {
            key: 'crust_style',
            label: '外烤法',
            type: 'select',
            options: [
              { value: 'classic', label: '經典炙烤', isDefault: true },
              { value: 'pittsburgh', label: '匹茲堡焦黑 (Charred)' },
              { value: 'butter_basted', label: '法國發酵奶油淋澆', price: 150 }
            ]
          },
          {
            key: 'toppings',
            label: '配料',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'foie_gras', label: '現煎香料鵝肝', price: 680 },
              { value: 'shaved_truffle', label: '現磨新鮮黑松露', price: 500 },
              { value: 'lobster_tail', label: '波士頓龍蝦尾 (半隻)', price: 880 }
            ]
          }
        ]
      },
      {
        id: 'atlantic_seafood_platter',
        name: '大西洋極鮮海鮮盤',
        price: 1880,
        optionGroups: [
          {
            key: 'sauce_selection',
            label: '醬汁',
            type: 'select',
            options: [
              { value: 'lemon_butter', label: '香檸奶油醬', isDefault: true },
              { value: 'garlic_white_wine', label: '蒜香白酒汁' },
              { value: 'saffron_veloute', label: '番紅花天鵝絨醬', price: 120 }
            ]
          },
          {
            key: 'prep_method',
            label: '烹調',
            type: 'select',
            options: [
              { value: 'grilled', label: '炭烤 (Grilled)', isDefault: true },
              { value: 'steamed', label: '清蒸 (Steamed)' },
              { value: 'thermidor', label: '焗烤法式龍蝦式 (Thermidor)', price: 200 }
            ]
          },
          {
            key: 'premium_sides',
            label: '升級',
            isMultiple: true,
            options: [
              { value: 'caviar', label: '頂級魚子醬 (10g)', price: 1200 },
              { value: 'asparagus', label: '炭烤大蘆筍', price: 280, isDefault: true },
              { value: 'risotto', label: '帕瑪森起司燉飯', price: 350 }
            ]
          }
        ]
      },
      {
        id: 'tofu_skin',
        name: '皮蛋豆腐',
        price: 200,
        optionGroups:[
          {
            key: 'spicy',
            label: '辣度',
            type: 'select',
            options: [
              { value: 'none', label: '不辣', isDefault: true }
            ]
          }
        ]
      },
      {
        id: 'plum_wine',
        name: '酒酸梅',
        price: 80,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'xs', label: '迷你份', price: 0, isDefault: true }
            ]
          }
        ]
      },
      {
        id: 'shrimp_spring_roll',
        name: '蝦春捲',
        price: 200,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'small', label: '小份', price: 0, isDefault: true }
            ]
          }
        ]
      },
      {
        id: 'test_skin',
        name: '測試名稱超激長長長長長長芹測試名稱超激長長長長長長芹菜菜',
        price: 20099,
        optionGroups:[
          {
            key: 'spicy',
            label: '辣度',
            type: 'select',
            options: [
              { value: 'none', label: '不辣', isDefault: true },
              { value: 'mild', label: '小辣' },
              { value: 'hot', label: '大辣' }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'tofu', label: '長長長長長長長長測試名稱超激長長長長長長芹菜長長文字測試小魚豆腐', price: 1920 },
              { value: 'bean_sprout', label: '鹹蛋豆芽菜', price: 20 },
              { value: 'veggie_soup', label: '蔬菜湯', price: 10 },
              { value: 'egg_soup', label: '蛋花湯', price: 10 }
            ]
          }
        ]
      },
    ]
  },
  {
    key: 'main_course',
    label: '主菜',
    items: [
      {
        id:   'honey_roast_pork',
        name: '蜜汁叉燒',
        price: 180,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'small', label: '小份', price: 0, isDefault: true },
              { value: 'large', label: '大份', price: 129 }
            ]
          },
          {
            key: 'flavor',
            label: '調味',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'default', label: '不加調味', price: 0, isDefault: true },
              { value: 'honey', label: '蜜汁多', price: 0 },
              { value: 'add_onion_salt_sauce', label: '多一份蔥鹽醬', price: 0 }
            ]
          }
        ]
      },
      {
        id: 'kung_pao_chicken',
        name: '宮保雞丁',
        price: 230,
        optionGroups:[
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'medium', label: '中份', price: 0, isDefault: true },
              { value: 'large', label: '大份', price: 126 },
              { value: 'extra_large', label: '超大份', price: 192 }
            ]
          },
          {
            key: 'spicy',
            label: '辣度',
            type: 'select',
            options: [
              { value: 'mild', label: '小辣', isDefault: true},
              { value: 'medium', label: '中辣' },
              { value: 'hot', label: '大辣' }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'tofu', label: '小魚豆腐', price: 20 },
              { value: 'bean_sprout', label: '鹹蛋豆芽菜', price: 20 },
              { value: 'veggie_soup', label: '蔬菜湯', price: 10 },
              { value: 'egg_soup', label: '蛋花湯', price: 10 }
            ]
          }
        ]
      },
      {
        id: 'cream_roasted_lobster',
        name: '奶油烤龍蝦',
        price: 899,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'default', label: '中份', price: 0, isDefault: true },
              { value: 'add_half', label: '多半隻', price: 459 }
            ]
          },
          {
            key: 'spicy',
            label: '辣度',
            type: 'select',
            options: [
              { value: 'none', label: '不辣', isDefault: true },
              { value: 'medium', label: '中辣' },
              { value: 'hot', label: '大辣' }
            ]
          },
          {
            key: 'flavor',
            label: '調味',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'default', label: '不加調味', price: 0, isDefault: true },
              { value: 'basil_cream', label: '羅勒奶油', price: 0 },
              { value: 'garlic_cream', label: '蒜香奶油', price: 0 },
              { value: 'chili_cream', label: '辣椒奶油', price: 0 }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'cream_corn', label: '奶油玉米', price: 80 },
              { value: 'cream_spinach', label: '奶油菠菜', price: 120 },
              { value: 'truffle_potato', label: '松露薯條', price: 160 },
              { value: 'white_sauce_cauliflower', label: '白醬花椰菜', price: 120 }
            ]
          },
        ]
      },
      {
        id: 'lemon_garlic_shrimp',
        name: '檸檬蒜香蝦',
        price: 320,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'small', label: '小份', price: 0, isDefault: true },
              { value: 'large', label: '大份', price: 49 }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'lemon_garlic_sauce', label: '檸檬蒜香醬', price: 0, isDefault: true },
              { value: 'garlic_sauce', label: '蒜香醬', price: 0 },
              { value: 'chili_sauce', label: '辣椒醬', price: 0 }
            ]
          }
        ]
      },
      {
        id: 'prime_rib_steak',
        name: '熟成肋眼牛排',
        price: 1290,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'small', label: '8oz', price: 0, isDefault: true },
              { value: 'large', label: '12oz', price: 1290 },
              { value: 'extra_large', label: '16oz', price: 1920 }
            ]
          },
          {
            key: 'ripeness',
            label: '熟度',
            type: 'select',
            options: [
              { value: 'rare', label: '一分熟' },
              { value: 'medium_rare', label: '三分熟', isDefault: true },
              { value: 'medium', label: '五分熟' },
              { value: 'medium_well', label: '七分熟' },
              { value: 'well_done', label: '全熟' },
            ]
          },
          {
            key: 'flavor',
            label: '調味',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'default', label: '不加調味', price: 0, isDefault: true },
              { value: 'rose_salt', label: '玫瑰鹽', price: 0 },
              { value: 'pepper', label: '黑胡椒', price: 0 },
              { value: 'mustard', label: '黃芥末', price: 0 },
              { value: 'garlic', label: '蒜', price: 0 },
              { value: 'parsley', label: '巴西利', price: 0 },
              { value: 'rosemary', label: '迷迭香', price: 0 }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'baked_potato', label: '烤馬鈴薯', price: 210 },
              { value: 'cream_spinach', label: '奶油菠菜', price: 220 },
              { value: 'cream_corn', label: '奶油玉米', price: 150 },
              { value: 'truffle_potato', label: '松露薯條', price: 180 },
              { value: 'white_sauce_cauliflower', label: '白醬花椰菜', price: 120 }
            ]
          }
        ]
      },
      {
        id: 'magic_panda_tofu',
        name: '大魔術熊貓豆腐',
        price: 280,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'small', label: '小份', price: 0, isDefault: true },
              { value: 'large', label: '大份', price: 109 }
            ]
          },
          {
            key: 'spicy',
            label: '辣度',
            type: 'select',
            options: [
              { value: 'none', label: '不辣' },
              { value: 'mild', label: '小辣' },
              { value: 'medium', label: '中辣', isDefault: true },
              { value: 'hot', label: '大辣' }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'tofu', label: '小魚豆腐', price: 20 },
              { value: 'bean_sprout', label: '鹹蛋豆芽菜', price: 20 },
              { value: 'veggie_soup', label: '蔬菜湯', price: 10 },
              { value: 'egg_soup', label: '蛋花湯', price: 10 }
            ]
          }
        ]
      },
      {
        id: 'prime_filet_steak',
        name: '熟成菲力牛排',
        price: 1290,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'small', label: '8oz', price: 0, isDefault: true },
              { value: 'large', label: '12oz', price: 1290 },
              { value: 'extra_large', label: '16oz', price: 1920 }
            ]
          },
          {
            key: 'ripeness',
            label: '熟度',
            type: 'select',
            options: [
              { value: 'rare', label: '一分熟' },
              { value: 'medium_rare', label: '三分熟', isDefault: true },
              { value: 'medium', label: '五分熟' },
              { value: 'medium_well', label: '七分熟' },
              { value: 'well_done', label: '全熟' },
            ]
          },
          {
            key: 'flavor',
            label: '調味',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'default', label: '不加調味', price: 0, isDefault: true },
              { value: 'rose_salt', label: '玫瑰鹽', price: 0 },
              { value: 'pepper', label: '黑胡椒', price: 0 },
              { value: 'mustard', label: '黃芥末', price: 0 },
              { value: 'garlic', label: '蒜', price: 0 },
              { value: 'parsley', label: '巴西利', price: 0 },
              { value: 'rosemary', label: '迷迭香', price: 0 }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'baked_potato', label: '烤馬鈴薯', price: 210 },
              { value: 'cream_spinach', label: '奶油菠菜', price: 220 },
              { value: 'cream_corn', label: '奶油玉米', price: 150 },
              { value: 'truffle_potato', label: '松露薯條', price: 180 },
              { value: 'white_sauce_cauliflower', label: '白醬花椰菜', price: 120 }
            ]
          }
        ]
      },
      {
        id: 'prime_new_york_steak',
        name: '紐約客牛排',
        price: 1290,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'small', label: '8oz', price: 0, isDefault: true },
              { value: 'large', label: '12oz', price: 680 },
              { value: 'extra_large', label: '16oz', price: 999 }
            ]
          },
          {
            key: 'ripeness',
            label: '熟度',
            type: 'select',
            options: [
              { value: 'rare', label: '一分熟' },
              { value: 'medium_rare', label: '三分熟', isDefault: true },
              { value: 'medium', label: '五分熟' },
              { value: 'medium_well', label: '七分熟' },
              { value: 'well_done', label: '全熟' },
            ]

          },
          {
            key: 'flavor',
            label: '調味',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'default', label: '不加調味', price: 0, isDefault: true },
              { value: 'rose_salt', label: '玫瑰鹽', price: 0 },
              { value: 'pepper', label: '黑胡椒', price: 0 },
              { value: 'mustard', label: '黃芥末', price: 0 },
              { value: 'garlic', label: '蒜', price: 0 },
              { value: 'parsley', label: '巴西利', price: 0 },
              { value: 'rosemary', label: '迷迭香', price: 0 }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'baked_potato', label: '烤馬鈴薯', price: 210 },
              { value: 'cream_spinach', label: '奶油菠菜', price: 220 },
              { value: 'cream_corn', label: '奶油玉米', price: 150 },
              { value: 'truffle_potato', label: '松露薯條', price: 180 },
              { value: 'white_sauce_cauliflower', label: '白醬花椰菜', price: 120 }
            ]
          }
        ]
      },
      {
        id: 'golden_laugh',
        name: '黃金開口笑',
        price: 220,
        optionGroups:[
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'small', label: '小份', price: 0, isDefault: true },
              { value: 'large', label: '大份', price: 49 }
            ]
          },
          {
            key: 'spicy',
            label: '辣度',
            type: 'select',
            options: [
              { value: 'none', label: '不辣', isDefault: true },
              { value: 'mild', label: '小辣' },
              { value: 'medium', label: '中辣' },
              { value: 'hot', label: '大辣' }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'tofu', label: '小魚豆腐', price: 20 },
              { value: 'bean_sprout', label: '鹹蛋豆芽菜', price: 20 },
              { value: 'veggie_soup', label: '蔬菜湯', price: 10 },
              { value: 'egg_soup', label: '蛋花湯', price: 10 }
            ]
          }
        ]
      },
      {
        id: 'grandma_braised_pork',
        name: '阿媽紅燒肉',
        price: 220,
        optionGroups:[
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'small', label: '小份', price: 0, isDefault: true },
              { value: 'large', label: '大份', price: 49 }
            ]
          },
          {
            key: 'spicy',
            label: '辣度',
            type: 'select',
            options: [
              { value: 'none', label: '不辣', isDefault: true },
              { value: 'mild', label: '小辣' },
              { value: 'medium', label: '中辣' },
              { value: 'hot', label: '大辣' }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'tofu', label: '小魚豆腐', price: 20 },
              { value: 'bean_sprout', label: '鹹蛋豆芽菜', price: 20 },
              { value: 'veggie_soup', label: '蔬菜湯', price: 10 },
              { value: 'egg_soup', label: '蛋花湯', price: 10 }
            ]
          }
        ]
      },
      {
        id: 'master_dry_aged_ribeye',
        name: '極選 28天乾式熟成肋眼',
        price: 2680,
        optionGroups: [
          {
            key: 'beef_origin',
            label: '產地',
            type: 'select',
            options: [
              { value: 'usda_prime', label: '美國 USDA Prime', price: 0, isDefault: true },
              { value: 'au_wagyu_m9', label: '澳洲 M9 和牛', price: 1200 },
              { value: 'jp_a5_hyogo', label: '日本 兵庫縣 A5 和牛', price: 2800 }
            ]
          },
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: '12oz', label: '12oz (標準)', price: 0, isDefault: true },
              { value: '16oz', label: '16oz (分享)', price: 800 },
              { value: '24oz', label: '24oz (戰斧等級)', price: 1800 }
            ]
          },
          {
            key: 'ripeness',
            label: '熟度',
            type: 'select',
            options: [
              { value: 'rare', label: '一分熟' },
              { value: 'medium_rare', label: '三分熟', isDefault: true },
              { value: 'medium', label: '五分熟' },
              { value: 'medium_well', label: '七分熟' },
              { value: 'well_done', label: '全熟' }
            ]
          },
          {
            key: 'crust_style',
            label: '外烤法',
            type: 'select',
            options: [
              { value: 'classic', label: '經典炙烤', isDefault: true },
              { value: 'pittsburgh', label: '匹茲堡焦黑 (Charred)' },
              { value: 'butter_basted', label: '法國發酵奶油淋澆', price: 150 }
            ]
          },
          {
            key: 'premium_sides',
            label: '升級',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'foie_gras', label: '現煎香料鵝肝', price: 680 },
              { value: 'shaved_truffle', label: '現磨新鮮黑松露', price: 500 },
              { value: 'lobster_tail', label: '波士頓龍蝦尾 (半隻)', price: 880 }
            ]
          }
        ]
      },
      {
        id: 'atlantic_seafood_platter',
        name: '大西洋極鮮海鮮盤',
        price: 1880,
        optionGroups: [
          {
            key: 'sauce_selection',
            label: '醬汁',
            type: 'select',
            options: [
              { value: 'lemon_butter', label: '香檸奶油醬', isDefault: true },
              { value: 'garlic_white_wine', label: '蒜香白酒汁' },
              { value: 'saffron_veloute', label: '番紅花天鵝絨醬', price: 120 }
            ]
          },
          {
            key: 'prep_method',
            label: '烹調',
            type: 'select',
            options: [
              { value: 'grilled', label: '炭烤 (Grilled)', isDefault: true },
              { value: 'steamed', label: '清蒸 (Steamed)' },
              { value: 'thermidor', label: '焗烤法式龍蝦式 (Thermidor)', price: 200 }
            ]
          },
          {
            key: 'premium_sides',
            label: '升級',
            isMultiple: true,
            options: [
              { value: 'caviar', label: '頂級魚子醬 (10g)', price: 1200 },
              { value: 'asparagus', label: '炭烤大蘆筍', price: 280, isDefault: true },
              { value: 'risotto', label: '帕瑪森起司燉飯', price: 350 }
            ]
          }
        ]
      }
    ]
  },
  {
    key: 'rice_noodle',
    label: '主食',
    items: [
      {
        id: 'fried_rice_pork',
        name: '豬肉炒飯',
        price: 180,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'small', label: '小份', price: 0 },
              { value: 'large', label: '大份', price: 49 }
            ]
          },
          {
            key: 'spicy',
            label: '辣度',
            type: 'select',
            options: [
              { value: 'none', label: '不辣' },
              { value: 'mild', label: '小辣' },
              { value: 'medium', label: '中辣' },
              { value: 'hot', label: '大辣' }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'tofu', label: '小魚豆腐', price: 20 },
              { value: 'bean_sprout', label: '鹹蛋豆芽菜', price: 20 },
              { value: 'veggie_soup', label: '蔬菜湯', price: 10 },
              { value: 'egg_soup', label: '蛋花湯', price: 10 }
            ]
          }
        ]
      },
      {
        id: 'fried_rice_golden_egg',
        name: '黃金蛋炒飯',
        price: 200,
        optionGroups:[
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'small', label: '小份', price: 0 },
              { value: 'large', label: '大份', price: 49 }
            ]
          },
          {
            key: 'spicy',
            label: '辣度',
            type: 'select',
            options: [
              { value: 'none', label: '不辣' },
              { value: 'mild', label: '小辣' },
              { value: 'medium', label: '中辣' },
              { value: 'hot', label: '大辣' }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'tofu', label: '小魚豆腐', price: 20 },
              { value: 'bean_sprout', label: '鹹蛋豆芽菜', price: 20 },
              { value: 'veggie_soup', label: '蔬菜湯', price: 10 },
              { value: 'egg_soup', label: '蛋花湯', price: 10 }
            ]
          }
        ]
      },
      {
        id: 'fried_rice_sm',
        name: '小炒飯',
        price: 200,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'xs', label: '迷你份', price: 0 },
              { value: 'small', label: '小份', price: 22 },
              { value: 'medium', label: '中份', price: 40 }
            ]
          },
          {
            key: 'spicy',
            label: '辣度',
            type: 'select',
            options: [
              { value: 'none', label: '不辣' },
              { value: 'medium', label: '中辣' },
              { value: 'hot', label: '大辣' }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'tofu', label: '小魚豆腐', price: 20 },
              { value: 'bean_sprout', label: '鹹蛋豆芽菜', price: 20 },
              { value: 'veggie_soup', label: '蔬菜湯', price: 10 },
              { value: 'egg_soup', label: '蛋花湯', price: 10 }
            ]
          }
        ]
      },
      {
        id: 'fried_rice_chicken_crown',
        name: '一番雞皇炒飯',
        price: 200,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'small', label: '小份', price: 0 },
              { value: 'large', label: '大份', price: 49 }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'tofu', label: '小魚豆腐', price: 20 },
              { value: 'bean_sprout', label: '鹹蛋豆芽菜', price: 20 },
              { value: 'veggie_soup', label: '蔬菜湯', price: 10 },
              { value: 'egg_soup', label: '蛋花湯', price: 10 }
            ]
          }
        ]
      },
      {
        id: 'fried_rice_sea_king',
        name: '海霸王炒飯',
        price: 200,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'small', label: '小份', price: 0 },
              { value: 'large', label: '大份', price: 49 }
            ]
          },
          {
            key: 'spicy',
            label: '辣度',
            type: 'select',
            options: [
              { value: 'none', label: '不辣' },
              { value: 'hot', label: '大辣' }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'tofu', label: '小魚豆腐', price: 20 },
              { value: 'bean_sprout', label: '鹹蛋豆芽菜', price: 20 },
              { value: 'veggie_soup', label: '蔬菜湯', price: 10 },
              { value: 'egg_soup', label: '蛋花湯', price: 10 }
            ]
          }
        ]
      },
      {
        id: 'fried_rice_vegetarian',
        name: '素香椿炒飯',
        price: 200,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'small', label: '小份', price: 0 },
              { value: 'large', label: '大份', price: 49 }
            ]
          },
          {
            key: 'spicy',
            label: '辣度',
            type: 'select',
            options: [
              { value: 'none', label: '不辣' },
              { value: 'mild', label: '小辣' },
              { value: 'medium', label: '中辣' },
              { value: 'hot', label: '大辣' }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'tofu', label: '小魚豆腐', price: 20 },
              { value: 'bean_sprout', label: '鹹蛋豆芽菜', price: 20 },
              { value: 'veggie_soup', label: '蔬菜湯', price: 10 },
              { value: 'egg_soup', label: '蛋花湯', price: 10 }
            ]
          }
        ]
      },
      {
        id: 'fried_rice_SSR',
        name: '世紀厲害炒飯',
        price: 200,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'small', label: '小份', price: 0 },
              { value: 'large', label: '大份', price: 49 }
            ]
          },
          {
            key: 'spicy',
            label: '辣度',
            type: 'select',
            options: [
              { value: 'none', label: '不辣' },
              { value: 'mild', label: '小辣' },
              { value: 'medium', label: '中辣' },
              { value: 'hot', label: '大辣' }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'tofu', label: '小魚豆腐', price: 20 },
              { value: 'bean_sprout', label: '鹹蛋豆芽菜', price: 20 },
              { value: 'veggie_soup', label: '蔬菜湯', price: 10 },
              { value: 'egg_soup', label: '蛋花湯', price: 10 }
            ]
          }
        ]
      }
    ]
  },
  {
    key: 'soup',
    label: '湯品',
    items: [
      {
        id: 'noodle_beef',
        name: '牛肉炒麵',
        price: 200,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'small', label: '小份', price: 0 },
              { value: 'large', label: '大份', price: 49 }
            ]
          },
          {
            key: 'spicy',
            label: '辣度',
            type: 'select',
            options: [
              { value: 'none', label: '不辣' },
              { value: 'mild', label: '小辣' },
              { value: 'medium', label: '中辣' },
              { value: 'hot', label: '大辣' }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'tofu', label: '小魚豆腐', price: 20 },
              { value: 'bean_sprout', label: '鹹蛋豆芽菜', price: 20 },
              { value: 'veggie_soup', label: '蔬菜湯', price: 10 },
              { value: 'egg_soup', label: '蛋花湯', price: 10 }
            ]
          }
        ]
      },
      {
        id: 'noodle_shrimp',
        name: '蝦仁炒麵',
        price: 200,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'small', label: '小份', price: 0 },
              { value: 'large', label: '大份', price: 49 }
            ]
          },
          {
            key: 'spicy',
            label: '辣度',
            type: 'select',
            options: [
              { value: 'none', label: '不辣' },
              { value: 'mild', label: '小辣' },
              { value: 'medium', label: '中辣' },
              { value: 'hot', label: '大辣' }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'tofu', label: '小魚豆腐', price: 20 },
              { value: 'bean_sprout', label: '鹹蛋豆芽菜', price: 20 },
              { value: 'veggie_soup', label: '蔬菜湯', price: 10 },
              { value: 'egg_soup', label: '蛋花湯', price: 10 }
            ]
          }
        ]
      },
      {
        id: 'noodle_pork',
        name: '豬肉炒麵',
        price: 200,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'small', label: '小份', price: 0 },
              { value: 'large', label: '大份', price: 49 }
            ]
          },
          {
            key: 'spicy',
            label: '辣度',
            type: 'select',
            options: [
              { value: 'none', label: '不辣' },
              { value: 'mild', label: '小辣' },
              { value: 'medium', label: '中辣' },
              { value: 'hot', label: '大辣' }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'tofu', label: '小魚豆腐', price: 20 },
              { value: 'bean_sprout', label: '鹹蛋豆芽菜', price: 20 },
              { value: 'veggie_soup', label: '蔬菜湯', price: 10 },
              { value: 'egg_soup', label: '蛋花湯', price: 10 }
            ]
          }
        ]
      },
      {
        id: 'noodle_vegetable',
        name: '蔬菜炒麵',
        price: 200,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'small', label: '小份', price: 0 },
              { value: 'large', label: '大份', price: 49 }
            ]
          },
          {
            key: 'spicy',
            label: '辣度',
            type: 'select',
            options: [
              { value: 'none', label: '不辣' },
              { value: 'mild', label: '小辣' },
              { value: 'medium', label: '中辣' },
              { value: 'hot', label: '大辣' }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'tofu', label: '小魚豆腐', price: 20 },
              { value: 'bean_sprout', label: '鹹蛋豆芽菜', price: 20 },
              { value: 'veggie_soup', label: '蔬菜湯', price: 10 },
              { value: 'egg_soup', label: '蛋花湯', price: 10 }
            ]
          }
        ]
      },
      {
        id: 'noodle_chicken',
        name: '雞肉炒麵',
        price: 200,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'small', label: '小份', price: 0 },
              { value: 'large', label: '大份', price: 49 }
            ]
          },
          {
            key: 'spicy',
            label: '辣度',
            type: 'select',
            options: [
              { value: 'none', label: '不辣' },
              { value: 'mild', label: '小辣' },
              { value: 'medium', label: '中辣' },
              { value: 'hot', label: '大辣' }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'tofu', label: '小魚豆腐', price: 20 },
              { value: 'bean_sprout', label: '鹹蛋豆芽菜', price: 20 },
              { value: 'veggie_soup', label: '蔬菜湯', price: 10 },
              { value: 'egg_soup', label: '蛋花湯', price: 10 }
            ]
          }
        ]
      },
      {
        id: 'noodle_duck',
        name: '鴨肉炒麵',
        price: 200,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'small', label: '小份', price: 0 },
              { value: 'large', label: '大份', price: 49 }
            ]
          },
          {
            key: 'spicy',
            label: '辣度',
            type: 'select',
            options: [
              { value: 'none', label: '不辣' },
              { value: 'mild', label: '小辣' },
              { value: 'medium', label: '中辣' },
              { value: 'hot', label: '大辣' }
            ]
          },
          {
            key: 'sides',
            label: '配菜',
            type: 'select',
            isMultiple: true,
            options: [
              { value: 'tofu', label: '小魚豆腐', price: 20 },
              { value: 'bean_sprout', label: '鹹蛋豆芽菜', price: 20 },
              { value: 'veggie_soup', label: '蔬菜湯', price: 10 },
              { value: 'egg_soup', label: '蛋花湯', price: 10 }
            ]
          }
        ]
      }
    ]
  },
  {
    key: 'drink',
    label: '飲料',
    items: [
      {
        id: 'black_sugar_pearl_milk',
        name: '黑糖珍珠鮮奶',
        price: 18880,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'md', label: '中杯', price: 0, isDefault: true },
              { value: 'lg', label: '大杯', price: 10 },
              { value: 'xl', label: '壺裝', price: 110 }
            ]
          },
          {
            key: 'sweetness',
            label: '甜度',
            type: 'select',
            options: [
              { value: 'full', label: '全糖', price: 0, isDefault: true },
            ]
          },
          {
            key: 'ice',
            label: '冰塊',
            type: 'select',
            options: [
              { value: 'full', label: '正常冰', price: 0, isDefault: true },
            ]
          }
        ]
      },
      {
        id: 'watermelon_lemon',
        name: '冬瓜檸檬',
        price: 80,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'md', label: '中杯', price: 0, isDefault: true },
              { value: 'lg', label: '大杯', price: 10 },
              { value: 'xl', label: '壺裝', price: 110 }
            ]
          },
          {
            key: 'sweetness',
            label: '甜度',
            type: 'select',
            options: [
              { value: 'full', label: '全糖', price: 0, isDefault: true },
            ]
          },
          {
            key: 'ice',
            label: '冰塊',
            type: 'select',
            options: [
              { value: 'full', label: '正常冰', price: 0, isDefault: true },
              { value: 'less', label: '少冰', price: 0 },
              { value: 'half', label: '微冰', price: 0 },
              { value: 'quarter', label: '去冰', price: 0 },
              { value: 'none', label: '常溫', price: 0 },
            ]
          }
        ]
      },
      {
        id: 'plum_wine',
        name: '梅子酒',
        price: 160,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'xs', label: '單杯', price: 0, isDefault: true },
              { value: 's', label: '一瓶', price: 1160 }
            ]
          }
        ]
      },
      {
        id: 'high_mountain_pear_tea',
        name: '高山梨茶',
        price: 40,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'md', label: '中杯', price: 0, isDefault: true },
              { value: 'lg', label: '大杯', price: 10 },
              { value: 'xl', label: '壺裝', price: 110 }
            ]
          },
          {
            key: 'sweetness',
            label: '甜度',
            type: 'select',
            options: [
              { value: 'full', label: '全糖', price: 0, isDefault: true },
              { value: 'less', label: '少糖', price: 0 },
              { value: 'half', label: '半糖', price: 0 },
              { value: 'quarter', label: '微糖', price: 0 },
              { value: 'none', label: '無糖', price: 0 },
            ]
          },
          {
            key: 'ice',
            label: '冰塊',
            type: 'select',
            options: [
              { value: 'full', label: '正常冰', price: 0, isDefault: true },
              { value: 'less', label: '少冰', price: 0 },
              { value: 'half', label: '微冰', price: 0 },
              { value: 'quarter', label: '去冰', price: 0 },
              { value: 'none', label: '常溫', price: 0 },
            ]
          },
          {
            key: 'toppings',
            label: '加料',
            type: 'select',
            options: [
              { value: 'pearl', label: '珍珠', price: 10 },
              { value: 'boba', label: '波霸', price: 10 },
              { value: 'grass_jelly', label: '仙草', price: 10 },
              { value: 'coconut_jelly', label: '椰果', price: 10 },
              { value: 'pudding', label: '布丁', price: 15 },
              { value: 'almond_tea_jelly', label: '杏仁茶凍', price: 15 },
              { value: 'red_bean', label: '紅豆', price: 15 },
              { value: 'ice_cream', label: '冰淇淋', price: 15 },
              { value: 'taro_ball', label: '芋圓', price: 15 },
            ]
          }
        ]
      },
      {
        id: 'chanterelle_black_tea',
        name: '初韻紅茶',
        price: 40,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'md', label: '中杯', price: 0, isDefault: true },
              { value: 'lg', label: '大杯', price: 10 },
              { value: 'xl', label: '壺裝', price: 110 }
            ]
          },
          {
            key: 'sweetness',
            label: '甜度',
            type: 'select',
            options: [
              { value: 'full', label: '全糖', price: 0, isDefault: true },
              { value: 'less', label: '少糖', price: 0 },
              { value: 'half', label: '半糖', price: 0 },
              { value: 'quarter', label: '微糖', price: 0 },
              { value: 'none', label: '無糖', price: 0 },
            ]
          },
          {
            key: 'ice',
            label: '冰塊',
            type: 'select',
            options: [
              { value: 'full', label: '正常冰', price: 0, isDefault: true },
              { value: 'less', label: '少冰', price: 0 },
              { value: 'half', label: '微冰', price: 0 },
              { value: 'quarter', label: '去冰', price: 0 },
              { value: 'none', label: '常溫', price: 0 },
            ]
          },
          {
            key: 'toppings',
            label: '加料',
            type: 'select',
            options: [
              { value: 'pearl', label: '珍珠', price: 10 },
              { value: 'boba', label: '波霸', price: 10 },
              { value: 'grass_jelly', label: '仙草', price: 10 },
              { value: 'coconut_jelly', label: '椰果', price: 10 },
              { value: 'pudding', label: '布丁', price: 15 },
              { value: 'almond_tea_jelly', label: '杏仁茶凍', price: 15 },
              { value: 'red_bean', label: '紅豆', price: 15 },
              { value: 'ice_cream', label: '冰淇淋', price: 15 },
              { value: 'taro_ball', label: '芋圓', price: 15 },
            ]
          }
        ]
      },
      {
        id: 'spring_tea',
        name: '四季春',
        price: 40,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'md', label: '中杯', price: 0, isDefault: true },
              { value: 'lg', label: '大杯', price: 10 },
              { value: 'xl', label: '壺裝', price: 110 }
            ]
          },
          {
            key: 'sweetness',
            label: '甜度',
            type: 'select',
            options: [
              { value: 'full', label: '全糖', price: 0, isDefault: true },
              { value: 'less', label: '少糖', price: 0 },
              { value: 'half', label: '半糖', price: 0 },
              { value: 'quarter', label: '微糖', price: 0 },
              { value: 'none', label: '無糖', price: 0 },
            ]
          },
          {
            key: 'ice',
            label: '冰塊',
            type: 'select',
            options: [
              { value: 'full', label: '正常冰', price: 0, isDefault: true },
              { value: 'less', label: '少冰', price: 0 },
              { value: 'half', label: '微冰', price: 0 },
              { value: 'quarter', label: '去冰', price: 0 },
              { value: 'none', label: '常溫', price: 0 },
            ]
          },
          {
            key: 'toppings',
            label: '加料',
            type: 'select',
            options: [
              { value: 'pearl', label: '珍珠', price: 10 },
              { value: 'boba', label: '波霸', price: 10 },
              { value: 'grass_jelly', label: '仙草', price: 10 },
              { value: 'coconut_jelly', label: '椰果', price: 10 },
              { value: 'pudding', label: '布丁', price: 15 },
              { value: 'almond_tea_jelly', label: '杏仁茶凍', price: 15 },
              { value: 'red_bean', label: '紅豆', price: 15 },
              { value: 'ice_cream', label: '冰淇淋', price: 15 },
              { value: 'taro_ball', label: '芋圓', price: 15 },
            ]
          }
        ]
      },
      {
        id: 'oatmeal_milk_tea',
        name: '燕麥鮮奶',
        price: 40,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'md', label: '中杯', price: 0, isDefault: true },
              { value: 'lg', label: '大杯', price: 10 },
              { value: 'xl', label: '壺裝', price: 110 }
            ]
          },
          {
            key: 'sweetness',
            label: '甜度',
            type: 'select',
            options: [
              { value: 'full', label: '全糖', price: 0, isDefault: true },
              { value: 'less', label: '少糖', price: 0 },
              { value: 'half', label: '半糖', price: 0 },
              { value: 'quarter', label: '微糖', price: 0 },
              { value: 'none', label: '無糖', price: 0 },
            ]
          },
          {
            key: 'ice',
            label: '冰塊',
            type: 'select',
            options: [
              { value: 'full', label: '正常冰', price: 0, isDefault: true },
              { value: 'less', label: '少冰', price: 0 },
              { value: 'half', label: '微冰', price: 0 },
              { value: 'quarter', label: '去冰', price: 0 },
              { value: 'none', label: '常溫', price: 0 },
            ]
          },
          {
            key: 'toppings',
            label: '加料',
            type: 'select',
            options: [
              { value: 'pearl', label: '珍珠', price: 10 },
              { value: 'boba', label: '波霸', price: 10 },
              { value: 'grass_jelly', label: '仙草', price: 10 },
              { value: 'coconut_jelly', label: '椰果', price: 10 },
              { value: 'pudding', label: '布丁', price: 15 },
              { value: 'almond_tea_jelly', label: '杏仁茶凍', price: 15 },
              { value: 'red_bean', label: '紅豆', price: 15 },
              { value: 'ice_cream', label: '冰淇淋', price: 15 },
              { value: 'taro_ball', label: '芋圓', price: 15 },
            ]
          }
        ]
      },
      {
        id: 'autumn_green_tea',
        name: '秋青',
        price: 40,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'md', label: '中杯', price: 0, isDefault: true },
              { value: 'lg', label: '大杯', price: 10 },
              { value: 'xl', label: '壺裝', price: 110 }
            ]
          },
          {
            key: 'sweetness',
            label: '甜度',
            type: 'select',
            options: [
              { value: 'full', label: '全糖', price: 0, isDefault: true },
              { value: 'less', label: '少糖', price: 0 },
              { value: 'half', label: '半糖', price: 0 },
              { value: 'quarter', label: '微糖', price: 0 },
              { value: 'none', label: '無糖', price: 0 },
            ]
          },
          {
            key: 'ice',
            label: '冰塊',
            type: 'select',
            options: [
              { value: 'full', label: '正常冰', price: 0, isDefault: true },
              { value: 'less', label: '少冰', price: 0 },
              { value: 'half', label: '微冰', price: 0 },
              { value: 'quarter', label: '去冰', price: 0 },
              { value: 'none', label: '常溫', price: 0 },
            ]
          },
          {
            key: 'toppings',
            label: '加料',
            type: 'select',
            options: [
              { value: 'pearl', label: '珍珠', price: 10 },
              { value: 'boba', label: '波霸', price: 10 },
              { value: 'grass_jelly', label: '仙草', price: 10 },
              { value: 'coconut_jelly', label: '椰果', price: 10 },
              { value: 'pudding', label: '布丁', price: 15 },
              { value: 'almond_tea_jelly', label: '杏仁茶凍', price: 15 },
              { value: 'red_bean', label: '紅豆', price: 15 },
              { value: 'ice_cream', label: '冰淇淋', price: 15 },
              { value: 'taro_ball', label: '芋圓', price: 15 },
            ]
          }
        ]
      },
      {
        id: 'winter_red_tea',
        name: '紛冬',
        price: 40,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'md', label: '中杯', price: 0, isDefault: true },
              { value: 'lg', label: '大杯', price: 10 },
              { value: 'xl', label: '壺裝', price: 110 }
            ]
          },
          {
            key: 'sweetness',
            label: '甜度',
            type: 'select',
            options: [
              { value: 'full', label: '全糖', price: 0, isDefault: true },
              { value: 'less', label: '少糖', price: 0 },
              { value: 'half', label: '半糖', price: 0 },
              { value: 'quarter', label: '微糖', price: 0 },
              { value: 'none', label: '無糖', price: 0 },
            ]
          },
          {
            key: 'ice',
            label: '冰塊',
            type: 'select',
            options: [
              { value: 'full', label: '正常冰', price: 0, isDefault: true },
              { value: 'less', label: '少冰', price: 0 },
              { value: 'half', label: '微冰', price: 0 },
              { value: 'quarter', label: '去冰', price: 0 },
              { value: 'none', label: '常溫', price: 0 },
            ]
          },
          {
            key: 'toppings',
            label: '加料',
            type: 'select',
            options: [
              { value: 'pearl', label: '珍珠', price: 10 },
              { value: 'boba', label: '波霸', price: 10 },
              { value: 'grass_jelly', label: '仙草', price: 10 },
              { value: 'coconut_jelly', label: '椰果', price: 10 },
              { value: 'pudding', label: '布丁', price: 15 },
              { value: 'almond_tea_jelly', label: '杏仁茶凍', price: 15 },
              { value: 'red_bean', label: '紅豆', price: 15 },
              { value: 'ice_cream', label: '冰淇淋', price: 15 },
              { value: 'taro_ball', label: '芋圓', price: 15 },
            ]
          }
        ]
      },
      {
        id: 'golden_horseradish_tea',
        name: '黃金蕎麥茶',
        price: 40,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'md', label: '中杯', price: 0, isDefault: true },
              { value: 'lg', label: '大杯', price: 10 },
              { value: 'xl', label: '壺裝', price: 110 }
            ]
          },
          {
            key: 'sweetness',
            label: '甜度',
            type: 'select',
            options: [
              { value: 'full', label: '全糖', price: 0, isDefault: true },
              { value: 'less', label: '少糖', price: 0 },
              { value: 'half', label: '半糖', price: 0 },
              { value: 'quarter', label: '微糖', price: 0 },
              { value: 'none', label: '無糖', price: 0 },
            ]
          },
          {
            key: 'ice',
            label: '冰塊',
            type: 'select',
            options: [
              { value: 'full', label: '正常冰', price: 0, isDefault: true },
              { value: 'less', label: '少冰', price: 0 },
              { value: 'half', label: '微冰', price: 0 },
              { value: 'quarter', label: '去冰', price: 0 },
              { value: 'none', label: '常溫', price: 0 },
            ]
          },
          {
            key: 'toppings',
            label: '加料',
            type: 'select',
            options: [
              { value: 'pearl', label: '珍珠', price: 10 },
              { value: 'boba', label: '波霸', price: 10 },
              { value: 'grass_jelly', label: '仙草', price: 10 },
              { value: 'coconut_jelly', label: '椰果', price: 10 },
              { value: 'pudding', label: '布丁', price: 15 },
              { value: 'almond_tea_jelly', label: '杏仁茶凍', price: 15 },
              { value: 'red_bean', label: '紅豆', price: 15 },
              { value: 'ice_cream', label: '冰淇淋', price: 15 },
              { value: 'taro_ball', label: '芋圓', price: 15 },
            ]
          }
        ]
      },
      {
        id: 'sugar_roasted_horseradish_tea',
        name: '烤糖蕎麥凍奶青',
        price: 40,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'md', label: '中杯', price: 0, isDefault: true },
              { value: 'lg', label: '大杯', price: 10 },
              { value: 'xl', label: '壺裝', price: 110 }
            ]
          },
          {
            key: 'sweetness',
            label: '甜度',
            type: 'select',
            options: [
              { value: 'full', label: '全糖', price: 0, isDefault: true },
              { value: 'less', label: '少糖', price: 0 },
              { value: 'half', label: '半糖', price: 0 },
              { value: 'quarter', label: '微糖', price: 0 },
              { value: 'none', label: '無糖', price: 0 },
            ]
          },
          {
            key: 'ice',
            label: '冰塊',
            type: 'select',
            options: [
              { value: 'full', label: '正常冰', price: 0, isDefault: true },
              { value: 'less', label: '少冰', price: 0 },
              { value: 'half', label: '微冰', price: 0 },
              { value: 'quarter', label: '去冰', price: 0 },
              { value: 'none', label: '常溫', price: 0 },
            ]
          },
          {
            key: 'toppings',
            label: '加料',
            type: 'select',
            options: [
              { value: 'pearl', label: '珍珠', price: 10 },
              { value: 'boba', label: '波霸', price: 10 },
              { value: 'grass_jelly', label: '仙草', price: 10 },
              { value: 'coconut_jelly', label: '椰果', price: 10 },
              { value: 'pudding', label: '布丁', price: 15 },
              { value: 'almond_tea_jelly', label: '杏仁茶凍', price: 15 },
              { value: 'red_bean', label: '紅豆', price: 15 },
              { value: 'ice_cream', label: '冰淇淋', price: 15 },
              { value: 'taro_ball', label: '芋圓', price: 15 },
            ]
          }
        ]
      },
      {
        id: 'signature_americano',
        name: '招牌美式',
        price: 40,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'md', label: '中杯', price: 0, isDefault: true },
              { value: 'lg', label: '大杯', price: 10 },
              { value: 'xl', label: '壺裝', price: 110 }
            ]
          },
          {
            key: 'sweetness',
            label: '甜度',
            type: 'select',
            options: [
              { value: 'full', label: '全糖', price: 0, isDefault: true },
              { value: 'less', label: '少糖', price: 0 },
              { value: 'half', label: '半糖', price: 0 },
              { value: 'quarter', label: '微糖', price: 0 },
              { value: 'none', label: '無糖', price: 0 },
            ]
          },
          {
            key: 'ice',
            label: '冰塊',
            type: 'select',
            options: [
              { value: 'full', label: '正常冰', price: 0, isDefault: true },
              { value: 'less', label: '少冰', price: 0 },
              { value: 'half', label: '微冰', price: 0 },
              { value: 'quarter', label: '去冰', price: 0 },
              { value: 'none', label: '常溫', price: 0 },
            ]
          },
          {
            key: 'roast',
            label: '烘培',
            type: 'select',
            options: [
              { value: 'dark', label: '深烘培', price: 10 },
              { value: 'medium', label: '中烘培', price: 10 },
              { value: 'light', label: '淺烘培', price: 10 },
            ]
          }
        ]
      },{
        id: 'thick_latte',
        name: '厚拿鐵',
        price: 40,
        optionGroups: [
          {
            key: 'portion',
            label: '份量',
            type: 'select',
            options: [
              { value: 'md', label: '中杯', price: 0, isDefault: true },
              { value: 'lg', label: '大杯', price: 10 }
            ]
          },
          {
            key: 'sweetness',
            label: '甜度',
            type: 'select',
            options: [
              { value: 'full', label: '全糖', price: 0 },
              { value: 'less', label: '少糖', price: 0 },
              { value: 'half', label: '半糖', price: 0 },
              { value: 'quarter', label: '微糖', price: 0 },
              { value: 'none', label: '無糖', price: 0, isDefault: true },
            ]
          },
          {
            key: 'ice',
            label: '冰塊',
            type: 'select',
            options: [
              { value: 'full', label: '正常冰', price: 0, isDefault: true },
              { value: 'less', label: '少冰', price: 0 },
              { value: 'half', label: '微冰', price: 0 },
              { value: 'quarter', label: '去冰', price: 0 },
              { value: 'none', label: '常溫', price: 0 },
            ]
          },
          {
            key: 'milk',
            label: '牛奶',
            type: 'select',
            options: [
              { value: 'full', label: '全脂', price: 0, isDefault: true },
              { value: 'half', label: '低脂', price: 0 },
            ]
          },
          {
            key: 'roast',
            label: '烘培',
            type: 'select',
            options: [
              { value: 'dark', label: '深烘培', price: 10 },
              { value: 'medium', label: '中烘培', price: 10, isDefault: true },
              { value: 'light', label: '淺烘培', price: 10 },
            ]
          }
        ]
      }
    ]
  }

]

