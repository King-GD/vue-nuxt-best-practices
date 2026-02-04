---
id: fetch-05
title: Use getCachedData to Implement SWR
priority: medium
category: data-fetching
tags: [data-fetching, cache, swr]
---

# Use getCachedData to Implement SWR

## Problem
Always waiting for new data on page navigation results in less fluid user experience.

## Bad Example
```vue
<script setup lang="ts">
// Every navigation waits for data to load
const { data, pending } = await useFetch('/api/products')
// User sees loading state until data returns
</script>
```

## Good Example
```vue
<script setup lang="ts">
// SWR: Stale-While-Revalidate
// Show cached data first, refresh in background
const { data, pending } = await useFetch('/api/products', {
  getCachedData(key, nuxtApp) {
    // Return cached data (if exists)
    return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
  }
})
</script>
```

## SWR with Expiration Time
```vue
<script setup lang="ts">
const { data } = await useFetch('/api/products', {
  getCachedData(key, nuxtApp) {
    const cached = nuxtApp.payload.data[key]

    if (!cached) return undefined

    // Check if expired (5 minutes)
    const expirationDate = new Date(cached.fetchedAt)
    expirationDate.setMinutes(expirationDate.getMinutes() + 5)

    if (expirationDate < new Date()) {
      return undefined // Expired, refetch
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

## Global SWR Configuration
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

## Why
- SWR pattern lets users see content immediately, improving perceived speed
- Background refresh ensures eventual data consistency
- Suitable for list pages, search results, and scenarios that can tolerate brief staleness
