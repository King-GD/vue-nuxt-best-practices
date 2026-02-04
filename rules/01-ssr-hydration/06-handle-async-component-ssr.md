---
id: ssr-06
title: Handle Async Component SSR Fallback
priority: medium
category: ssr-hydration
tags: [ssr, async-component, suspense]
---

# Handle Async Component SSR Fallback

## Problem
Async components during SSR may cause loading state flicker or missing content.

## Bad Example
```vue
<script setup lang="ts">
// Bad: Loading state not handled
const AsyncChart = defineAsyncComponent(() => import('./Chart.vue'))
</script>

<template>
  <!-- Server may render empty content -->
  <AsyncChart :data="chartData" />
</template>
```

## Good Example
```vue
<script setup lang="ts">
const AsyncChart = defineAsyncComponent({
  loader: () => import('./Chart.vue'),
  loadingComponent: ChartSkeleton,
  errorComponent: ChartError,
  delay: 200,  // Delay before showing loading
  timeout: 10000
})
</script>

<template>
  <!-- Use Suspense for unified handling -->
  <Suspense>
    <AsyncChart :data="chartData" />
    <template #fallback>
      <ChartSkeleton />
    </template>
  </Suspense>
</template>
```

## Nuxt Auto Lazy Loading
```vue
<template>
  <!-- Lazy prefix automatically enables lazy loading -->
  <LazyChart v-if="showChart" :data="chartData" />

  <!-- Combine with ClientOnly -->
  <ClientOnly>
    <LazyHeavyComponent />
    <template #fallback>
      <Skeleton />
    </template>
  </ClientOnly>
</template>
```

## Why
- Async components wait for loading to complete by default on server
- Configuring loading/error components provides better user experience
- Suspense can manage loading state of multiple async dependencies uniformly
