---
id: ssr-03
title: Use onMounted for Browser APIs
priority: critical
category: ssr-hydration
tags: [ssr, lifecycle, browser-api]
---

# Use onMounted for Browser APIs

## Problem
Directly accessing browser APIs at the top level of `<script setup>` causes server-side rendering errors.

## Bad Example
```vue
<script setup lang="ts">
// Bad: setup phase also runs on server
const width = window.innerWidth
const token = localStorage.getItem('token')
const userAgent = navigator.userAgent

// Bad: Adding event listeners at top level
window.addEventListener('resize', handleResize)
</script>
```

## Good Example
```vue
<script setup lang="ts">
const width = ref(0)
const token = ref<string | null>(null)
const userAgent = ref('')

onMounted(() => {
  // Access browser APIs only after client-side mount
  width.value = window.innerWidth
  token.value = localStorage.getItem('token')
  userAgent.value = navigator.userAgent

  // Add event listeners in mounted
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // Remember to clean up event listeners
  window.removeEventListener('resize', handleResize)
})

function handleResize() {
  width.value = window.innerWidth
}
</script>
```

## Simplify with VueUse
```vue
<script setup lang="ts">
import { useWindowSize, useLocalStorage } from '@vueuse/core'

// VueUse composables already handle SSR compatibility
const { width, height } = useWindowSize()
const token = useLocalStorage('token', null)
</script>
```

## Why
- Code in `<script setup>` runs on both server and client
- `onMounted` only runs on client, when DOM and browser APIs are available
- Directly accessing `window`/`document` throws ReferenceError in Node.js environment

## Recommended VueUse Composables
| API | VueUse Alternative |
|-----|-------------------|
| window.innerWidth | `useWindowSize()` |
| localStorage | `useLocalStorage()` |
| navigator.userAgent | `useUserAgent()` |
| document.title | `useTitle()` |
| matchMedia | `useMediaQuery()` |
