---
id: nuxt-02
title: Correctly Use Nuxt Layers
priority: medium
category: nuxt-specific
tags: [nuxt, layers, modular]
---

# Correctly Use Nuxt Layers

## Problem
Code in large projects is difficult to reuse and maintain.

## Layer Structure
```
my-layer/
├── nuxt.config.ts
├── components/
│   └── MyButton.vue
├── composables/
│   └── useMyFeature.ts
├── pages/
│   └── layer-page.vue
└── plugins/
    └── my-plugin.ts
```

## Using Layers
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: [
    // Local layer
    './layers/base',
    './layers/admin',

    // npm package
    '@my-org/nuxt-base-layer',

    // GitHub (requires giget)
    'github:user/repo/layer'
  ]
})
```

## Creating Reusable Layers
```ts
// layers/base/nuxt.config.ts
export default defineNuxtConfig({
  // Base configuration
  modules: ['@pinia/nuxt'],

  // Common styles
  css: ['./assets/base.css'],

  // Default config, can be overridden by parent
  runtimeConfig: {
    public: {
      apiBase: '/api'
    }
  }
})
```

## Layer Priority
```ts
// Later layers override earlier ones
extends: [
  './layers/base',     // Lowest priority
  './layers/feature',  // Middle
  // Main project config has highest priority
]
```

## Why
- Code reuse across projects
- Separation of concerns
- Independent development and testing
- Modular architecture similar to micro-frontends
