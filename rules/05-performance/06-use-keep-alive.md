---
id: perf-06
title: Use keep-alive to Cache Component State
priority: medium
category: performance
tags: [performance, keep-alive, cache]
---

# Use keep-alive to Cache Component State

## Problem
Frequently toggled components are recreated each time, losing state and causing performance overhead.

## Bad Example
```vue
<template>
  <!-- Bad: Component recreated on every tab switch -->
  <component :is="currentTab" />

  <!-- Bad: Route change loses form state -->
  <NuxtPage />
</template>
```

## Good Example
```vue
<template>
  <!-- Cache dynamic components -->
  <KeepAlive>
    <component :is="currentTab" />
  </KeepAlive>

  <!-- Specify which components to cache -->
  <KeepAlive :include="['TabA', 'TabB']">
    <component :is="currentTab" />
  </KeepAlive>

  <!-- Limit cache count -->
  <KeepAlive :max="5">
    <component :is="currentTab" />
  </KeepAlive>
</template>
```

## Nuxt Route Caching
```vue
<!-- app.vue -->
<template>
  <NuxtLayout>
    <NuxtPage :keepalive="{ include: ['search', 'list'] }" />
  </NuxtLayout>
</template>

<!-- Or configure in page -->
<!-- pages/search.vue -->
<script setup lang="ts">
definePageMeta({
  keepalive: true
})
</script>
```

## Lifecycle Hooks
```vue
<script setup lang="ts">
// keep-alive specific lifecycle
onActivated(() => {
  // Component activated (restored from cache)
  refreshData()
})

onDeactivated(() => {
  // Component cached
  pauseTimer()
})
</script>
```

## Why
- Avoids overhead of repeatedly creating components
- Preserves component state (form inputs, scroll position, etc.)
- Suitable for tab switching, list-detail back-and-forth navigation
- Use include/exclude to precisely control cache scope
