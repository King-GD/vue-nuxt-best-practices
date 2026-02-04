---
id: nuxt-05
title: Plugin Loading Order Control
priority: medium
category: nuxt-specific
tags: [nuxt, plugins, order]
---

# Plugin Loading Order Control

## Problem
When plugins have dependencies, incorrect loading order causes errors.

## Plugin Naming Convention
```
plugins/
├── 01.init.ts          # Numeric prefix controls order
├── 02.auth.ts
├── 03.analytics.ts
├── api.client.ts       # .client loads only on client
├── seo.server.ts       # .server loads only on server
└── utils.ts            # Loads on both sides
```

## Configure Loading Order
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  plugins: [
    // Manually specify order
    '~/plugins/init.ts',
    '~/plugins/auth.ts',
    { src: '~/plugins/analytics.ts', mode: 'client' }
  ]
})
```

## Plugin Dependencies
```ts
// plugins/api.ts
export default defineNuxtPlugin({
  name: 'api',
  dependsOn: ['auth'], // Depends on auth plugin
  async setup(nuxtApp) {
    // auth plugin is loaded
    const token = nuxtApp.$auth?.token
  }
})

// plugins/auth.ts
export default defineNuxtPlugin({
  name: 'auth',
  async setup(nuxtApp) {
    // Initialize auth
    nuxtApp.provide('auth', {
      token: 'xxx'
    })
  }
})
```

## Parallel Loading
```ts
// plugins/parallel.ts
export default defineNuxtPlugin({
  name: 'my-plugin',
  parallel: true, // Allow parallel loading
  async setup(nuxtApp) {
    // Does not depend on other plugins
  }
})
```

## Why
- Plugins load in filename order by default
- Numeric prefix is a simple sorting method
- dependsOn explicitly declares dependencies
- parallel improves startup performance
