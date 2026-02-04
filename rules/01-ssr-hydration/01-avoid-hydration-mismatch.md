---
id: ssr-01
title: Avoid Hydration Mismatch
priority: critical
category: ssr-hydration
tags: [ssr, hydration, vue3, nuxt]
---

# Avoid Hydration Mismatch

## Problem
Inconsistent rendering results between server and client cause hydration warnings and potential bugs, affecting user experience and SEO.

## Bad Example
```vue
<template>
  <!-- Bad: Date.now() returns different values on server and client -->
  <div>Current time: {{ Date.now() }}</div>

  <!-- Bad: Math.random() returns different values each call -->
  <div>Random number: {{ Math.random() }}</div>

  <!-- Bad: Directly accessing window object -->
  <div>Screen width: {{ window.innerWidth }}</div>
</template>
```

## Good Example
```vue
<template>
  <ClientOnly>
    <div>Current time: {{ currentTime }}</div>
  </ClientOnly>

  <!-- Or use conditional rendering -->
  <div v-if="isMounted">Screen width: {{ screenWidth }}</div>
</template>

<script setup lang="ts">
const currentTime = ref<number | null>(null)
const screenWidth = ref(0)
const isMounted = ref(false)

onMounted(() => {
  currentTime.value = Date.now()
  screenWidth.value = window.innerWidth
  isMounted.value = true
})
</script>
```

## Why
Nuxt SSR first renders HTML on the server and sends it to the client. During client-side hydration, Vue "activates" the instance onto the server-rendered DOM. If they don't match:
1. Vue will emit warnings
2. Interactive features may break
3. Layout stability (CLS) is affected

## Common Trigger Scenarios
- Using non-deterministic functions like `Date.now()`, `Math.random()`
- Directly accessing browser APIs like `window`, `document`, `navigator`
- Rendering content based on localStorage
- Using browser-specific feature detection

## Detection Methods
- Browser console shows "Hydration mismatch" or "Hydration node mismatch" warnings
- Use `nuxt devtools` to check hydration status
- Vue automatically detects and warns in development mode
