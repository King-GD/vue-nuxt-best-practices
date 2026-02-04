---
id: perf-05
title: 避免模板中的复杂表达式
priority: high
category: performance
tags: [performance, template, computed]
---

# 避免模板中的复杂表达式

## 问题
模板中的复杂表达式在每次渲染时都会重新计算。

## 错误示例
```vue
<template>
  <!-- 错误：每次渲染都执行过滤和排序 -->
  <div v-for="item in items.filter(i => i.active).sort((a, b) => a.name.localeCompare(b.name))" :key="item.id">
    {{ item.name }}
  </div>

  <!-- 错误：复杂的格式化逻辑 -->
  <span>{{ new Date(timestamp).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>

  <!-- 错误：多次调用方法 -->
  <div>
    <span>{{ formatPrice(item.price) }}</span>
    <span>{{ formatPrice(item.discount) }}</span>
    <span>{{ formatPrice(item.price - item.discount) }}</span>
  </div>
</template>
```

## 正确示例
```vue
<script setup lang="ts">
const items = ref<Item[]>([])

// 使用 computed 缓存计算结果
const activeItems = computed(() =>
  items.value
    .filter(i => i.active)
    .sort((a, b) => a.name.localeCompare(b.name))
)

// 格式化函数
const formattedDate = computed(() =>
  new Date(timestamp.value).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
)

// 价格相关计算
const priceInfo = computed(() => ({
  price: formatPrice(item.value.price),
  discount: formatPrice(item.value.discount),
  final: formatPrice(item.value.price - item.value.discount)
}))
</script>

<template>
  <div v-for="item in activeItems" :key="item.id">
    {{ item.name }}
  </div>

  <span>{{ formattedDate }}</span>

  <div>
    <span>{{ priceInfo.price }}</span>
    <span>{{ priceInfo.discount }}</span>
    <span>{{ priceInfo.final }}</span>
  </div>
</template>
```

## 原因
- 模板表达式在每次渲染时执行
- computed 有缓存，依赖不变则不重新计算
- 复杂逻辑放在 script 中更易测试和维护
