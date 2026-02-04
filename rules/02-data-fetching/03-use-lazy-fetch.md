---
id: fetch-03
title: Use lazy for Non-Critical Data
priority: high
category: data-fetching
tags: [data-fetching, lazy, performance]
---

# Use lazy for Non-Critical Data

## Problem
Blocking rendering for all data extends time to first paint. Non-critical data should be lazy loaded.

## Bad Example
```vue
<script setup lang="ts">
// Bad: All data blocks SSR
const { data: mainContent } = await useFetch('/api/content')      // Critical
const { data: recommendations } = await useFetch('/api/recommend') // Non-critical
const { data: comments } = await useFetch('/api/comments')         // Non-critical
const { data: analytics } = await useFetch('/api/analytics')       // Non-critical
</script>
```

## Good Example
```vue
<script setup lang="ts">
// Critical data: blocks rendering
const { data: mainContent } = await useFetch('/api/content')

// Non-critical data: lazy mode, doesn't block SSR
const { data: recommendations, pending: recPending } = useLazyFetch('/api/recommend')
const { data: comments, pending: commentsPending } = useLazyFetch('/api/comments')

// Or use lazy option
const { data: analytics } = useFetch('/api/analytics', { lazy: true })
</script>

<template>
  <!-- Main content displays immediately -->
  <MainContent :data="mainContent" />

  <!-- Recommendations lazy loaded -->
  <div v-if="recPending">
    <RecommendSkeleton />
  </div>
  <Recommendations v-else :data="recommendations" />

  <!-- Comments lazy loaded -->
  <Suspense>
    <Comments :data="comments" />
    <template #fallback>
      <CommentsSkeleton />
    </template>
  </Suspense>
</template>
```

## Server vs Client Fetching
```vue
<script setup lang="ts">
// server: false - Only fetch on client (suitable for user-specific data)
const { data: userPrefs } = useFetch('/api/preferences', {
  server: false
})

// lazy + server: false - Client-side lazy loading
const { data: history } = useFetch('/api/history', {
  lazy: true,
  server: false
})
</script>
```

## Why
- First paint only needs critical content
- Lazy loading non-critical data significantly reduces TTFB (Time to First Byte)
- Skeleton screens provide better loading experience
- Progressive loading lets users see interactive content faster
