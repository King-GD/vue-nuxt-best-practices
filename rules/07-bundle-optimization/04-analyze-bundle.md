---
id: bundle-04
title: Use nuxi analyze to Analyze Bundle
priority: medium
category: bundle-optimization
tags: [bundle, analyze, optimization]
---

# Use nuxi analyze to Analyze Bundle

## Problem
You cannot optimize effectively without understanding the bundle composition.

## Usage
```bash
# Generate bundle analysis report
npx nuxi analyze

# Opens a visualization page showing:
# - Size of each module
# - Dependency relationships
# - Duplicate bundled libraries
```

## Analysis Focus Points
```
1. Identify Large Dependencies
   - Look for packages over 100KB
   - Consider if they can be replaced or lazy-loaded

2. Discover Duplicate Dependencies
   - Same library bundled multiple times
   - Different versions of the same library

3. Check Vendor Chunk
   - node_modules proportion
   - Are there unnecessary packages
```

## Configure Manual Chunking
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Bundle large libraries separately
            'echarts': ['echarts', 'echarts/core'],
            'element-plus': ['element-plus'],
            'vendor': ['lodash-es', 'dayjs', 'axios']
          }
        }
      }
    }
  }
})
```

## Monitor Bundle Size
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    build: {
      // Warn when threshold exceeded
      chunkSizeWarningLimit: 500 // KB
    }
  }
})
```

## Why
- Understanding bundle composition enables targeted optimization
- Discover unexpectedly bundled large dependencies
- Guide code splitting strategy
- Continuous monitoring prevents bundle bloat
