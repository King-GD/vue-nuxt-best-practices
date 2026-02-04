---
id: fetch-03
title: 使用 lazy 延迟非关键数据
priority: high
category: data-fetching
tags: [data-fetching, lazy, performance]
---

# 使用 lazy 延迟非关键数据

## 问题
所有数据都阻塞渲染会延长首屏时间，非关键数据应该延迟加载。

## 错误示例
```vue
<script setup lang="ts">
// 错误：所有数据都阻塞 SSR
const { data: mainContent } = await useFetch('/api/content')      // 关键
const { data: recommendations } = await useFetch('/api/recommend') // 非关键
const { data: comments } = await useFetch('/api/comments')         // 非关键
const { data: analytics } = await useFetch('/api/analytics')       // 非关键
</script>
```

## 正确示例
```vue
<script setup lang="ts">
// 关键数据：阻塞渲染
const { data: mainContent } = await useFetch('/api/content')

// 非关键数据：lazy 模式，不阻塞 SSR
const { data: recommendations, pending: recPending } = useLazyFetch('/api/recommend')
const { data: comments, pending: commentsPending } = useLazyFetch('/api/comments')

// 或使用 lazy 选项
const { data: analytics } = useFetch('/api/analytics', { lazy: true })
</script>

<template>
  <!-- 主内容立即显示 -->
  <MainContent :data="mainContent" />

  <!-- 推荐内容懒加载 -->
  <div v-if="recPending">
    <RecommendSkeleton />
  </div>
  <Recommendations v-else :data="recommendations" />

  <!-- 评论懒加载 -->
  <Suspense>
    <Comments :data="comments" />
    <template #fallback>
      <CommentsSkeleton />
    </template>
  </Suspense>
</template>
```

## 服务端 vs 客户端获取
```vue
<script setup lang="ts">
// server: false - 只在客户端获取（适合用户特定数据）
const { data: userPrefs } = useFetch('/api/preferences', {
  server: false
})

// lazy + server: false - 客户端懒加载
const { data: history } = useFetch('/api/history', {
  lazy: true,
  server: false
})
</script>
```

## 原因
- 首屏只需要渲染关键内容
- 非关键数据延迟加载可以显著减少 TTFB（首字节时间）
- 使用骨架屏提供更好的加载体验
- 渐进式加载让用户更快看到可交互内容
