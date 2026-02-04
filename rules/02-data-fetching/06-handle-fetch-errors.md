---
id: fetch-06
title: Handle Request Error States Correctly
priority: high
category: data-fetching
tags: [data-fetching, error-handling, ux]
---

# Handle Request Error States Correctly

## Problem
Unhandled request errors can cause blank pages or confuse users.

## Bad Example
```vue
<script setup lang="ts">
// Bad: Not handling error state
const { data } = await useFetch('/api/users')
</script>

<template>
  <!-- If request fails, data is null, page may error -->
  <div>{{ data.users.length }} users</div>
</template>
```

## Good Example
```vue
<script setup lang="ts">
const { data, pending, error, refresh } = await useFetch('/api/users')
</script>

<template>
  <!-- Loading state -->
  <div v-if="pending" class="loading">
    <Spinner />
    <span>Loading...</span>
  </div>

  <!-- Error state -->
  <div v-else-if="error" class="error">
    <p>Failed to load: {{ error.message }}</p>
    <button @click="refresh()">Retry</button>
  </div>

  <!-- Empty data state -->
  <div v-else-if="!data?.users?.length" class="empty">
    <p>No data available</p>
  </div>

  <!-- Normal state -->
  <ul v-else>
    <li v-for="user in data.users" :key="user.id">
      {{ user.name }}
    </li>
  </ul>
</template>
```

## Using onError Callback
```vue
<script setup lang="ts">
const { data } = await useFetch('/api/users', {
  onRequestError({ error }) {
    console.error('Request error:', error)
  },
  onResponseError({ response }) {
    if (response.status === 401) {
      navigateTo('/login')
    } else if (response.status === 404) {
      throw createError({ statusCode: 404, message: 'Resource not found' })
    }
  }
})
</script>
```

## Global Error Handling
```ts
// plugins/fetch-error.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:error', (error) => {
    console.error('App error:', error)
  })

  // Global $fetch interceptor
  globalThis.$fetch = $fetch.create({
    onResponseError({ response }) {
      if (response.status === 401) {
        nuxtApp.runWithContext(() => navigateTo('/login'))
      }
    }
  })
})
```

## Why
- Network requests can fail for various reasons
- Good error handling improves user experience
- Providing retry mechanism lets users self-recover
- Distinguishing error types gives appropriate feedback
