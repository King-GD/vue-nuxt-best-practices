---
id: ssr-06
title: 处理异步组件的 SSR 降级
priority: medium
category: ssr-hydration
tags: [ssr, async-component, suspense]
---

# 处理异步组件的 SSR 降级

## 问题
异步组件在 SSR 时可能导致加载状态闪烁或内容缺失。

## 错误示例
```vue
<script setup lang="ts">
// 错误：未处理加载状态
const AsyncChart = defineAsyncComponent(() => import('./Chart.vue'))
</script>

<template>
  <!-- 服务端可能渲染空内容 -->
  <AsyncChart :data="chartData" />
</template>
```

## 正确示例
```vue
<script setup lang="ts">
const AsyncChart = defineAsyncComponent({
  loader: () => import('./Chart.vue'),
  loadingComponent: ChartSkeleton,
  errorComponent: ChartError,
  delay: 200,  // 延迟显示 loading
  timeout: 10000
})
</script>

<template>
  <!-- 使用 Suspense 统一处理 -->
  <Suspense>
    <AsyncChart :data="chartData" />
    <template #fallback>
      <ChartSkeleton />
    </template>
  </Suspense>
</template>
```

## Nuxt 自动懒加载
```vue
<template>
  <!-- Lazy 前缀自动启用懒加载 -->
  <LazyChart v-if="showChart" :data="chartData" />

  <!-- 结合 ClientOnly -->
  <ClientOnly>
    <LazyHeavyComponent />
    <template #fallback>
      <Skeleton />
    </template>
  </ClientOnly>
</template>
```

## 原因
- 异步组件在服务端默认会等待加载完成
- 配置 loading/error 组件提供更好的用户体验
- Suspense 可以统一管理多个异步依赖的加载状态
