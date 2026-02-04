---
id: bundle-07
title: Use External CDN for Large Libraries
priority: low
category: bundle-optimization
tags: [bundle, cdn, external]
---

# Use External CDN for Large Libraries

## Problem
Large libraries (like echarts) have significant bundle size after packaging, affecting load speed.

## Configuration Example
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      script: [
        // Load echarts from CDN
        {
          src: 'https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js',
          defer: true
        }
      ]
    }
  },

  vite: {
    build: {
      rollupOptions: {
        external: ['echarts'],
        output: {
          globals: {
            echarts: 'echarts'
          }
        }
      }
    }
  }
})
```

## Using @nuxt/scripts
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/scripts'],
  scripts: {
    globals: {
      echarts: {
        src: 'https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js'
      }
    }
  }
})

// In component
<script setup lang="ts">
const { $script } = useScript('echarts')
await $script
// echarts is loaded
</script>
```

## Important Notes
```ts
// 1. Ensure CDN reliability
// 2. Consider using local CDN for users in certain regions
// 3. Add integrity verification
{
  src: 'https://cdn.example.com/lib.js',
  integrity: 'sha384-xxx',
  crossorigin: 'anonymous'
}

// 4. Provide fallback
<script>
  window.echarts || document.write('<script src="/fallback/echarts.js"><\/script>')
</script>
```

## Why
- CDN edge nodes are closer to users
- May already be cached by other websites
- Reduces server bundle size
- Suitable for large libraries that don't update frequently
