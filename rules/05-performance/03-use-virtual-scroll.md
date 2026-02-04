---
id: perf-03
title: Use Virtual Scrolling for Large Lists
priority: critical
category: performance
tags: [performance, virtual-scroll, list]
---

# Use Virtual Scrolling for Large Lists

## Problem
Rendering large numbers of DOM nodes causes page lag and high memory usage.

## Bad Example
```vue
<template>
  <!-- Bad: Rendering 10000 DOM nodes -->
  <div class="list">
    <div v-for="item in items" :key="item.id" class="item">
      {{ item.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
// 10000 items
const items = ref<Item[]>(Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`
})))
</script>
```

## Good Example (Using VueUse)
```vue
<template>
  <div ref="containerRef" class="list-container" style="height: 400px; overflow-y: auto;">
    <div :style="{ height: `${totalHeight}px`, position: 'relative' }">
      <div
        v-for="{ data, index } in virtualList"
        :key="data.id"
        :style="{
          position: 'absolute',
          top: `${index * itemHeight}px`,
          width: '100%'
        }"
      >
        {{ data.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVirtualList } from '@vueuse/core'

const items = ref<Item[]>(Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`
})))

const itemHeight = 40

const { list: virtualList, containerProps, wrapperProps } = useVirtualList(items, {
  itemHeight
})

const totalHeight = computed(() => items.value.length * itemHeight)
</script>
```

## Using Third-Party Virtual Scroll Libraries
```vue
<template>
  <!-- vue-virtual-scroller -->
  <RecycleScroller
    class="scroller"
    :items="items"
    :item-size="40"
    key-field="id"
  >
    <template #default="{ item }">
      <div class="item">{{ item.name }}</div>
    </template>
  </RecycleScroller>
</template>

<script setup lang="ts">
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
</script>
```

## When to Use Virtual Scrolling
| Data Size | Recommendation |
|-----------|----------------|
| < 100 | Normal rendering |
| 100-500 | Consider pagination or virtual scrolling |
| > 500 | Strongly recommend virtual scrolling |
| > 1000 | Must use virtual scrolling |

## Why
- Virtual scrolling only renders DOM in visible area
- 10000 items might only need 20 DOM nodes
- Significantly reduces memory usage and render time
- Maintains smooth scrolling
