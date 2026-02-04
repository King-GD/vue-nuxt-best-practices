---
id: nuxt-01
title: 使用 routeRules 配置缓存策略
priority: high
category: nuxt-specific
tags: [nuxt, cache, isr, swr]
---

# 使用 routeRules 配置缓存策略

## 问题
所有页面使用相同的渲染策略不够灵活，无法针对不同内容优化。

## 正确配置
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // 静态页面：构建时预渲染
    '/': { prerender: true },
    '/about': { prerender: true },

    // ISR：增量静态再生成（每小时重新生成）
    '/blog/**': { isr: 3600 },

    // SWR：stale-while-revalidate
    '/api/products': {
      swr: 60,  // 60秒内使用缓存，同时后台刷新
      cache: {
        maxAge: 60,
        staleMaxAge: 3600
      }
    },

    // 纯客户端渲染
    '/admin/**': { ssr: false },

    // 禁用缓存
    '/api/user': { cache: false },

    // 重定向
    '/old-page': { redirect: '/new-page' },

    // CORS 头
    '/api/**': {
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  }
})
```

## 动态 routeRules
```ts
// server/plugins/dynamic-rules.ts
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', async (event) => {
    const path = event.path

    // 根据路径动态设置缓存
    if (path.startsWith('/product/')) {
      event.context.cache = {
        maxAge: 300,
        swr: true
      }
    }
  })
})
```

## 原因
- 不同内容类型需要不同的缓存策略
- ISR 适合更新不频繁的内容
- SWR 提供即时响应同时保持数据新鲜
- 管理后台等不需要 SEO 的页面可禁用 SSR
