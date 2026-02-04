---
id: bundle-01
title: 使用动态 import 代码分割
priority: high
category: bundle-optimization
tags: [bundle, code-splitting, dynamic-import]
---

# 使用动态 import 代码分割

## 问题
所有代码打包在一起会导致初始 bundle 过大。

## 错误示例
```ts
// 错误：静态导入大型库
import { Chart } from 'echarts'
import * as XLSX from 'xlsx'
import MarkdownIt from 'markdown-it'

// 即使用户不使用这些功能，也会加载
```

## 正确示例
```ts
// 正确：动态导入，按需加载
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

// 结合 defineAsyncComponent
const MarkdownPreview = defineAsyncComponent(async () => {
  const [{ default: MarkdownIt }, { default: Component }] = await Promise.all([
    import('markdown-it'),
    import('./MarkdownPreview.vue')
  ])
  // 可以在这里初始化 MarkdownIt
  return Component
})
```

## 路由级别分割
```ts
// Nuxt 自动对页面进行代码分割
// pages/admin/dashboard.vue 只在访问时加载

// 手动配置预加载
definePageMeta({
  // 预加载相关组件
})
```

## 分析 bundle
```bash
# 使用 nuxi analyze 分析 bundle 构成
npx nuxi analyze

# 或配置 vite-bundle-visualizer
```

## 原因
- 代码分割减少初始加载体积
- 用户只加载当前需要的代码
- 提升 FCP 和 TTI 指标
- Nuxt 对页面自动分割
