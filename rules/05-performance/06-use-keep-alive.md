---
id: perf-06
title: 使用 keep-alive 缓存组件状态
priority: medium
category: performance
tags: [performance, keep-alive, cache]
---

# 使用 keep-alive 缓存组件状态

## 问题
频繁切换的组件每次都重新创建，丢失状态且有性能开销。

## 错误示例
```vue
<template>
  <!-- 错误：每次切换 tab 都重新创建组件 -->
  <component :is="currentTab" />

  <!-- 错误：路由切换丢失表单状态 -->
  <NuxtPage />
</template>
```

## 正确示例
```vue
<template>
  <!-- 缓存动态组件 -->
  <KeepAlive>
    <component :is="currentTab" />
  </KeepAlive>

  <!-- 指定缓存哪些组件 -->
  <KeepAlive :include="['TabA', 'TabB']">
    <component :is="currentTab" />
  </KeepAlive>

  <!-- 限制缓存数量 -->
  <KeepAlive :max="5">
    <component :is="currentTab" />
  </KeepAlive>
</template>
```

## Nuxt 路由缓存
```vue
<!-- app.vue -->
<template>
  <NuxtLayout>
    <NuxtPage :keepalive="{ include: ['search', 'list'] }" />
  </NuxtLayout>
</template>

<!-- 或在页面中配置 -->
<!-- pages/search.vue -->
<script setup lang="ts">
definePageMeta({
  keepalive: true
})
</script>
```

## 生命周期钩子
```vue
<script setup lang="ts">
// keep-alive 专属生命周期
onActivated(() => {
  // 组件被激活时（从缓存中恢复）
  refreshData()
})

onDeactivated(() => {
  // 组件被缓存时
  pauseTimer()
})
</script>
```

## 原因
- 避免重复创建组件的开销
- 保持组件状态（表单输入、滚动位置等）
- 适合 tab 切换、列表详情来回切换场景
- 使用 include/exclude 精确控制缓存范围
