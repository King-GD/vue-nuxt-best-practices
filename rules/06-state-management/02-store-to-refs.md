---
id: state-02
title: Use storeToRefs for Destructuring State
priority: high
category: state-management
tags: [pinia, storeToRefs, reactivity]
---

# Use storeToRefs for Destructuring State

## Problem
Directly destructuring a store loses reactivity.

## Bad Example
```vue
<script setup lang="ts">
const store = useUserStore()

// Bad: Destructuring loses reactivity
const { user, isLoggedIn } = store

// user and isLoggedIn become plain values, won't update
</script>

<template>
  <!-- These values will never update -->
  <span>{{ user?.name }}</span>
</template>
```

## Good Example
```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'

const store = useUserStore()

// Correct: Use storeToRefs to maintain reactivity
const { user, isLoggedIn } = storeToRefs(store)

// Actions don't need storeToRefs, can be destructured directly
const { login, logout } = store
</script>

<template>
  <span>{{ user?.name }}</span>
  <button @click="logout">Logout</button>
</template>
```

## Mixed Usage
```vue
<script setup lang="ts">
const store = useCartStore()

// state and getters use storeToRefs
const { items, total, isEmpty } = storeToRefs(store)

// actions destructure directly
const { addItem, removeItem, clear } = store

// Or don't destructure, use store directly
function handleAdd(product: Product) {
  store.addItem(product)
}
</script>
```

## Why Not Just Use toRefs
```ts
// storeToRefs skips actions and other non-reactive properties
const { user } = storeToRefs(store) // ✅ Only extracts reactive data

// toRefs tries to convert all properties
const { user, login } = toRefs(store) // ❌ login is a function, will have issues
```

## Why
- Pinia store's state is a reactive object
- Direct destructuring loses the reactive link
- storeToRefs is specifically designed for Pinia stores
- Actions are plain functions, can be destructured directly
