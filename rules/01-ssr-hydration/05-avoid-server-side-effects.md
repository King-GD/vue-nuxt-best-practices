---
id: ssr-05
title: 避免服务端副作用
priority: high
category: ssr-hydration
tags: [ssr, side-effects, memory-leak]
---

# 避免服务端副作用

## 问题
服务端渲染时产生的副作用（定时器、全局状态修改）会导致内存泄漏和跨请求污染。

## 错误示例
```vue
<script setup lang="ts">
// 错误：服务端设置定时器永远不会清理
setInterval(() => {
  refreshData()
}, 5000)

// 错误：修改全局/模块级状态会污染其他请求
globalState.currentUser = user

// 错误：服务端建立 WebSocket 连接
const ws = new WebSocket('wss://api.example.com')
</script>
```

## 正确示例
```vue
<script setup lang="ts">
// 定时器只在客户端设置
onMounted(() => {
  const timer = setInterval(() => {
    refreshData()
  }, 5000)

  // 组件卸载时清理
  onUnmounted(() => {
    clearInterval(timer)
  })
})

// 使用 useState 替代全局状态（Nuxt 会隔离每个请求）
const currentUser = useState('currentUser', () => null)

// WebSocket 只在客户端建立
const ws = ref<WebSocket | null>(null)
onMounted(() => {
  ws.value = new WebSocket('wss://api.example.com')
})
onUnmounted(() => {
  ws.value?.close()
})
</script>
```

## 使用 VueUse 管理副作用
```vue
<script setup lang="ts">
import { useIntervalFn, useWebSocket } from '@vueuse/core'

// 自动处理 SSR 和清理
const { pause, resume } = useIntervalFn(() => {
  refreshData()
}, 5000)

// WebSocket 自动处理连接和断开
const { status, data, send } = useWebSocket('wss://api.example.com')
</script>
```

## 原因
- 服务端是多用户共享的环境，每个请求应该相互隔离
- 服务端没有组件"卸载"的概念，定时器会持续运行造成内存泄漏
- 模块级变量在服务端会跨请求共享，导致数据污染

## 检查清单
- [ ] 定时器（setTimeout/setInterval）是否在 onMounted 中设置？
- [ ] 事件监听是否在 onUnmounted 中移除？
- [ ] 是否使用 useState 替代模块级状态？
- [ ] WebSocket/EventSource 是否只在客户端建立？
