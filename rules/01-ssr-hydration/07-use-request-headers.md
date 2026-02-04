---
id: ssr-07
title: Use useRequestHeaders for Request Information
priority: medium
category: ssr-hydration
tags: [ssr, headers, cookies]
---

# Use useRequestHeaders for Request Information

## Problem
When accessing request headers (like cookies, user-agent) during SSR, you cannot directly use browser APIs.

## Bad Example
```vue
<script setup lang="ts">
// Bad: document.cookie doesn't exist on server
const token = document.cookie.split('token=')[1]

// Bad: navigator doesn't exist on server
const isMobile = navigator.userAgent.includes('Mobile')
</script>
```

## Good Example
```vue
<script setup lang="ts">
// Use Nuxt-provided composable
const headers = useRequestHeaders(['cookie', 'user-agent'])

// Get cookie
const cookies = headers.cookie || ''
const token = useCookie('token')

// Get User-Agent
const userAgent = headers['user-agent'] || ''
const isMobile = computed(() => /Mobile/i.test(userAgent))

// Client-side supplement
onMounted(() => {
  // Client can get more information
  if (!userAgent) {
    // Use browser API
  }
})
</script>
```

## Using useCookie
```vue
<script setup lang="ts">
// Nuxt built-in, SSR-friendly cookie operations
const token = useCookie('auth-token')
const theme = useCookie('theme', { default: () => 'light' })

// Set cookie
token.value = 'new-token'

// Configuration options
const session = useCookie('session', {
  maxAge: 60 * 60 * 24 * 7, // 7 days
  secure: true,
  httpOnly: false
})
</script>
```

## Getting Request URL
```vue
<script setup lang="ts">
// Get current request URL information
const requestURL = useRequestURL()
console.log(requestURL.pathname)
console.log(requestURL.searchParams.get('id'))
</script>
```

## Why
- `useRequestHeaders` returns real request headers on server, empty object on client
- `useCookie` handles server and client cookie operations uniformly
- Avoids hydration mismatch
