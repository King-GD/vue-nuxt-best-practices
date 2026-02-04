---
id: component-01
title: 使用 defineAsyncComponent 懒加载组件
priority: high
category: component-design
tags: [component, lazy-loading, performance]
---

# 使用 defineAsyncComponent 懒加载组件

## 问题
所有组件都同步加载会增大初始 bundle 体积，延长首屏加载时间。

## 错误示例
```vue
<script setup lang="ts">
// 错误：同步导入大型组件
import HeavyChart from './HeavyChart.vue'
import RichTextEditor from './RichTextEditor.vue'
import DataTable from './DataTable.vue'
</script>

<template>
  <HeavyChart v-if="showChart" />
  <RichTextEditor v-if="isEditing" />
</template>
```

## 正确示例
```vue
<script setup lang="ts">
// 正确：异步导入，按需加载
const HeavyChart = defineAsyncComponent(() => import('./HeavyChart.vue'))
const RichTextEditor = defineAsyncComponent(() => import('./RichTextEditor.vue'))

// 带配置的异步组件
const DataTable = defineAsyncComponent({
  loader: () => import('./DataTable.vue'),
  loadingComponent: TableSkeleton,
  errorComponent: TableError,
  delay: 200,        // 显示 loading 前的延迟
  timeout: 10000     // 超时时间
})
</script>

<template>
  <HeavyChart v-if="showChart" />
  <RichTextEditor v-if="isEditing" />
</template>
```

## Nuxt 自动懒加载
```vue
<template>
  <!-- Lazy 前缀自动启用懒加载 -->
  <LazyHeavyChart v-if="showChart" :data="chartData" />

  <!-- 等同于 -->
  <!-- defineAsyncComponent(() => import('./HeavyChart.vue')) -->
</template>
```

## 路由级别懒加载
```ts
// nuxt.config.ts 或页面组件
// Nuxt 页面默认就是懒加载的

// 手动配置组件预加载
definePageMeta({
  // 进入页面前预加载组件
})
</script>
```

## 原因
- 减少初始 bundle 体积
- 按需加载，用户不使用的功能不会加载
- 提升首屏加载速度和 LCP 指标
- Nuxt 的 Lazy 前缀让使用更简单
