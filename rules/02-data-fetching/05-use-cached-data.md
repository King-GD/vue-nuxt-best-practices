---
id: fetch-05
title: 使用 getCachedData 实现 SWR
priority: medium
category: data-fetching
tags: [data-fetching, cache, swr]
---

# 使用 getCachedData 实现 SWR

## 问题
页面切换时总是等待新数据加载，用户体验不够流畅。

## 错误示例
```vue
<script setup lang="ts">
// 每次导航都等待数据加载完成
const { data, pending } = await useFetch('/api/products')
// 用户看到 loading 状态直到数据返回
</script>
```

## 正确示例
```vue
<script setup lang="ts">
// SWR: Stale-While-Revalidate
// 先显示缓存数据，后台刷新
const { data, pending } = await useFetch('/api/products', {
  getCachedData(key, nuxtApp) {
    // 返回缓存数据（如果存在）
    return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
  }
})
</script>
```

## 带过期时间的 SWR
```vue
<script setup lang="ts">
const { data } = await useFetch('/api/products', {
  getCachedData(key, nuxtApp) {
    const cached = nuxtApp.payload.data[key]

    if (!cached) return undefined

    // 检查是否过期（5分钟）
    const expirationDate = new Date(cached.fetchedAt)
    expirationDate.setMinutes(expirationDate.getMinutes() + 5)

    if (expirationDate < new Date()) {
      return undefined // 过期，重新获取
    }

    return cached
  },
  transform(data) {
    return {
      ...data,
      fetchedAt: new Date().toISOString()
    }
  }
})
</script>
```

## 全局配置 SWR
```ts
// plugins/swr.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:created', () => {
    const cache = new Map()

    nuxtApp.payload.getCachedData = (key) => {
      return cache.get(key)
    }

    nuxtApp.hooks.hook('app:data:refresh', (keys) => {
      keys?.forEach(key => cache.delete(key))
    })
  })
})
```

## 原因
- SWR 模式让用户立即看到内容，提升感知速度
- 后台刷新确保数据最终一致性
- 适合列表页、搜索结果等可容忍短暂过期的场景
