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
              { value: 'small', label: '小份', price: 0 },
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
        id: 'golden_laugh',
        name: '黃金開口笑',
        price: 220,
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
              { value: 'none', label: '不辣' },
              { value: 'mild', label: '小辣' },
              { value: 'medium', label: '中辣' },
              { value: 'hot', label: '大辣' }
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
              { value: 'none', label: '不辣' },
              { value: 'mild', label: '小辣' },
              { value: 'hot', label: '大辣' }
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
              { value: 'xs', label: '迷你份', price: 0 }
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
              { value: 'small', label: '小份', price: 0 }
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
              { value: 'none', label: '不辣' },
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
              { value: 'xs', label: '迷你份', price: 0 }
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
              { value: 'xs', label: '迷你份', price: 0 }
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
              { value: 'xs', label: '單杯', price: 0 },
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
              { value: 'md', label: '中杯', price: 0 },
              { value: 'lg', label: '大杯', price: 10 },
              { value: 'xl', label: '壺裝', price: 110 }
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
              { value: 'none', label: '無糖', price: 0 },
            ]
          },
          {
            key: 'ice',
            label: '冰塊',
            type: 'select',
            options: [
              { value: 'full', label: '正常冰', price: 0 },
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
              { value: 'md', label: '中杯', price: 0 },
              { value: 'lg', label: '大杯', price: 10 },
              { value: 'xl', label: '壺裝', price: 110 }
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
              { value: 'none', label: '無糖', price: 0 },
            ]
          },
          {
            key: 'ice',
            label: '冰塊',
            type: 'select',
            options: [
              { value: 'full', label: '正常冰', price: 0 },
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
              { value: 'md', label: '中杯', price: 0 },
              { value: 'lg', label: '大杯', price: 10 },
              { value: 'xl', label: '壺裝', price: 110 }
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
              { value: 'none', label: '無糖', price: 0 },
            ]
          },
          {
            key: 'ice',
            label: '冰塊',
            type: 'select',
            options: [
              { value: 'full', label: '正常冰', price: 0 },
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
              { value: 'md', label: '中杯', price: 0 },
              { value: 'lg', label: '大杯', price: 10 },
              { value: 'xl', label: '壺裝', price: 110 }
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
              { value: 'none', label: '無糖', price: 0 },
            ]
          },
          {
            key: 'ice',
            label: '冰塊',
            type: 'select',
            options: [
              { value: 'full', label: '正常冰', price: 0 },
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
              { value: 'md', label: '中杯', price: 0 },
              { value: 'lg', label: '大杯', price: 10 },
              { value: 'xl', label: '壺裝', price: 110 }
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
              { value: 'none', label: '無糖', price: 0 },
            ]
          },
          {
            key: 'ice',
            label: '冰塊',
            type: 'select',
            options: [
              { value: 'full', label: '正常冰', price: 0 },
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
              { value: 'md', label: '中杯', price: 0 },
              { value: 'lg', label: '大杯', price: 10 },
              { value: 'xl', label: '壺裝', price: 110 }
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
              { value: 'none', label: '無糖', price: 0 },
            ]
          },
          {
            key: 'ice',
            label: '冰塊',
            type: 'select',
            options: [
              { value: 'full', label: '正常冰', price: 0 },
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
              { value: 'md', label: '中杯', price: 0 },
              { value: 'lg', label: '大杯', price: 10 },
              { value: 'xl', label: '壺裝', price: 110 }
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
              { value: 'none', label: '無糖', price: 0 },
            ]
          },
          {
            key: 'ice',
            label: '冰塊',
            type: 'select',
            options: [
              { value: 'full', label: '正常冰', price: 0 },
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
              { value: 'md', label: '中杯', price: 0 },
              { value: 'lg', label: '大杯', price: 10 },
              { value: 'xl', label: '壺裝', price: 110 }
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
              { value: 'none', label: '無糖', price: 0 },
            ]
          },
          {
            key: 'ice',
            label: '冰塊',
            type: 'select',
            options: [
              { value: 'full', label: '正常冰', price: 0 },
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
              { value: 'md', label: '中杯', price: 0 },
              { value: 'lg', label: '大杯', price: 10 },
              { value: 'xl', label: '壺裝', price: 110 }
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
              { value: 'none', label: '無糖', price: 0 },
            ]
          },
          {
            key: 'ice',
            label: '冰塊',
            type: 'select',
            options: [
              { value: 'full', label: '正常冰', price: 0 },
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
              { value: 'md', label: '中杯', price: 0 },
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
              { value: 'none', label: '無糖', price: 0 },
            ]
          },
          {
            key: 'ice',
            label: '冰塊',
            type: 'select',
            options: [
              { value: 'full', label: '正常冰', price: 0 },
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
              { value: 'full', label: '全脂', price: 0 },
              { value: 'less', label: '半脂', price: 0 },
              { value: 'half', label: '低脂', price: 0 },
              { value: 'quarter', label: '無脂', price: 0 },
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
      }
    ]
  }

]

