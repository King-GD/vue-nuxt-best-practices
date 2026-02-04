---
id: fetch-04
title: 正确设置 key 避免重复请求
priority: high
category: data-fetching
tags: [data-fetching, cache, key]
---

# 正确设置 key 避免重复请求

## 问题
相同的请求可能被多次发起，浪费带宽和服务器资源。

## 错误示例
```vue
<script setup lang="ts">
const route = useRoute()

// 错误：每次组件重新挂载都会发起新请求
const { data } = await useFetch(`/api/article/${route.params.id}`)

// 错误：动态 URL 没有设置 key，可能导致缓存问题
const { data: user } = await useFetch(() => `/api/users/${userId.value}`)
</script>
```

## 正确示例
```vue
<script setup lang="ts">
const route = useRoute()

// 正确：设置唯一 key，相同 key 复用缓存
const { data } = await useFetch(`/api/article/${route.params.id}`, {
  key: `article-${route.params.id}`
})

// 正确：使用 useAsyncData 明确设置 key
const { data: user } = await useAsyncData(
  `user-${userId.value}`,
  () => $fetch(`/api/users/${userId.value}`)
)
</script>
```

## 监听参数变化自动刷新
```vue
<script setup lang="ts">
const route = useRoute()

// watch: true 会在 URL 变化时自动刷新
const { data } = await useFetch(() => `/api/article/${route.params.id}`, {
  key: `article-${route.params.id}`,
  watch: [() => route.params.id]
})

// 或使用计算属性作为 URL
const apiUrl = computed(() => `/api/search?q=${searchQuery.value}`)
const { data, refresh } = await useFetch(apiUrl, {
  key: () => `search-${searchQuery.value}`
})
</script>
```

## 手动刷新和清除缓存
```vue
<script setup lang="ts">
const { data, refresh, clear } = await useFetch('/api/data', {
  key: 'my-data'
})

// 刷新数据（使用缓存 key）
async function handleRefresh() {
  await refresh()
}

// 清除缓存并刷新
async function handleClearAndRefresh() {
  clear()
  await refresh()
}

// 全局清除缓存
function clearAllCache() {
  clearNuxtData()
  // 或清除特定 key
  clearNuxtData('my-data')
}
</script>
```

## 原因
- `useFetch` 默认使用 URL 作为缓存 key
- 相同 key 的请求会复用缓存数据
- 正确的 key 策略可以避免重复请求，提升性能
- 动态 URL 需要明确的 key 策略来确保正确的缓存行为
