---
id: bundle-03
title: Configure build.transpile to Optimize Dependencies
priority: medium
category: bundle-optimization
tags: [bundle, transpile, nuxt]
---

# Configure build.transpile to Optimize Dependencies

## Problem
Some npm packages are not compiled to ES5 or have ESM compatibility issues.

## Bad Example
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  // Without transpile config, some packages may error in older browsers
})

// Console error: Unexpected token 'export'
```

## Good Example
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  build: {
    transpile: [
      // ESM packages need transpilation
      'vue-echarts',
      'resize-detector',

      // Regex matching
      /echarts/,

      // Conditional transpilation
      ...(process.env.NODE_ENV === 'production' ? ['some-package'] : [])
    ]
  },

  vite: {
    optimizeDeps: {
      include: [
        // Pre-bundle these dependencies
        'lodash-es',
        'dayjs',
        'axios'
      ],
      exclude: [
        // Exclude packages that don't need pre-bundling
      ]
    }
  }
})
```

## Handle CommonJS Dependencies
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    build: {
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true
      }
    }
  }
})
```

## Debug Dependency Issues
```bash
# Clear cache and rebuild
rm -rf .nuxt node_modules/.vite
npm run build

# Analyze which package is causing issues
npx nuxi analyze
```

## Why
- Some npm packages use modern JS syntax without transpilation
- Mixing ESM and CJS can cause issues
- transpile ensures compatibility
- optimizeDeps optimizes dev environment startup speed
