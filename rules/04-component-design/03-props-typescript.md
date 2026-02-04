---
id: component-03
title: Props 使用 TypeScript 类型定义
priority: high
category: component-design
tags: [component, props, typescript]
---

# Props 使用 TypeScript 类型定义

## 问题
运行时 props 定义缺乏类型安全，容易出错且 IDE 支持差。

## 错误示例
```vue
<script setup lang="ts">
// 错误：运行时定义，类型不够精确
const props = defineProps({
  id: Number,
  name: String,
  items: Array,
  config: Object
})

// 错误：使用 any
const props = defineProps<{
  data: any
}>()
</script>
```

## 正确示例
```vue
<script setup lang="ts">
// 正确：使用接口定义精确类型
interface User {
  id: number
  name: string
  email: string
}

interface Props {
  user: User
  items: string[]
  loading?: boolean
  size?: 'small' | 'medium' | 'large'
}

const props = defineProps<Props>()

// 带默认值
const props = withDefaults(defineProps<Props>(), {
  loading: false,
  size: 'medium',
  items: () => []  // 引用类型需要工厂函数
})
</script>
```

## 复杂类型定义
```vue
<script setup lang="ts">
// 泛型组件
interface Props<T> {
  items: T[]
  selected?: T
  renderItem?: (item: T) => string
}

// Vue 3.3+ 支持泛型组件
const props = defineProps<Props<T>>()

// 事件类型定义
interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'submit', data: FormData): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

// 或使用简化语法
const emit = defineEmits<{
  'update:modelValue': [value: string]
  submit: [data: FormData]
  cancel: []
}>()
</script>
```

## 提取可复用类型
```ts
// types/components.ts
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

export interface TableColumn<T> {
  key: keyof T
  label: string
  width?: number
  sortable?: boolean
  render?: (value: T[keyof T], row: T) => VNode
}
```

## 原因
- TypeScript 类型在编译时检查，运行时零开销
- IDE 自动补全和错误提示
- 重构时自动发现类型不匹配
- 代码更清晰，文档化更好
