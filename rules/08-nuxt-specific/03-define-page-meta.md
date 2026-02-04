---
id: nuxt-03
title: Use definePageMeta to Set Page Metadata
priority: high
category: nuxt-specific
tags: [nuxt, page-meta, middleware]
---

# Use definePageMeta to Set Page Metadata

## Problem
Page-level configuration (layout, middleware, transitions) is scattered and hard to manage.

## Correct Usage
```vue
<!-- pages/dashboard.vue -->
<script setup lang="ts">
definePageMeta({
  // Layout
  layout: 'admin',

  // Middleware
  middleware: ['auth', 'admin'],

  // Page transition
  pageTransition: {
    name: 'slide',
    mode: 'out-in'
  },

  // Layout transition
  layoutTransition: {
    name: 'fade'
  },

  // Keep component state
  keepalive: true,

  // Custom metadata
  title: 'Dashboard',
  requiredPermissions: ['admin:read']
})
</script>
```

## Dynamic Metadata
```vue
<script setup lang="ts">
const route = useRoute()

definePageMeta({
  // Choose layout based on route params
  layout: 'default',

  // Middleware can be a function
  middleware: [
    function (to, from) {
      // Custom logic
      if (!isAuthenticated()) {
        return navigateTo('/login')
      }
    }
  ],

  // Validate route params
  validate: async (route) => {
    return /^\d+$/.test(route.params.id as string)
  }
})
</script>
```

## Reading Page Metadata
```vue
<script setup lang="ts">
const route = useRoute()

// Access current page's metadata
const pageTitle = route.meta.title
const permissions = route.meta.requiredPermissions
</script>
```

## Why
- Centralized page configuration management
- Compile-time optimization (not runtime)
- Type safety
- Supports code splitting
