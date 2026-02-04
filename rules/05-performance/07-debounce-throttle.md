---
id: perf-07
title: 防抖和节流事件处理
priority: high
category: performance
tags: [performance, debounce, throttle]
---

# 防抖和节流事件处理

## 问题
高频事件（如 scroll、resize、input）会触发大量回调，影响性能。

## 错误示例
```vue
<template>
  <!-- 错误：每次输入都发起请求 -->
  <input v-model="query" @input="search" />

  <!-- 错误：scroll 事件高频触发 -->
  <div @scroll="handleScroll">...</div>
</template>

<script setup lang="ts">
async function search() {
  // 每次按键都请求 API
  results.value = await $fetch(`/api/search?q=${query.value}`)
}
</script>
```

## 正确示例（使用 VueUse）
```vue
<script setup lang="ts">
import { useDebounceFn, useThrottleFn, watchDebounced } from '@vueuse/core'

const query = ref('')
const results = ref([])

// 防抖搜索：停止输入 300ms 后执行
const debouncedSearch = useDebounceFn(async () => {
  results.value = await $fetch(`/api/search?q=${query.value}`)
}, 300)

// 或使用 watchDebounced
watchDebounced(
  query,
  async (value) => {
    results.value = await $fetch(`/api/search?q=${value}`)
  },
  { debounce: 300 }
)

// 节流滚动：最多每 100ms 执行一次
const throttledScroll = useThrottleFn((e: Event) => {
  // 处理滚动逻辑
}, 100)
</script>

<template>
  <input v-model="query" @input="debouncedSearch" />
  <div @scroll="throttledScroll">...</div>
</template>
```

## 防抖 vs 节流
| 场景 | 推荐 | 原因 |
|------|------|------|
| 搜索输入 | 防抖 | 等用户停止输入再请求 |
| 窗口 resize | 防抖 | resize 结束后调整布局 |
| 滚动加载 | 节流 | 滚动过程中持续检测 |
| 按钮点击 | 节流 | 防止重复提交 |

## 使用 lodash-es
```vue
<script setup lang="ts">
import { debounce, throttle } from 'lodash-es'

const debouncedFn = debounce(() => {
  // ...
}, 300)

// 组件卸载时取消
onUnmounted(() => {
  debouncedFn.cancel()
})
</script>
```

## 原因
- 减少不必要的函数调用
- 降低 API 请求频率
- 提升滚动等交互流畅度
- 节省计算和网络资源
