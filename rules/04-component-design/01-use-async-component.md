---
id: component-01
title: Use defineAsyncComponent for Lazy Loading
priority: high
category: component-design
tags: [component, lazy-loading, performance]
---

# Use defineAsyncComponent for Lazy Loading

## Problem
Loading all components synchronously increases initial bundle size and extends first paint time.

## Bad Example
```vue
<script setup lang="ts">
// Bad: Synchronously importing large components
import HeavyChart from './HeavyChart.vue'
import RichTextEditor from './RichTextEditor.vue'
import DataTable from './DataTable.vue'
</script>

<template>
  <HeavyChart v-if="showChart" />
  <RichTextEditor v-if="isEditing" />
</template>
```

## Good Example
```vue
<script setup lang="ts">
// Correct: Async import, load on demand
const HeavyChart = defineAsyncComponent(() => import('./HeavyChart.vue'))
const RichTextEditor = defineAsyncComponent(() => import('./RichTextEditor.vue'))

// Async component with configuration
const DataTable = defineAsyncComponent({
  loader: () => import('./DataTable.vue'),
  loadingComponent: TableSkeleton,
  errorComponent: TableError,
  delay: 200,        // Delay before showing loading
  timeout: 10000     // Timeout duration
})
</script>

<template>
  <HeavyChart v-if="showChart" />
  <RichTextEditor v-if="isEditing" />
</template>
```

## Nuxt Auto Lazy Loading
```vue
<template>
  <!-- Lazy prefix automatically enables lazy loading -->
  <LazyHeavyChart v-if="showChart" :data="chartData" />

  <!-- Equivalent to -->
  <!-- defineAsyncComponent(() => import('./HeavyChart.vue')) -->
</template>
```

## Route-Level Lazy Loading
```ts
// nuxt.config.ts or page components
// Nuxt pages are lazy loaded by default

// Manually configure component preloading
definePageMeta({
  // Preload components before entering page
})
</script>
```

## Why
- Reduces initial bundle size
- Load on demand, unused features won't be loaded
- Improves first paint speed and LCP metrics
- Nuxt's Lazy prefix makes usage simpler
