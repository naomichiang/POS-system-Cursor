// 付款方式配置
// 新增付款方式時，只需在此處添加配置即可

import {
  CircleDollarSign,
  CreditCard,
  Smartphone,
  Ticket
} from 'lucide-vue-next'

export const paymentMethodsConfig = [
  {
    id: 'cash',
    label: '現 金',
    icon: CircleDollarSign,
    hasIcon: true,
    paddingClass: 'pr-6 gap-4',
    color: 'bg-yellow-400',
    displayLabel: '現金'
  },
  {
    id: 'credit',
    label: '信 用 卡',
    icon: CreditCard,
    hasIcon: true,
    paddingClass: 'pr-6 gap-4',
    color: 'bg-green-500',
    displayLabel: '信用卡'
  },
  {
    id: 'mobile',
    label: '電子支付',
    icon: Smartphone,
    hasIcon: true,
    paddingClass: 'pr-6 gap-4',
    color: 'bg-blue-500',
    displayLabel: '電子支付'
  },
  {
    id: 'gift',
    label: 'SOGO 現金券',
    icon: Ticket,
    hasIcon: false, // 禮券不顯示圖標
    paddingClass: 'gap-2',
    color: 'bg-purple-500',
    displayLabel: 'SOGO 現金券'
  }
]

// 根據 id 獲取付款方式配置
export const getPaymentMethodById = (id) => {
  return paymentMethodsConfig.find(method => method.id === id) || null
}

// 獲取所有付款方式 id 的類型（用於 TypeScript）
export const paymentIds = paymentMethodsConfig.map(method => method.id)
