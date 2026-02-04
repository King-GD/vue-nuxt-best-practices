---
id: fetch-01
title: 使用 useFetch 而非 $fetch
priority: critical
category: data-fetching
tags: [data-fetching, usefetch, ssr]
---

# 使用 useFetch 而非 $fetch

## 问题
在组件中直接使用 `$fetch` 会导致数据重复获取，服务端获取一次，客户端 hydration 后又获取一次。

## 错误示例
```vue
<script setup lang="ts">
// 错误：$fetch 不会利用 SSR payload
const data = ref(null)

onMounted(async () => {
  data.value = await $fetch('/api/users')
})

// 错误：即使在 setup 顶层也会重复请求
const users = await $fetch('/api/users')
</script>
```

## 正确示例
```vue
<script setup lang="ts">
// 正确：useFetch 自动处理 SSR 缓存
const { data: users, pending, error, refresh } = await useFetch('/api/users')

// 带参数请求
const { data: user } = await useFetch(() => `/api/users/${userId.value}`)

// POST 请求
const { data } = await useFetch('/api/users', {
  method: 'POST',
  body: { name: 'John' }
})
</script>

<template>
  <div v-if="pending">加载中...</div>
  <div v-else-if="error">错误: {{ error.message }}</div>
  <ul v-else>
    <li v-for="user in users" :key="user.id">{{ user.name }}</li>
  </ul>
</template>
```

## 何时使用 $fetch
```vue
<script setup lang="ts">
// $fetch 适用于事件处理等非 SSR 场景
async function handleSubmit() {
  await $fetch('/api/submit', {
    method: 'POST',
    body: formData.value
  })
}

// 或在服务端 API 路由中
// server/api/users.ts
export default defineEventHandler(async () => {
  // 服务端到服务端请求用 $fetch
  const data = await $fetch('https://external-api.com/data')
  return data
})
</script>
```

## 原因
- `useFetch` 服务端获取的数据会通过 payload 传递给客户端
- 客户端 hydration 时直接使用缓存数据，不会重复请求
- 提供 `pending`、`error`、`refresh` 等响应式状态
- 自动处理请求去重和缓存
