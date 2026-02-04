---
id: bundle-05
title: Avoid Full Component Library Imports
priority: high
category: bundle-optimization
tags: [bundle, component-library, element-plus]
---

# Avoid Full Component Library Imports

## Problem
Full imports of UI component libraries significantly increase bundle size.

## Bad Example
```ts
// plugins/element-plus.ts
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  // Bad: Full import, bundles all components (~1MB)
  nuxtApp.vueApp.use(ElementPlus)
})
```

## Good Example
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@element-plus/nuxt'],
  elementPlus: {
    // Auto on-demand import
    importStyle: 'scss',
    themes: ['dark']
  }
})

// Use directly in templates, no manual import needed
// <el-button>Button</el-button>
// <el-input v-model="value" />
```

## Manual On-Demand Import
```ts
// If not using @element-plus/nuxt
import { ElButton, ElInput, ElMessage } from 'element-plus'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/input/style/css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('ElButton', ElButton)
  nuxtApp.vueApp.component('ElInput', ElInput)
})
```

## On-Demand Icon Import
```vue
<script setup lang="ts">
// Bad: Import all icons
import * as Icons from '@element-plus/icons-vue'

// Good: Import only what's needed
import { Search, Plus, Delete } from '@element-plus/icons-vue'
</script>
```

## Why
- Element Plus full import is ~1MB, on-demand may only need 100KB
- @element-plus/nuxt automatically handles on-demand imports
- Icon libraries also need on-demand imports
- Significantly reduces first-screen load time
