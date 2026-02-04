---
id: fetch-07
title: Use useAsyncData for Complex Logic
priority: medium
category: data-fetching
tags: [data-fetching, async-data, transform]
---

# Use useAsyncData for Complex Logic

## Problem
`useFetch` is suitable for simple requests. Complex data fetching and transformation needs more flexibility.

## Bad Example
```vue
<script setup lang="ts">
// Bad: Multiple requests then manually combining data
const { data: user } = await useFetch('/api/user')
const { data: posts } = await useFetch('/api/posts')
const { data: comments } = await useFetch('/api/comments')

// Manually computing combined data
const pageData = computed(() => ({
  user: user.value,
  postCount: posts.value?.length,
  commentCount: comments.value?.length
}))
</script>
```

## Good Example
```vue
<script setup lang="ts">
// Use useAsyncData for unified handling
const { data: pageData, pending, error } = await useAsyncData(
  'page-data',
  async () => {
    const [user, posts, comments] = await Promise.all([
      $fetch('/api/user'),
      $fetch('/api/posts'),
      $fetch('/api/comments')
    ])

    // Return combined data directly
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

## Data Transformation with transform
```vue
<script setup lang="ts">
const { data: users } = await useFetch('/api/users', {
  // Executes on both client and server
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

## Combining with External Data Sources
```vue
<script setup lang="ts">
const searchQuery = ref('')

const { data: results } = await useAsyncData(
  () => `search-${searchQuery.value}`,
  async () => {
    if (!searchQuery.value) return []

    // Can call any async function, not limited to $fetch
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
| Scenario | Recommended |
|----------|-------------|
| Simple API requests | `useFetch` |
| Combining multiple requests | `useAsyncData` |
| Complex transformations needed | `useAsyncData` |
| Non-HTTP data sources | `useAsyncData` |
| Custom cache key needed | Either works |

## Why
- `useAsyncData` provides greater flexibility
- Can combine multiple data sources
- Supports any async operation, not limited to fetch
- Centralized transformation logic is easier to maintain
