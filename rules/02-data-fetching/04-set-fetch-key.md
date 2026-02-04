---
id: fetch-04
title: Set key Correctly to Avoid Duplicate Requests
priority: high
category: data-fetching
tags: [data-fetching, cache, key]
---

# Set key Correctly to Avoid Duplicate Requests

## Problem
The same request may be initiated multiple times, wasting bandwidth and server resources.

## Bad Example
```vue
<script setup lang="ts">
const route = useRoute()

// Bad: New request on every component remount
const { data } = await useFetch(`/api/article/${route.params.id}`)

// Bad: Dynamic URL without key may cause caching issues
const { data: user } = await useFetch(() => `/api/users/${userId.value}`)
</script>
```

## Good Example
```vue
<script setup lang="ts">
const route = useRoute()

// Correct: Set unique key, same key reuses cache
const { data } = await useFetch(`/api/article/${route.params.id}`, {
  key: `article-${route.params.id}`
})

// Correct: Use useAsyncData with explicit key
const { data: user } = await useAsyncData(
  `user-${userId.value}`,
  () => $fetch(`/api/users/${userId.value}`)
)
</script>
```

## Auto-Refresh on Parameter Changes
```vue
<script setup lang="ts">
const route = useRoute()

// watch: true auto-refreshes when URL changes
const { data } = await useFetch(() => `/api/article/${route.params.id}`, {
  key: `article-${route.params.id}`,
  watch: [() => route.params.id]
})

// Or use computed property as URL
const apiUrl = computed(() => `/api/search?q=${searchQuery.value}`)
const { data, refresh } = await useFetch(apiUrl, {
  key: () => `search-${searchQuery.value}`
})
</script>
```

## Manual Refresh and Cache Clearing
```vue
<script setup lang="ts">
const { data, refresh, clear } = await useFetch('/api/data', {
  key: 'my-data'
})

// Refresh data (uses cache key)
async function handleRefresh() {
  await refresh()
}

// Clear cache and refresh
async function handleClearAndRefresh() {
  clear()
  await refresh()
}

// Clear all cache globally
function clearAllCache() {
  clearNuxtData()
  // Or clear specific key
  clearNuxtData('my-data')
}
</script>
```

## Why
- `useFetch` uses URL as cache key by default
- Requests with the same key reuse cached data
- Proper key strategy avoids duplicate requests, improving performance
- Dynamic URLs need explicit key strategy to ensure correct caching behavior
