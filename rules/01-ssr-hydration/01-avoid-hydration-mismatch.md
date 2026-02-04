---
id: ssr-01
title: 避免 Hydration Mismatch
priority: critical
category: ssr-hydration
tags: [ssr, hydration, vue3, nuxt]
---

# 避免 Hydration Mismatch

## 问题
服务端和客户端渲染结果不一致会导致 hydration 警告和潜在 bug，影响用户体验和 SEO。

## 错误示例
```vue
<template>
  <!-- 错误：Date.now() 在服务端和客户端值不同 -->
  <div>当前时间: {{ Date.now() }}</div>

  <!-- 错误：Math.random() 每次调用结果不同 -->
  <div>随机数: {{ Math.random() }}</div>

  <!-- 错误：直接访问 window 对象 -->
  <div>屏幕宽度: {{ window.innerWidth }}</div>
</template>
```

## 正确示例
```vue
<template>
  <ClientOnly>
    <div>当前时间: {{ currentTime }}</div>
  </ClientOnly>

  <!-- 或者使用条件渲染 -->
  <div v-if="isMounted">屏幕宽度: {{ screenWidth }}</div>
</template>

<script setup lang="ts">
const currentTime = ref<number | null>(null)
const screenWidth = ref(0)
const isMounted = ref(false)

onMounted(() => {
  currentTime.value = Date.now()
  screenWidth.value = window.innerWidth
  isMounted.value = true
})
</script>
```

## 原因
Nuxt SSR 首先在服务端渲染 HTML 并发送给客户端，客户端 hydration 时会将 Vue 实例"激活"到服务端渲染的 DOM 上。如果两者不一致：
1. Vue 会发出警告
2. 可能导致交互功能失效
3. 影响页面布局稳定性（CLS）

## 常见触发场景
- 使用 `Date.now()`、`Math.random()` 等非确定性函数
- 直接访问 `window`、`document`、`navigator` 等浏览器 API
- 根据用户本地存储（localStorage）渲染内容
- 使用浏览器特定的特性检测

## 检测方式
- 浏览器控制台出现 "Hydration mismatch" 或 "Hydration node mismatch" 警告
- 使用 `nuxt devtools` 检查 hydration 状态
- 开发模式下 Vue 会自动检测并警告
