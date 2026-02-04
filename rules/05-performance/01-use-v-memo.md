---
id: perf-01
title: Use v-memo to Cache List Items
priority: high
category: performance
tags: [performance, v-memo, list]
---

# Use v-memo to Cache List Items

## Problem
Every item in a large list re-renders when the parent component updates, even if data hasn't changed.

## Bad Example
```vue
<template>
  <!-- Bad: Every list item re-renders when counter changes -->
  <div>
    <button @click="counter++">Count: {{ counter }}</button>
    <div v-for="item in items" :key="item.id">
      <ExpensiveComponent :item="item" />
    </div>
  </div>
</template>
```

## Good Example
```vue
<template>
  <div>
    <button @click="counter++">Count: {{ counter }}</button>
    <!-- v-memo: Only re-render when item.id or selected changes -->
    <div
      v-for="item in items"
      :key="item.id"
      v-memo="[item.id, item === selected]"
    >
      <ExpensiveComponent :item="item" :selected="item === selected" />
    </div>
  </div>
</template>

<script setup lang="ts">
const counter = ref(0)
const selected = ref<Item | null>(null)
const items = ref<Item[]>([])
</script>
```

## Table Scenario
```vue
<template>
  <table>
    <tr
      v-for="row in rows"
      :key="row.id"
      v-memo="[row.id, row.updatedAt, selectedId === row.id]"
    >
      <td>{{ row.name }}</td>
      <td>{{ row.value }}</td>
      <td>
        <button @click="selectedId = row.id">Select</button>
      </td>
    </tr>
  </table>
</template>
```

## v-memo vs computed
```vue
<script setup lang="ts">
// computed: Suitable for derived data
const filteredItems = computed(() =>
  items.value.filter(i => i.active)
)

// v-memo: Suitable for render optimization
// Doesn't change data, only skips unnecessary re-renders
</script>
```

## Why
- v-memo can skip sub-tree re-rendering
- When dependency array hasn't changed, reuses last render result
- Significant performance improvement for large lists
- Similar to React.memo but at template level
