---
id: fetch-02
title: Parallelize Multiple Data Requests
priority: critical
category: data-fetching
tags: [data-fetching, waterfall, performance]
---

# Parallelize Multiple Data Requests

## Problem
Sequential data requests create a waterfall pattern, significantly increasing page load time.

## Bad Example
```vue
<script setup lang="ts">
// Bad: Sequential requests, total time = request1 + request2 + request3
const { data: user } = await useFetch('/api/user')
const { data: posts } = await useFetch('/api/posts')
const { data: comments } = await useFetch('/api/comments')
// If each request takes 200ms, total is 600ms
</script>
```

## Good Example
```vue
<script setup lang="ts">
// Correct: Parallel requests, total time = max(request1, request2, request3)
const [
  { data: user },
  { data: posts },
  { data: comments }
] = await Promise.all([
  useFetch('/api/user'),
  useFetch('/api/posts'),
  useFetch('/api/comments')
])
// If each request takes 200ms, total is only about 200ms
</script>
```

## Handling Dependencies Between Requests
```vue
<script setup lang="ts">
// First layer: Parallel requests with no dependencies
const [{ data: user }, { data: config }] = await Promise.all([
  useFetch('/api/user'),
  useFetch('/api/config')
])

// Second layer: Requests that depend on first layer results
const { data: userPosts } = await useFetch(
  () => `/api/users/${user.value?.id}/posts`,
  { immediate: !!user.value }
)
```

## Using useAsyncData for Complex Scenarios
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

## Why
- Network requests are I/O operations, parallel execution significantly reduces total time
- Waterfall pattern is especially noticeable on slow networks
- User-perceived loading time directly affects experience and conversion rates
