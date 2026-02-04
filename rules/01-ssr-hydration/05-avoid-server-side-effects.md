---
id: ssr-05
title: Avoid Server-Side Side Effects
priority: high
category: ssr-hydration
tags: [ssr, side-effects, memory-leak]
---

# Avoid Server-Side Side Effects

## Problem
Side effects during server-side rendering (timers, global state modifications) can cause memory leaks and cross-request contamination.

## Bad Example
```vue
<script setup lang="ts">
// Bad: Timers set on server will never be cleaned up
setInterval(() => {
  refreshData()
}, 5000)

// Bad: Modifying global/module-level state contaminates other requests
globalState.currentUser = user

// Bad: Establishing WebSocket connection on server
const ws = new WebSocket('wss://api.example.com')
</script>
```

## Good Example
```vue
<script setup lang="ts">
// Set timers only on client
onMounted(() => {
  const timer = setInterval(() => {
    refreshData()
  }, 5000)

  // Clean up when component unmounts
  onUnmounted(() => {
    clearInterval(timer)
  })
})

// Use useState instead of global state (Nuxt isolates each request)
const currentUser = useState('currentUser', () => null)

// Establish WebSocket only on client
const ws = ref<WebSocket | null>(null)
onMounted(() => {
  ws.value = new WebSocket('wss://api.example.com')
})
onUnmounted(() => {
  ws.value?.close()
})
</script>
```

## Use VueUse to Manage Side Effects
```vue
<script setup lang="ts">
import { useIntervalFn, useWebSocket } from '@vueuse/core'

// Automatically handles SSR and cleanup
const { pause, resume } = useIntervalFn(() => {
  refreshData()
}, 5000)

// WebSocket automatically handles connection and disconnection
const { status, data, send } = useWebSocket('wss://api.example.com')
</script>
```

## Why
- Server is a multi-user shared environment, each request should be isolated
- Server has no concept of component "unmounting", timers will keep running causing memory leaks
- Module-level variables are shared across requests on server, causing data contamination

## Checklist
- [ ] Are timers (setTimeout/setInterval) set in onMounted?
- [ ] Are event listeners removed in onUnmounted?
- [ ] Is useState used instead of module-level state?
- [ ] Are WebSocket/EventSource only established on client?
