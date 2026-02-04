---
id: nuxt-04
title: Middleware Performance Optimization
priority: medium
category: nuxt-specific
tags: [nuxt, middleware, performance]
---

# Middleware Performance Optimization

## Problem
Heavy middleware logic affects performance on every route navigation.

## Bad Example
```ts
// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Bad: API request on every route navigation
  const user = await $fetch('/api/user')

  if (!user) {
    return navigateTo('/login')
  }

  // Bad: Complex calculations in middleware
  const permissions = calculatePermissions(user)
  // ...
})
```

## Good Example
```ts
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()

  // Use cached user state
  if (!userStore.isLoggedIn) {
    return navigateTo('/login')
  }

  // Check page permissions
  const requiredPermissions = to.meta.requiredPermissions as string[] | undefined
  if (requiredPermissions && !userStore.hasPermissions(requiredPermissions)) {
    return navigateTo('/403')
  }
})

// middleware/auth.global.ts
// Global middleware: only request when needed
export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore()

  // Only request when user is not initialized
  if (!userStore.initialized) {
    await userStore.init()
  }
})
```

## Apply Middleware On-Demand
```vue
<script setup lang="ts">
definePageMeta({
  // Only apply on pages that need it
  middleware: ['auth']
})
</script>

<!-- Instead of using global middleware -->
```

## Inline Middleware
```vue
<script setup lang="ts">
definePageMeta({
  middleware: [
    // Inline middleware, only applies to current page
    function (to, from) {
      const { isAdmin } = useUserStore()
      if (!isAdmin) {
        return navigateTo('/403')
      }
    }
  ]
})
</script>
```

## Why
- Middleware executes on every route navigation
- Avoid unnecessary API requests
- Use cached state instead of fetching each time
- On-demand application reduces unnecessary checks
