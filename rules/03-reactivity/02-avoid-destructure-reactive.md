---
id: reactivity-02
title: Avoid Destructuring Reactive Objects
priority: critical
category: reactivity
tags: [reactivity, destructure, toRefs]
---

# Avoid Destructuring Reactive Objects

## Problem
Destructuring reactive objects loses reactivity, causing views not to update when data changes.

## Bad Example
```vue
<script setup lang="ts">
const state = reactive({
  count: 0,
  name: 'Vue'
})

// Bad: Destructuring loses reactivity
const { count, name } = state

function increment() {
  count++ // This won't trigger view update!
}

// Bad: Passing as parameter
function useCount(count: number) {
  // count is just a plain number, loses reactivity
}
useCount(state.count)
</script>
```

## Good Example
```vue
<script setup lang="ts">
const state = reactive({
  count: 0,
  name: 'Vue'
})

// Option 1: Use toRefs to maintain reactivity
const { count, name } = toRefs(state)

function increment() {
  count.value++ // Correct: Modify via .value
}

// Option 2: Use toRef for single property
const count = toRef(state, 'count')

// Option 3: Use state directly
function increment2() {
  state.count++ // Correct: Modify original object directly
}
</script>

<template>
  <!-- Option 1/2: Need .value -->
  <span>{{ count }}</span>
  <!-- Option 3: Direct access -->
  <span>{{ state.count }}</span>
</template>
```

## Correctly Returning Reactive Data from Composables
```ts
// composables/useCounter.ts
export function useCounter() {
  const state = reactive({
    count: 0,
    doubled: computed(() => state.count * 2)
  })

  function increment() {
    state.count++
  }

  // Return toRefs to maintain reactivity
  return {
    ...toRefs(state),
    increment
  }
}

// Usage
const { count, doubled, increment } = useCounter()
// count and doubled are refs, maintaining reactivity
```

## Why ref is Recommended Over reactive
```vue
<script setup lang="ts">
// Recommended: Use ref, safe to destructure
const count = ref(0)
const name = ref('Vue')

// Can safely pass and destructure
const { value: currentCount } = count // Just getting value, not reactive
// But count itself can be safely passed to child components or composables
</script>
```

## Why
- JavaScript destructuring is value copy, not reference
- Destructuring primitive types (number, string) gives a plain value
- `toRefs` converts each property to ref, maintaining reactive link
- Vue officially recommends preferring `ref` over `reactive`
