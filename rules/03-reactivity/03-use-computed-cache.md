---
id: reactivity-03
title: Use computed for Caching Calculations
priority: high
category: reactivity
tags: [reactivity, computed, performance]
---

# Use computed for Caching Calculations

## Problem
Using complex expressions in templates causes recalculation on every render.

## Bad Example
```vue
<template>
  <!-- Bad: Recalculates on every render -->
  <div>{{ items.filter(i => i.active).map(i => i.name).join(', ') }}</div>

  <!-- Bad: Repeated complex expressions -->
  <span>Active: {{ items.filter(i => i.active).length }}</span>
  <span>Total: {{ items.length }}</span>
  <span>Ratio: {{ (items.filter(i => i.active).length / items.length * 100).toFixed(1) }}%</span>
</template>

<script setup lang="ts">
// Bad: Using method instead of computed
function getActiveItems() {
  return items.value.filter(i => i.active)
}
</script>
```

## Good Example
```vue
<script setup lang="ts">
const items = ref<Item[]>([])

// Correct: Use computed to cache results
const activeItems = computed(() => items.value.filter(i => i.active))
const activeNames = computed(() => activeItems.value.map(i => i.name).join(', '))
const activeRatio = computed(() => {
  if (!items.value.length) return '0.0'
  return (activeItems.value.length / items.value.length * 100).toFixed(1)
})
</script>

<template>
  <div>{{ activeNames }}</div>
  <span>Active: {{ activeItems.length }}</span>
  <span>Total: {{ items.length }}</span>
  <span>Ratio: {{ activeRatio }}%</span>
</template>
```

## computed vs methods
```vue
<script setup lang="ts">
// computed: Has cache, doesn't recalculate if dependencies unchanged
const sortedItems = computed(() => {
  console.log('sorting...') // Only prints when items change
  return [...items.value].sort((a, b) => a.name.localeCompare(b.name))
})

// methods: Executes on every call
function getSortedItems() {
  console.log('sorting...') // Prints on every render
  return [...items.value].sort((a, b) => a.name.localeCompare(b.name))
}
</script>

<template>
  <!-- computed: Multiple references only calculate once -->
  <div>{{ sortedItems.length }}</div>
  <div>{{ sortedItems[0]?.name }}</div>

  <!-- methods: Recalculates on every reference -->
  <div>{{ getSortedItems().length }}</div>
  <div>{{ getSortedItems()[0]?.name }}</div>
</template>
```

## Writable computed
```vue
<script setup lang="ts">
const firstName = ref('John')
const lastName = ref('Doe')

// Writable computed
const fullName = computed({
  get: () => `${firstName.value} ${lastName.value}`,
  set: (value: string) => {
    const [first, last] = value.split(' ')
    firstName.value = first
    lastName.value = last || ''
  }
})

// Usage
fullName.value = 'Jane Smith' // Automatically splits
</script>
```

## Why
- `computed` caches based on dependencies, returns cached value if dependencies unchanged
- Avoids unnecessary repeated calculations, improves performance
- Templates are cleaner and more readable
- Vue's reactivity system automatically tracks dependencies
