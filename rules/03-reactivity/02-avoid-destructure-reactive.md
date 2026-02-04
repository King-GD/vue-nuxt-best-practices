---
id: reactivity-02
title: 避免解构 reactive 对象
priority: critical
category: reactivity
tags: [reactivity, destructure, toRefs]
---

# 避免解构 reactive 对象

## 问题
解构 reactive 对象会丢失响应性，导致数据更新后视图不刷新。

## 错误示例
```vue
<script setup lang="ts">
const state = reactive({
  count: 0,
  name: 'Vue'
})

// 错误：解构后丢失响应性
const { count, name } = state

function increment() {
  count++ // 这不会触发视图更新！
}

// 错误：作为参数传递
function useCount(count: number) {
  // count 只是一个普通数字，失去响应性
}
useCount(state.count)
</script>
```

## 正确示例
```vue
<script setup lang="ts">
const state = reactive({
  count: 0,
  name: 'Vue'
})

// 方式1：使用 toRefs 保持响应性
const { count, name } = toRefs(state)

function increment() {
  count.value++ // 正确：通过 .value 修改
}

// 方式2：使用 toRef 单个属性
const count = toRef(state, 'count')

// 方式3：直接使用 state
function increment2() {
  state.count++ // 正确：直接修改原对象
}
</script>

<template>
  <!-- 方式1/2：需要 .value -->
  <span>{{ count }}</span>
  <!-- 方式3：直接访问 -->
  <span>{{ state.count }}</span>
</template>
```

## Composable 中正确返回响应式数据
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

  // 返回 toRefs 保持响应性
  return {
    ...toRefs(state),
    increment
  }
}

// 使用
const { count, doubled, increment } = useCounter()
// count 和 doubled 都是 ref，保持响应性
```

## 为什么推荐 ref 而非 reactive
```vue
<script setup lang="ts">
// 推荐：使用 ref，解构安全
const count = ref(0)
const name = ref('Vue')

// 可以安全传递和解构
const { value: currentCount } = count // 只是取值，非响应式
// 但 count 本身可以安全传递给子组件或 composable
</script>
```

## 原因
- JavaScript 解构是值复制，不是引用
- 解构基本类型（number, string）会得到一个普通值
- `toRefs` 将每个属性转换为 ref，保持响应性链接
- Vue 官方推荐优先使用 `ref` 而非 `reactive`
