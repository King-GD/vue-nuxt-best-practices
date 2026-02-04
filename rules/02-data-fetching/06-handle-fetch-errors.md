---
id: fetch-06
title: 正确处理请求错误状态
priority: high
category: data-fetching
tags: [data-fetching, error-handling, ux]
---

# 正确处理请求错误状态

## 问题
未处理的请求错误会导致页面白屏或用户困惑。

## 错误示例
```vue
<script setup lang="ts">
// 错误：没有处理 error 状态
const { data } = await useFetch('/api/users')
</script>

<template>
  <!-- 如果请求失败，data 为 null，页面可能报错 -->
  <div>{{ data.users.length }} 个用户</div>
</template>
```

## 正确示例
```vue
<script setup lang="ts">
const { data, pending, error, refresh } = await useFetch('/api/users')
</script>

<template>
  <!-- 加载状态 -->
  <div v-if="pending" class="loading">
    <Spinner />
    <span>加载中...</span>
  </div>

  <!-- 错误状态 -->
  <div v-else-if="error" class="error">
    <p>加载失败: {{ error.message }}</p>
    <button @click="refresh()">重试</button>
  </div>

  <!-- 空数据状态 -->
  <div v-else-if="!data?.users?.length" class="empty">
    <p>暂无数据</p>
  </div>

  <!-- 正常状态 -->
  <ul v-else>
    <li v-for="user in data.users" :key="user.id">
      {{ user.name }}
    </li>
  </ul>
</template>
```

## 使用 onError 回调
```vue
<script setup lang="ts">
const { data } = await useFetch('/api/users', {
  onRequestError({ error }) {
    console.error('请求错误:', error)
  },
  onResponseError({ response }) {
    if (response.status === 401) {
      navigateTo('/login')
    } else if (response.status === 404) {
      throw createError({ statusCode: 404, message: '资源不存在' })
    }
  }
})
</script>
```

## 全局错误处理
```ts
// plugins/fetch-error.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:error', (error) => {
    console.error('应用错误:', error)
  })

  // 全局 $fetch 拦截
  globalThis.$fetch = $fetch.create({
    onResponseError({ response }) {
      if (response.status === 401) {
        nuxtApp.runWithContext(() => navigateTo('/login'))
      }
    }
  })
})
```

## 原因
- 网络请求可能因各种原因失败
- 良好的错误处理提升用户体验
- 提供重试机制让用户可以自行恢复
- 区分不同错误类型给予适当反馈
