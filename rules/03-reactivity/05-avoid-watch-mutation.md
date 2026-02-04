---
id: reactivity-05
title: Avoid Modifying Source Data in watch
priority: high
category: reactivity
tags: [reactivity, watch, infinite-loop]
---

# Avoid Modifying Source Data in watch

## Problem
Modifying watched data in watch callback causes infinite loops.

## Bad Example
```vue
<script setup lang="ts">
const count = ref(0)

// Bad: Infinite loop!
watch(count, (val) => {
  count.value = val + 1
})

// Bad: Indirect modification also loops
const items = ref<string[]>([])
watch(items, (val) => {
  items.value = [...val, 'new item'] // Infinite loop
}, { deep: true })
</script>
```

## Good Example
```vue
<script setup lang="ts">
const count = ref(0)
const doubledCount = ref(0)

// Correct: Modify other reactive data
watch(count, (val) => {
  doubledCount.value = val * 2
})

// Or use computed
const doubled = computed(() => count.value * 2)

// Correct: Conditional modification, avoids loop
const input = ref('')
watch(input, (val) => {
  // Only modify under specific conditions, and modification won't retrigger
  if (val.includes('  ')) {
    input.value = val.replace(/  +/g, ' ')
  }
})
</script>
```

## Using watchEffect Cleanup Function
```vue
<script setup lang="ts">
const searchQuery = ref('')
const results = ref([])

watchEffect((onCleanup) => {
  const query = searchQuery.value
  if (!query) {
    results.value = []
    return
  }

  const controller = new AbortController()

  fetch(`/api/search?q=${query}`, { signal: controller.signal })
    .then(res => res.json())
    .then(data => {
      results.value = data // Modifying other data, not source data
    })

  onCleanup(() => controller.abort())
})
</script>
```

## Using flush to Control Timing
```vue
<script setup lang="ts">
const data = ref(null)

// flush: 'post' - Execute after DOM update
watch(data, () => {
  // Can safely access updated DOM
  nextTick(() => {
    scrollToBottom()
  })
}, { flush: 'post' })

// flush: 'sync' - Execute synchronously (use with caution)
watch(urgent, () => {
  // Execute immediately synchronously
}, { flush: 'sync' })
</script>
```

## Why
- Modifying source data in watch callback triggers watch again
- Forms an infinite loop: watch → modify → watch
- Correct approach is modifying other data or using conditional checks
