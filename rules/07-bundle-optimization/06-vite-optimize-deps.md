---
id: bundle-06
title: Configure vite.optimizeDeps
priority: medium
category: bundle-optimization
tags: [bundle, vite, optimize]
---

# Configure vite.optimizeDeps

## Problem
Slow initial load in dev environment, or some dependencies fail to pre-bundle correctly.

## Correct Configuration
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    optimizeDeps: {
      // Force pre-bundle these dependencies
      include: [
        'lodash-es',
        'dayjs',
        'axios',
        'echarts/core',
        'echarts/charts',
        'echarts/components',
        'vue-echarts'
      ],

      // Exclude packages that don't need pre-bundling (e.g., already ESM)
      exclude: [
        '@vueuse/core'  // Already ESM, no pre-bundling needed
      ]
    },

    // SSR-specific configuration
    ssr: {
      // Force externalize (don't bundle into server bundle)
      external: ['some-server-only-package'],

      // Force inline (bundle into server bundle)
      noExternal: ['some-esm-package']
    }
  }
})
```

## Solve Common Issues
```ts
// Dependency pre-bundling issues
export default defineNuxtConfig({
  vite: {
    optimizeDeps: {
      // Force re-prebundle
      force: true,

      // Custom esbuild options
      esbuildOptions: {
        // Support top-level await
        target: 'esnext'
      }
    }
  }
})
```

## Clear Cache
```bash
# Try clearing cache when dev environment issues occur
rm -rf node_modules/.vite
rm -rf .nuxt

# Restart
npm run dev
```

## Why
- Pre-bundling converts CommonJS to ESM
- Reduces number of requests in dev environment
- Solves compatibility issues with some packages
- Optimizes dev server startup speed
