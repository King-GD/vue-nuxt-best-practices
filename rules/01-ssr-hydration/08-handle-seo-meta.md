---
id: ssr-08
title: Handle SEO Meta Information Correctly
priority: high
category: ssr-hydration
tags: [ssr, seo, head, meta]
---

# Handle SEO Meta Information Correctly

## Problem
Dynamic SEO information needs to be rendered correctly on the server, otherwise search engines cannot crawl it.

## Bad Example
```vue
<script setup lang="ts">
// Bad: onMounted doesn't run on server
onMounted(() => {
  document.title = article.value.title
  document.querySelector('meta[name="description"]')
    ?.setAttribute('content', article.value.summary)
})
</script>
```

## Good Example
```vue
<script setup lang="ts">
const { data: article } = await useFetch('/api/article/1')

// Use useHead or useSeoMeta
useHead({
  title: () => article.value?.title,
  meta: [
    { name: 'description', content: () => article.value?.summary }
  ]
})

// Or use more semantic useSeoMeta
useSeoMeta({
  title: () => article.value?.title,
  ogTitle: () => article.value?.title,
  description: () => article.value?.summary,
  ogDescription: () => article.value?.summary,
  ogImage: () => article.value?.cover
})
</script>
```

## Page-Level SEO Configuration
```vue
<script setup lang="ts">
// Use definePageMeta to set page metadata
definePageMeta({
  title: 'About Us',
  description: 'Learn about our team and mission'
})
</script>
```

## Dynamic Title Template
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate: '%s - MyApp',
      // Or use a function
      titleTemplate: (title) => title ? `${title} - MyApp` : 'MyApp'
    }
  }
})
```

## Structured Data
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

## Why
- `useHead` and `useSeoMeta` render correctly to HTML during SSR
- Supports reactive data, automatically updates when page data changes
- Search engine crawlers can directly get complete meta information
