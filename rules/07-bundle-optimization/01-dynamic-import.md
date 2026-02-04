---
id: bundle-01
title: Use Dynamic Import for Code Splitting
priority: high
category: bundle-optimization
tags: [bundle, code-splitting, dynamic-import]
---

# Use Dynamic Import for Code Splitting

## Problem
Bundling all code together leads to an excessively large initial bundle.

## Bad Example
```ts
// Bad: Static imports of large libraries
import { Chart } from 'echarts'
import * as XLSX from 'xlsx'
import MarkdownIt from 'markdown-it'

// These are loaded even if users don't use these features
```

## Good Example
```ts
// Good: Dynamic imports, load on demand
async function renderChart(data: ChartData) {
  const { Chart } = await import('echarts')
  const chart = new Chart(container)
  chart.setOption(data)
}

async function exportExcel(data: any[]) {
  const XLSX = await import('xlsx')
  const ws = XLSX.utils.json_to_sheet(data)
  // ...
}

// Combined with defineAsyncComponent
const MarkdownPreview = defineAsyncComponent(async () => {
  const [{ default: MarkdownIt }, { default: Component }] = await Promise.all([
    import('markdown-it'),
    import('./MarkdownPreview.vue')
  ])
  // MarkdownIt can be initialized here
  return Component
})
```

## Route-Level Splitting
```ts
// Nuxt automatically code-splits pages
// pages/admin/dashboard.vue only loads when accessed

// Manual preload configuration
definePageMeta({
  // Preload related components
})
```

## Analyze Bundle
```bash
# Use nuxi analyze to analyze bundle composition
npx nuxi analyze

# Or configure vite-bundle-visualizer
```

## Why
- Code splitting reduces initial load size
- Users only load the code they currently need
- Improves FCP and TTI metrics
- Nuxt automatically splits pages
