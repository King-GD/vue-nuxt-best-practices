---
id: ssr-03
title: 使用 onMounted 处理浏览器 API
priority: critical
category: ssr-hydration
tags: [ssr, lifecycle, browser-api]
---

# 使用 onMounted 处理浏览器 API

## 问题
在 `<script setup>` 顶层直接访问浏览器 API 会导致服务端渲染错误。

## 错误示例
```vue
<script setup lang="ts">
// 错误：setup 阶段在服务端也会执行
const width = window.innerWidth
const token = localStorage.getItem('token')
const userAgent = navigator.userAgent

// 错误：顶层添加事件监听
window.addEventListener('resize', handleResize)
</script>
```

## 正确示例
```vue
<script setup lang="ts">
const width = ref(0)
const token = ref<string | null>(null)
const userAgent = ref('')

onMounted(() => {
  // 浏览器 API 只在客户端 mounted 后访问
  width.value = window.innerWidth
  token.value = localStorage.getItem('token')
  userAgent.value = navigator.userAgent

  // 事件监听也在 mounted 中添加
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 记得清理事件监听
  window.removeEventListener('resize', handleResize)
})

function handleResize() {
  width.value = window.innerWidth
}
</script>
```

## 使用 VueUse 简化
```vue
<script setup lang="ts">
import { useWindowSize, useLocalStorage } from '@vueuse/core'

// VueUse 的 composables 已经处理了 SSR 兼容
const { width, height } = useWindowSize()
const token = useLocalStorage('token', null)
</script>
```

## 原因
- `<script setup>` 中的代码在服务端和客户端都会执行
- `onMounted` 只在客户端执行，此时 DOM 和浏览器 API 可用
- 直接访问 `window`/`document` 在 Node.js 环境会抛出 ReferenceError

## 推荐的 VueUse Composables
| API | VueUse 替代 |
|-----|------------|
| window.innerWidth | `useWindowSize()` |
| localStorage | `useLocalStorage()` |
| navigator.userAgent | `useUserAgent()` |
| document.title | `useTitle()` |
| matchMedia | `useMediaQuery()` |
