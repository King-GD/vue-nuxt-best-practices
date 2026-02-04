---
id: ssr-02
title: Use ClientOnly Component Correctly
priority: critical
category: ssr-hydration
tags: [ssr, client-only, nuxt]
---

# Use ClientOnly Component Correctly

## Problem
Some components or features can only run on the client side (such as third-party libraries that depend on browser APIs), and need proper handling in SSR scenarios.

## Bad Example
```vue
<template>
  <!-- Bad: ECharts depends on DOM, will error on server -->
  <VChart :option="chartOption" />

  <!-- Bad: Directly using components that depend on window -->
  <ThirdPartyMap :center="mapCenter" />
</template>
```

## Good Example
```vue
<template>
  <!-- Use ClientOnly to wrap client-only components -->
  <ClientOnly>
    <VChart :option="chartOption" />
    <template #fallback>
      <div class="chart-skeleton">Loading chart...</div>
    </template>
  </ClientOnly>

  <!-- Combine lazy loading with ClientOnly -->
  <ClientOnly>
    <LazyThirdPartyMap :center="mapCenter" />
  </ClientOnly>
</template>

<script setup lang="ts">
// Use defineAsyncComponent for further optimization
const VChart = defineAsyncComponent(() => import('vue-echarts'))
</script>
```

## Best Practices

### 1. Provide fallback content
```vue
<ClientOnly>
  <HeavyComponent />
  <template #fallback>
    <SkeletonLoader />
  </template>
</ClientOnly>
```

### 2. Use .client.vue suffix
```
components/
  MyChart.client.vue    # Automatically loads only on client
  MyChart.server.vue    # Optional: server-side alternative content
```

### 3. Use import.meta.client conditional
```vue
<script setup lang="ts">
if (import.meta.client) {
  // Logic that only executes on client
  const analytics = await import('~/utils/analytics')
  analytics.init()
}
</script>
```

## Why
- `<ClientOnly>` ensures its child components only render on the client
- Server renders fallback content (if provided)
- Avoids accessing non-existent browser APIs during SSR

## Use Cases
- Chart libraries (ECharts, Chart.js)
- Map components (AMap, Google Maps)
- Rich text editors
- Components that depend on Canvas/WebGL
- Components that need to access localStorage/sessionStorage
