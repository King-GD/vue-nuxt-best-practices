---
id: ssr-08
title: 正确处理 SEO 元信息
priority: high
category: ssr-hydration
tags: [ssr, seo, head, meta]
---

# 正确处理 SEO 元信息

## 问题
动态 SEO 信息需要在服务端正确渲染，否则搜索引擎无法抓取。

## 错误示例
```vue
<script setup lang="ts">
// 错误：onMounted 在服务端不执行
onMounted(() => {
  document.title = article.value.title
  document.querySelector('meta[name="description"]')
    ?.setAttribute('content', article.value.summary)
})
</script>
```

## 正确示例
```vue
<script setup lang="ts">
const { data: article } = await useFetch('/api/article/1')

// 使用 useHead 或 useSeoMeta
useHead({
  title: () => article.value?.title,
  meta: [
    { name: 'description', content: () => article.value?.summary }
  ]
})

// 或使用更语义化的 useSeoMeta
useSeoMeta({
  title: () => article.value?.title,
  ogTitle: () => article.value?.title,
  description: () => article.value?.summary,
  ogDescription: () => article.value?.summary,
  ogImage: () => article.value?.cover
})
</script>
```

## 页面级 SEO 配置
```vue
<script setup lang="ts">
// 使用 definePageMeta 设置页面元信息
definePageMeta({
  title: '关于我们',
  description: '了解我们的团队和使命'
})
</script>
```

## 动态标题模板
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate: '%s - FOFA',
      // 或使用函数
      titleTemplate: (title) => title ? `${title} - FOFA` : 'FOFA'
    }
  }
})
```

## 结构化数据
```vue
<script setup lang="ts">
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.value?.title,
        author: article.value?.author
      })
    }
  ]
})
</script>
```

## 原因
- `useHead` 和 `useSeoMeta` 在 SSR 时正确渲染到 HTML
- 支持响应式数据，页面数据变化时自动更新
- 搜索引擎爬虫可以直接获取完整的元信息
