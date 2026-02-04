---
id: fetch-07
title: 使用 useAsyncData 处理复杂逻辑
priority: medium
category: data-fetching
tags: [data-fetching, async-data, transform]
---

# 使用 useAsyncData 处理复杂逻辑

## 问题
`useFetch` 适合简单请求，复杂数据获取和转换需要更灵活的方式。

## 错误示例
```vue
<script setup lang="ts">
// 错误：多次请求后手动组合数据
const { data: user } = await useFetch('/api/user')
const { data: posts } = await useFetch('/api/posts')
const { data: comments } = await useFetch('/api/comments')

// 手动计算组合数据
const pageData = computed(() => ({
  user: user.value,
  postCount: posts.value?.length,
  commentCount: comments.value?.length
}))
</script>
```

## 正确示例
```vue
<script setup lang="ts">
// 使用 useAsyncData 统一处理
const { data: pageData, pending, error } = await useAsyncData(
  'page-data',
  async () => {
    const [user, posts, comments] = await Promise.all([
      $fetch('/api/user'),
      $fetch('/api/posts'),
      $fetch('/api/comments')
    ])

    // 直接返回组合后的数据
    return {
      user,
      postCount: posts.length,
      recentComments: comments.slice(0, 5),
      hasMoreComments: comments.length > 5
    }
  }
)
</script>
```

## 数据转换 transform
```vue
<script setup lang="ts">
const { data: users } = await useFetch('/api/users', {
  // 在客户端和服务端都执行
  transform(response) {
    return response.data.map(user => ({
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar || '/default-avatar.png'
    }))
  }
})
</script>
```

## 结合外部数据源
```vue
<script setup lang="ts">
const searchQuery = ref('')

const { data: results } = await useAsyncData(
  () => `search-${searchQuery.value}`,
  async () => {
    if (!searchQuery.value) return []

    // 可以调用任何异步函数，不限于 $fetch
    const response = await someExternalSDK.search(searchQuery.value)
    return response.items
  },
  {
    watch: [searchQuery],
    immediate: false
  }
)
</script>
```

## useFetch vs useAsyncData
| 场景 | 推荐 |
|------|------|
| 简单 API 请求 | `useFetch` |
| 多个请求组合 | `useAsyncData` |
| 需要复杂转换 | `useAsyncData` |
| 非 HTTP 数据源 | `useAsyncData` |
| 需要自定义缓存 key | 两者都可 |

## 原因
- `useAsyncData` 提供更大的灵活性
- 可以组合多个数据源
- 支持任意异步操作，不限于 fetch
- 转换逻辑集中管理，更易维护
