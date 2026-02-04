---
id: ssr-02
title: 正确使用 ClientOnly 组件
priority: critical
category: ssr-hydration
tags: [ssr, client-only, nuxt]
---

# 正确使用 ClientOnly 组件

## 问题
某些组件或功能只能在客户端运行（如依赖浏览器 API 的第三方库），需要正确处理 SSR 场景。

## 错误示例
```vue
<template>
  <!-- 错误：ECharts 依赖 DOM，服务端会报错 -->
  <VChart :option="chartOption" />

  <!-- 错误：直接使用依赖 window 的组件 -->
  <ThirdPartyMap :center="mapCenter" />
</template>
```

## 正确示例
```vue
<template>
  <!-- 使用 ClientOnly 包裹客户端专属组件 -->
  <ClientOnly>
    <VChart :option="chartOption" />
    <template #fallback>
      <div class="chart-skeleton">图表加载中...</div>
    </template>
  </ClientOnly>

  <!-- 懒加载 + ClientOnly 结合 -->
  <ClientOnly>
    <LazyThirdPartyMap :center="mapCenter" />
  </ClientOnly>
</template>

<script setup lang="ts">
// 使用 defineAsyncComponent 进一步优化
const VChart = defineAsyncComponent(() => import('vue-echarts'))
</script>
```

## 最佳实践

### 1. 提供 fallback 内容
```vue
<ClientOnly>
  <HeavyComponent />
  <template #fallback>
    <SkeletonLoader />
  </template>
</ClientOnly>
```

### 2. 结合 .client.vue 后缀
```
components/
  MyChart.client.vue    # 自动仅在客户端加载
  MyChart.server.vue    # 可选：服务端替代内容
```

### 3. 使用 import.meta.client 条件判断
```vue
<script setup lang="ts">
if (import.meta.client) {
  // 仅在客户端执行的逻辑
  const analytics = await import('~/utils/analytics')
  analytics.init()
}
</script>
```

## 原因
- `<ClientOnly>` 确保其子组件只在客户端渲染
- 服务端会渲染 fallback 内容（如果提供）
- 避免 SSR 阶段访问不存在的浏览器 API

## 适用场景
- 图表库（ECharts、Chart.js）
- 地图组件（高德、Google Maps）
- 富文本编辑器
- 依赖 Canvas/WebGL 的组件
- 需要访问 localStorage/sessionStorage 的组件
