---
id: perf-01
title: 使用 v-memo 缓存列表项
priority: high
category: performance
tags: [performance, v-memo, list]
---

# 使用 v-memo 缓存列表项

## 问题
大列表中每个项都会在父组件更新时重新渲染，即使数据未变化。

## 错误示例
```vue
<template>
  <!-- 错误：每次 counter 变化，所有列表项都重新渲染 -->
  <div>
    <button @click="counter++">计数: {{ counter }}</button>
    <div v-for="item in items" :key="item.id">
      <ExpensiveComponent :item="item" />
    </div>
  </div>
</template>
```

## 正确示例
```vue
<template>
  <div>
    <button @click="counter++">计数: {{ counter }}</button>
    <!-- v-memo：只在 item.id 或 selected 变化时重新渲染 -->
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

## 表格场景
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
        <button @click="selectedId = row.id">选择</button>
      </td>
    </tr>
  </table>
</template>
```

## v-memo vs computed
```vue
<script setup lang="ts">
// computed：适合派生数据
const filteredItems = computed(() =>
  items.value.filter(i => i.active)
)

// v-memo：适合渲染优化
// 不改变数据，只跳过不必要的重新渲染
</script>
```

## 原因
- v-memo 可以跳过子树的重新渲染
- 依赖数组未变化时，复用上次渲染结果
- 对大列表有显著性能提升
- 类似 React.memo 但在模板层面
