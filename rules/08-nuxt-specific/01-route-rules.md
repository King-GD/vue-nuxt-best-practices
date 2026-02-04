---
id: nuxt-01
title: Use routeRules to Configure Caching Strategy
priority: high
category: nuxt-specific
tags: [nuxt, cache, isr, swr]
---

# Use routeRules to Configure Caching Strategy

## Problem
Using the same rendering strategy for all pages is inflexible and cannot optimize for different content types.

## Correct Configuration
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // Static pages: prerender at build time
    '/': { prerender: true },
    '/about': { prerender: true },

    // ISR: Incremental Static Regeneration (regenerate every hour)
    '/blog/**': { isr: 3600 },

    // SWR: stale-while-revalidate
    '/api/products': {
      swr: 60,  // Use cache for 60 seconds while refreshing in background
      cache: {
        maxAge: 60,
        staleMaxAge: 3600
      }
    },

    // Client-side only rendering
    '/admin/**': { ssr: false },

    // Disable caching
    '/api/user': { cache: false },

    // Redirect
    '/old-page': { redirect: '/new-page' },

    // CORS headers
    '/api/**': {
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  }
})
```

## Dynamic routeRules
```ts
// server/plugins/dynamic-rules.ts
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', async (event) => {
    const path = event.path

    // Dynamically set cache based on path
    if (path.startsWith('/product/')) {
      event.context.cache = {
        maxAge: 300,
        swr: true
      }
    }
  })
})
```

## Why
- Different content types require different caching strategies
- ISR is suitable for content that updates infrequently
- SWR provides instant response while keeping data fresh
- Pages that don't need SEO (like admin panels) can disable SSR
