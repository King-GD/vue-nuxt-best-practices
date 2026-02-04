---
id: state-02
title: 使用 storeToRefs 解构 state
priority: high
category: state-management
tags: [pinia, storeToRefs, reactivity]
---

# 使用 storeToRefs 解构 state

## 问题
直接解构 store 会丢失响应性。

## 错误示例
```vue
<script setup lang="ts">
const store = useUserStore()

// 错误：解构后丢失响应性
const { user, isLoggedIn } = store

// user 和 isLoggedIn 变成了普通值，不会更新
</script>

<template>
  <!-- 这里的值永远不会更新 -->
  <span>{{ user?.name }}</span>
</template>
```

## 正确示例
```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'

const store = useUserStore()

// 正确：使用 storeToRefs 保持响应性
const { user, isLoggedIn } = storeToRefs(store)

// actions 不需要 storeToRefs，可以直接解构
const { login, logout } = store
</script>

<template>
  <span>{{ user?.name }}</span>
  <button @click="logout">退出</button>
</template>
```

## 混合使用
```vue
<script setup lang="ts">
const store = useCartStore()

// state 和 getters 用 storeToRefs
const { items, total, isEmpty } = storeToRefs(store)

// actions 直接解构
const { addItem, removeItem, clear } = store

// 或者不解构，直接使用 store
function handleAdd(product: Product) {
  store.addItem(product)
}
</script>
```

## 为什么不直接用 toRefs
```ts
// storeToRefs 会跳过 actions 和其他非响应式属性
const { user } = storeToRefs(store) // ✅ 只提取响应式数据

// toRefs 会尝试转换所有属性
const { user, login } = toRefs(store) // ❌ login 是函数，会有问题
```

## 原因
- Pinia store 的 state 是 reactive 对象
- 直接解构会丢失响应式链接
- storeToRefs 专门处理 Pinia store
- actions 是普通函数，可以直接解构
