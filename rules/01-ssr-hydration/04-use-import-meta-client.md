---
id: ssr-04
title: 使用 import.meta.client 条件判断
priority: high
category: ssr-hydration
tags: [ssr, conditional, nuxt]
---

# 使用 import.meta.client 条件判断

## 问题
某些代码逻辑只应在客户端或服务端执行，需要正确的环境判断。

## 错误示例
```vue
<script setup lang="ts">
// 错误：process.client 在 Nuxt 3/4 中已弃用
if (process.client) {
  initAnalytics()
}

// 错误：typeof window 检查不够可靠
if (typeof window !== 'undefined') {
  window.scrollTo(0, 0)
}
</script>
```

## 正确示例
```vue
<script setup lang="ts">
// Nuxt 3/4 推荐方式
if (import.meta.client) {
  // 仅客户端执行
  initAnalytics()

  const { default: confetti } = await import('canvas-confetti')
  confetti()
}

if (import.meta.server) {
  // 仅服务端执行
  console.log('Server-side rendering')
}
</script>
```

## 动态导入客户端专属模块
```vue
<script setup lang="ts">
// 懒加载客户端专属库
const echarts = import.meta.client
  ? await import('echarts')
  : null

// 或使用 onMounted
onMounted(async () => {
  const { default: Swiper } = await import('swiper')
  new Swiper('.swiper-container')
})
</script>
```

## Nuxt 插件中使用
```ts
// plugins/analytics.client.ts
// 文件名带 .client 后缀，自动只在客户端加载

export default defineNuxtPlugin(() => {
  // 无需 import.meta.client 判断
  initGoogleAnalytics()
})
```

## 环境变量对照表
| 环境 | 判断方式 |
|------|---------|
| 客户端 | `import.meta.client` |
| 服务端 | `import.meta.server` |
| 开发模式 | `import.meta.dev` |
| 生产模式 | `import.meta.prod` |
| 预渲染 | `import.meta.prerender` |

## 原因
- `import.meta.client/server` 是 Nuxt 3/4 官方推荐的环境判断方式
- 构建时会被静态分析，支持 tree-shaking
- 比运行时检查更可靠、更高效
