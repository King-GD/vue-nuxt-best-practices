---
id: fetch-01
title: Use useFetch Instead of $fetch
priority: critical
category: data-fetching
tags: [data-fetching, usefetch, ssr]
---

# Use useFetch Instead of $fetch

## Problem
Using `$fetch` directly in components causes duplicate data fetching - once on server and again after client hydration.

## Bad Example
```vue
<script setup lang="ts">
// Bad: $fetch doesn't utilize SSR payload
const data = ref(null)

onMounted(async () => {
  data.value = await $fetch('/api/users')
})

// Bad: Even at setup top level, request is duplicated
const users = await $fetch('/api/users')
</script>
```

## Good Example
```vue
<script setup lang="ts">
// Correct: useFetch automatically handles SSR caching
const { data: users, pending, error, refresh } = await useFetch('/api/users')

// Request with parameters
const { data: user } = await useFetch(() => `/api/users/${userId.value}`)

// POST request
const { data } = await useFetch('/api/users', {
  method: 'POST',
  body: { name: 'John' }
})
</script>

<template>
  <div v-if="pending">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <ul v-else>
    <li v-for="user in users" :key="user.id">{{ user.name }}</li>
  </ul>
</template>
```

## When to Use $fetch
```vue
<script setup lang="ts">
// $fetch is suitable for event handlers and non-SSR scenarios
async function handleSubmit() {
  await $fetch('/api/submit', {
    method: 'POST',
    body: formData.value
  })
}

// Or in server API routes
// server/api/users.ts
export default defineEventHandler(async () => {
  // Use $fetch for server-to-server requests
  const data = await $fetch('https://external-api.com/data')
  return data
})
</script>
```

## Why
- Data fetched by `useFetch` on server is passed to client via payload
- Client uses cached data during hydration, no duplicate requests
- Provides reactive states like `pending`, `error`, `refresh`
- Automatically handles request deduplication and caching
