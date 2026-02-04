---
id: perf-08
title: Use key Correctly to Optimize List Rendering
priority: high
category: performance
tags: [performance, key, list, diff]
---

# Use key Correctly to Optimize List Rendering

## Problem
Incorrect keys cause unnecessary DOM operations or state confusion.

## Bad Example
```vue
<template>
  <!-- Bad: Using index as key -->
  <div v-for="(item, index) in items" :key="index">
    <input v-model="item.value" />
  </div>

  <!-- Bad: No key -->
  <div v-for="item in items">
    {{ item.name }}
  </div>

  <!-- Bad: Non-unique key -->
  <div v-for="item in items" :key="item.category">
    {{ item.name }}
  </div>
</template>
```

## Good Example
```vue
<template>
  <!-- Correct: Use unique and stable id -->
  <div v-for="item in items" :key="item.id">
    <input v-model="item.value" />
  </div>

  <!-- Composite key (when single field isn't unique) -->
  <div v-for="item in items" :key="`${item.type}-${item.id}`">
    {{ item.name }}
  </div>

  <!-- Force component recreation -->
  <UserProfile :key="userId" :id="userId" />
</template>
```

## When index Is Acceptable
```vue
<template>
  <!-- ✅ Static list, no add/delete/update -->
  <li v-for="(item, index) in staticMenu" :key="index">
    {{ item.label }}
  </li>

  <!-- ✅ Pure display, no state -->
  <span v-for="(tag, index) in tags" :key="index">
    {{ tag }}
  </span>
</template>
```

## Key Usage for State Reset
```vue
<script setup lang="ts">
// Use key to force reset component state
const formKey = ref(0)

function resetForm() {
  formKey.value++ // Component will be destroyed and recreated
}
</script>

<template>
  <FormComponent :key="formKey" />
  <button @click="resetForm">Reset</button>
</template>
```

## Why
- key helps Vue identify node identity
- Correct keys make diff algorithm more efficient
- Incorrect keys cause state confusion (e.g., input content jumping to other rows)
- Unique and stable keys are best practice
