---
id: perf-03
title: 大列表使用虚拟滚动
priority: critical
category: performance
tags: [performance, virtual-scroll, list]
---

# 大列表使用虚拟滚动

## 问题
渲染大量 DOM 节点会导致页面卡顿和内存占用过高。

## 错误示例
```vue
<template>
  <!-- 错误：渲染 10000 个 DOM 节点 -->
  <div class="list">
    <div v-for="item in items" :key="item.id" class="item">
      {{ item.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
// 10000 条数据
const items = ref<Item[]>(Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`
})))
</script>
```

## 正确示例（使用 VueUse）
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

## 使用第三方虚拟滚动库
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

## 何时使用虚拟滚动
| 数据量 | 建议 |
|--------|------|
| < 100 | 普通渲染 |
| 100-500 | 考虑分页或虚拟滚动 |
| > 500 | 强烈建议虚拟滚动 |
| > 1000 | 必须虚拟滚动 |

## 原因
- 虚拟滚动只渲染可视区域的 DOM
- 10000 条数据可能只需要渲染 20 个 DOM 节点
- 大幅减少内存占用和渲染时间
- 保持滚动流畅度
