---
id: reactivity-01
title: Use shallowRef for Large Objects
priority: high
category: reactivity
tags: [reactivity, performance, shallowRef]
---

# Use shallowRef for Large Objects

## Problem
`ref` deeply converts objects to reactive, causing performance overhead for large data structures.

## Bad Example
```vue
<script setup lang="ts">
// Bad: Large array with ref, every element is converted to reactive
const tableData = ref<User[]>([])

// Fetching 1000+ records from API
const { data } = await useFetch('/api/users')
tableData.value = data.value // Every user object becomes reactive

// Bad: Complex nested object
const chartData = ref({
  datasets: [/* large amount of data points */],
  labels: [/* ... */]
})
</script>
```

## Good Example
```vue
<script setup lang="ts">
// Correct: Using shallowRef, only .value is reactive
const tableData = shallowRef<User[]>([])

// Need to replace the entire array when updating
function updateData(newData: User[]) {
  tableData.value = newData // Triggers update
}

// Manually trigger after modifying single element
function updateItem(index: number, newItem: User) {
  tableData.value[index] = newItem
  triggerRef(tableData) // Manually trigger update
}
</script>
```

## Use Cases
```vue
<script setup lang="ts">
// Chart data: Usually replaced entirely
const chartData = shallowRef(null)

// Table data: Large number of rows
const rows = shallowRef<Row[]>([])

// Map markers: Large number of coordinates
const markers = shallowRef<Marker[]>([])

// Third-party library instances
const editorInstance = shallowRef<Editor | null>(null)
</script>
```

## shallowRef vs ref Performance Comparison
| Data Size | ref Initialization | shallowRef Initialization |
|-----------|-------------------|--------------------------|
| 100 items | ~2ms | ~0.1ms |
| 1000 items | ~20ms | ~0.2ms |
| 10000 items | ~200ms | ~0.5ms |

## Why
- `ref` recursively converts all nested properties to reactive Proxy
- `shallowRef` only makes top-level `.value` reactive
- For data that only needs wholesale replacement, shallow reactivity is sufficient
- Significantly reduces memory usage and initialization time
