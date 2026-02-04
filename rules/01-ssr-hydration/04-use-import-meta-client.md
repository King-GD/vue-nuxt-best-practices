---
id: ssr-04
title: Use import.meta.client for Conditional Logic
priority: high
category: ssr-hydration
tags: [ssr, conditional, nuxt]
---

# Use import.meta.client for Conditional Logic

## Problem
Some code logic should only execute on the client or server side, requiring proper environment detection.

## Bad Example
```vue
<script setup lang="ts">
// Bad: process.client is deprecated in Nuxt 3/4
if (process.client) {
  initAnalytics()
}

// Bad: typeof window check is not reliable enough
if (typeof window !== 'undefined') {
  window.scrollTo(0, 0)
}
</script>
```

## Good Example
```vue
<script setup lang="ts">
// Nuxt 3/4 recommended approach
if (import.meta.client) {
  // Client-side only execution
  initAnalytics()

  const { default: confetti } = await import('canvas-confetti')
  confetti()
}

if (import.meta.server) {
  // Server-side only execution
  console.log('Server-side rendering')
}
</script>
```

## Dynamic Import for Client-Only Modules
```vue
<script setup lang="ts">
// Lazy load client-only libraries
const echarts = import.meta.client
  ? await import('echarts')
  : null

// Or use onMounted
onMounted(async () => {
  const { default: Swiper } = await import('swiper')
  new Swiper('.swiper-container')
})
</script>
```

## Usage in Nuxt Plugins
```ts
// plugins/analytics.client.ts
// Files with .client suffix automatically load only on client

export default defineNuxtPlugin(() => {
  // No need for import.meta.client check
  initGoogleAnalytics()
})
```

## Environment Variables Reference
| Environment | Detection Method |
|-------------|------------------|
| Client | `import.meta.client` |
| Server | `import.meta.server` |
| Development | `import.meta.dev` |
| Production | `import.meta.prod` |
| Prerender | `import.meta.prerender` |

## Why
- `import.meta.client/server` is the officially recommended environment detection for Nuxt 3/4
- Statically analyzed at build time, supports tree-shaking
- More reliable and efficient than runtime checks
