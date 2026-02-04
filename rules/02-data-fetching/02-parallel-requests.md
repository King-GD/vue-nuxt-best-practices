---
id: fetch-02
title: 并行化多个数据请求
priority: critical
category: data-fetching
tags: [data-fetching, waterfall, performance]
---

# 并行化多个数据请求

## 问题
串行的数据请求会形成瀑布流，显著增加页面加载时间。

## 错误示例
```vue
<script setup lang="ts">
// 错误：串行请求，总时间 = 请求1 + 请求2 + 请求3
const { data: user } = await useFetch('/api/user')
const { data: posts } = await useFetch('/api/posts')
const { data: comments } = await useFetch('/api/comments')
// 如果每个请求 200ms，总共需要 600ms
</script>
```

## 正确示例
```vue
<script setup lang="ts">
// 正确：并行请求，总时间 = max(请求1, 请求2, 请求3)
const [
  { data: user },
  { data: posts },
  { data: comments }
] = await Promise.all([
  useFetch('/api/user'),
  useFetch('/api/posts'),
  useFetch('/api/comments')
])
// 如果每个请求 200ms，总共只需要约 200ms
</script>
```

## 有依赖关系时的处理
```vue
<script setup lang="ts">
// 第一层：无依赖的请求并行
const [{ data: user }, { data: config }] = await Promise.all([
  useFetch('/api/user'),
  useFetch('/api/config')
])

// 第二层：依赖第一层结果的请求
const { data: userPosts } = await useFetch(
  () => `/api/users/${user.value?.id}/posts`,
  { immediate: !!user.value }
)
```

## 使用 useAsyncData 处理复杂场景
```vue
<script setup lang="ts">
const { data: pageData } = await useAsyncData('page-data', async () => {
  const [user, posts, comments] = await Promise.all([
    $fetch('/api/user'),
    $fetch('/api/posts'),
    $fetch('/api/comments')
  ])

  return { user, posts, comments }
})
</script>
```

## 原因
- 网络请求是 I/O 操作，并行执行可以显著减少总时间
- 瀑布流模式在慢网络下尤其明显
- 用户感知的加载时间直接影响体验和转化率
