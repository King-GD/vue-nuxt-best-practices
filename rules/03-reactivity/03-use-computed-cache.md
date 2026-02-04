---
id: reactivity-03
title: 正确使用 computed 缓存计算
priority: high
category: reactivity
tags: [reactivity, computed, performance]
---

# 正确使用 computed 缓存计算

## 问题
在模板中使用复杂表达式会在每次渲染时重新计算。

## 错误示例
```vue
<template>
  <!-- 错误：每次渲染都重新计算 -->
  <div>{{ items.filter(i => i.active).map(i => i.name).join(', ') }}</div>

  <!-- 错误：重复的复杂表达式 -->
  <span>活跃: {{ items.filter(i => i.active).length }}</span>
  <span>总计: {{ items.length }}</span>
  <span>比例: {{ (items.filter(i => i.active).length / items.length * 100).toFixed(1) }}%</span>
</template>

<script setup lang="ts">
// 错误：使用方法代替 computed
function getActiveItems() {
  return items.value.filter(i => i.active)
}
</script>
```

## 正确示例
```vue
<script setup lang="ts">
const items = ref<Item[]>([])

// 正确：使用 computed 缓存结果
const activeItems = computed(() => items.value.filter(i => i.active))
const activeNames = computed(() => activeItems.value.map(i => i.name).join(', '))
const activeRatio = computed(() => {
  if (!items.value.length) return '0.0'
  return (activeItems.value.length / items.value.length * 100).toFixed(1)
})
</script>

<template>
  <div>{{ activeNames }}</div>
  <span>活跃: {{ activeItems.length }}</span>
  <span>总计: {{ items.length }}</span>
  <span>比例: {{ activeRatio }}%</span>
</template>
```

## computed vs methods
```vue
<script setup lang="ts">
// computed：有缓存，依赖不变则不重新计算
const sortedItems = computed(() => {
  console.log('sorting...') // 只在 items 变化时打印
  return [...items.value].sort((a, b) => a.name.localeCompare(b.name))
})

// methods：每次调用都执行
function getSortedItems() {
  console.log('sorting...') // 每次渲染都打印
  return [...items.value].sort((a, b) => a.name.localeCompare(b.name))
}
</script>

<template>
  <!-- computed：多次引用只计算一次 -->
  <div>{{ sortedItems.length }}</div>
  <div>{{ sortedItems[0]?.name }}</div>

  <!-- methods：每次引用都重新计算 -->
  <div>{{ getSortedItems().length }}</div>
  <div>{{ getSortedItems()[0]?.name }}</div>
</template>
```

## 可写的 computed
```vue
<script setup lang="ts">
const firstName = ref('John')
const lastName = ref('Doe')

// 可写 computed
const fullName = computed({
  get: () => `${firstName.value} ${lastName.value}`,
  set: (value: string) => {
    const [first, last] = value.split(' ')
    firstName.value = first
    lastName.value = last || ''
  }
})

// 使用
fullName.value = 'Jane Smith' // 自动拆分
</script>
```

## 原因
- `computed` 基于依赖缓存，依赖不变则返回缓存值
- 避免不必要的重复计算，提升性能
- 模板更简洁易读
- Vue 的响应式系统会自动追踪依赖
