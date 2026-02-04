---
id: perf-07
title: Debounce and Throttle Event Handlers
priority: high
category: performance
tags: [performance, debounce, throttle]
---

# Debounce and Throttle Event Handlers

## Problem
High-frequency events (like scroll, resize, input) trigger many callbacks, affecting performance.

## Bad Example
```vue
<template>
  <!-- Bad: Every input triggers a request -->
  <input v-model="query" @input="search" />

  <!-- Bad: Scroll event fires frequently -->
  <div @scroll="handleScroll">...</div>
</template>

<script setup lang="ts">
async function search() {
  // API request on every keystroke
  results.value = await $fetch(`/api/search?q=${query.value}`)
}
</script>
```

## Good Example (Using VueUse)
```vue
<script setup lang="ts">
import { useDebounceFn, useThrottleFn, watchDebounced } from '@vueuse/core'

const query = ref('')
const results = ref([])

// Debounced search: Execute 300ms after input stops
const debouncedSearch = useDebounceFn(async () => {
  results.value = await $fetch(`/api/search?q=${query.value}`)
}, 300)

// Or use watchDebounced
watchDebounced(
  query,
  async (value) => {
    results.value = await $fetch(`/api/search?q=${value}`)
  },
  { debounce: 300 }
)

// Throttled scroll: Execute at most once per 100ms
const throttledScroll = useThrottleFn((e: Event) => {
  // Handle scroll logic
}, 100)
</script>

<template>
  <input v-model="query" @input="debouncedSearch" />
  <div @scroll="throttledScroll">...</div>
</template>
```

## Debounce vs Throttle
| Scenario | Recommended | Reason |
|----------|-------------|--------|
| Search input | Debounce | Wait until user stops typing |
| Window resize | Debounce | Adjust layout after resize ends |
| Scroll loading | Throttle | Continuously check during scroll |
| Button click | Throttle | Prevent duplicate submissions |

## Using lodash-es
```vue
<script setup lang="ts">
import { debounce, throttle } from 'lodash-es'

const debouncedFn = debounce(() => {
  // ...
}, 300)

// Cancel on component unmount
onUnmounted(() => {
  debouncedFn.cancel()
})
</script>
```

## Why
- Reduces unnecessary function calls
- Lowers API request frequency
- Improves scroll and interaction fluidity
- Saves computation and network resources
