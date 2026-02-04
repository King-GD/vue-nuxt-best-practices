---
id: bundle-02
title: Tree-Shaking Friendly Import Style
priority: high
category: bundle-optimization
tags: [bundle, tree-shaking, import]
---

# Tree-Shaking Friendly Import Style

## Problem
Incorrect import styles cause the entire library to be bundled.

## Bad Example
```ts
// Bad: Importing entire lodash (~70KB)
import _ from 'lodash'
const result = _.debounce(fn, 300)

// Bad: Namespace import
import * as utils from './utils'
console.log(utils.formatDate(date))

// Bad: Importing from barrel files
import { Button } from '@/components'  // If index.ts exports all components
```

## Good Example
```ts
// Good: Use lodash-es with named imports
import { debounce } from 'lodash-es'
const result = debounce(fn, 300)

// Good: Direct import of needed function
import debounce from 'lodash-es/debounce'

// Good: Named imports
import { formatDate } from './utils/date'

// Good: Import directly from component file
import Button from '@/components/Button.vue'
```

## On-Demand Component Library Import
```ts
// nuxt.config.ts - Element Plus auto on-demand import
export default defineNuxtConfig({
  modules: ['@element-plus/nuxt'],
  elementPlus: {
    // On-demand import
  }
})

// Use directly, no manual import needed
// <el-button>Button</el-button>
```

## Check Tree-Shaking Effect
```ts
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Analyze large dependencies
        }
      }
    }
  }
}
```

## Why
- ESM named imports support static analysis
- Build tools can remove unused exports
- lodash-es is more suitable for modern bundling than lodash
- Avoid accidental bundling caused by barrel files
