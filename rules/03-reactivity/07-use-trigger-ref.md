---
id: reactivity-07
title: Use triggerRef for Force Updates
priority: low
category: reactivity
tags: [reactivity, triggerRef, shallowRef]
---

# Use triggerRef for Force Updates

## Problem
When using shallowRef, modifying internal properties doesn't trigger view updates.

## Bad Example
```vue
<script setup lang="ts">
const data = shallowRef({ count: 0, items: [] })

function increment() {
  // Bad: Modifying internal property doesn't trigger update
  data.value.count++
}

function addItem() {
  // Bad: push doesn't trigger update
  data.value.items.push('new item')
}
</script>
```

## Good Example
```vue
<script setup lang="ts">
const data = shallowRef({ count: 0, items: [] })

// Option 1: Replace entire object (recommended)
function increment() {
  data.value = { ...data.value, count: data.value.count + 1 }
}

function addItem() {
  data.value = {
    ...data.value,
    items: [...data.value.items, 'new item']
  }
}

// Option 2: Manually trigger update after modification
function incrementWithTrigger() {
  data.value.count++
  triggerRef(data) // Manually trigger update
}

function addItemWithTrigger() {
  data.value.items.push('new item')
  triggerRef(data)
}
</script>
```

## Trigger After Batch Modifications
```vue
<script setup lang="ts">
const tableData = shallowRef<Row[]>([])

// Trigger once after batch modifying multiple properties
function updateMultipleRows(updates: Map<number, Partial<Row>>) {
  updates.forEach((update, index) => {
    Object.assign(tableData.value[index], update)
  })
  // Trigger update once after all modifications complete
  triggerRef(tableData)
}
</script>
```

## customRef for Custom Trigger Logic
```vue
<script setup lang="ts">
// Create debounced ref
function useDebouncedRef<T>(value: T, delay = 300) {
  let timeout: NodeJS.Timeout

  return customRef((track, trigger) => ({
    get() {
      track()
      return value
    },
    set(newValue) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        value = newValue
        trigger() // Delayed trigger
      }, delay)
    }
  }))
}

const searchQuery = useDebouncedRef('', 500)
</script>
```

## Why
- shallowRef only tracks .value changes, not internal properties
- triggerRef forces dependency updates
- Suitable for fine-grained control in performance-sensitive scenarios
- Replacing entire object is a clearer immutable update pattern
