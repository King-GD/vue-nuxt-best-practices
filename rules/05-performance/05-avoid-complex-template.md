---
id: perf-05
title: Avoid Complex Template Expressions
priority: high
category: performance
tags: [performance, template, computed]
---

# Avoid Complex Template Expressions

## Problem
Complex expressions in templates are recalculated on every render.

## Bad Example
```vue
<template>
  <!-- Bad: Filter and sort execute on every render -->
  <div v-for="item in items.filter(i => i.active).sort((a, b) => a.name.localeCompare(b.name))" :key="item.id">
    {{ item.name }}
  </div>

  <!-- Bad: Complex formatting logic -->
  <span>{{ new Date(timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>

  <!-- Bad: Multiple method calls -->
  <div>
    <span>{{ formatPrice(item.price) }}</span>
    <span>{{ formatPrice(item.discount) }}</span>
    <span>{{ formatPrice(item.price - item.discount) }}</span>
  </div>
</template>
```

## Good Example
```vue
<script setup lang="ts">
const items = ref<Item[]>([])

// Use computed to cache calculation results
const activeItems = computed(() =>
  items.value
    .filter(i => i.active)
    .sort((a, b) => a.name.localeCompare(b.name))
)

// Formatting function
const formattedDate = computed(() =>
  new Date(timestamp.value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
)

// Price-related calculations
const priceInfo = computed(() => ({
  price: formatPrice(item.value.price),
  discount: formatPrice(item.value.discount),
  final: formatPrice(item.value.price - item.value.discount)
}))
</script>

<template>
  <div v-for="item in activeItems" :key="item.id">
    {{ item.name }}
  </div>

  <span>{{ formattedDate }}</span>

  <div>
    <span>{{ priceInfo.price }}</span>
    <span>{{ priceInfo.discount }}</span>
    <span>{{ priceInfo.final }}</span>
  </div>
</template>
```

## Why
- Template expressions execute on every render
- computed has caching, doesn't recalculate if dependencies unchanged
- Complex logic in script is easier to test and maintain
