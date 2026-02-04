---
id: nuxt-05
title: 插件加载顺序控制
priority: medium
category: nuxt-specific
tags: [nuxt, plugins, order]
---

# 插件加载顺序控制

## 问题
插件之间有依赖关系时，加载顺序不正确会导致错误。

## 插件命名约定
```
plugins/
├── 01.init.ts          # 数字前缀控制顺序
├── 02.auth.ts
├── 03.analytics.ts
├── api.client.ts       # .client 只在客户端加载
├── seo.server.ts       # .server 只在服务端加载
└── utils.ts            # 两端都加载
```

## 配置加载顺序
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  plugins: [
    // 手动指定顺序
    '~/plugins/init.ts',
    '~/plugins/auth.ts',
    { src: '~/plugins/analytics.ts', mode: 'client' }
  ]
})
```

## 插件依赖
```ts
// plugins/api.ts
export default defineNuxtPlugin({
  name: 'api',
  dependsOn: ['auth'], // 依赖 auth 插件
  async setup(nuxtApp) {
    // auth 插件已加载
    const token = nuxtApp.$auth?.token
  }
})

// plugins/auth.ts
export default defineNuxtPlugin({
  name: 'auth',
  async setup(nuxtApp) {
    // 初始化 auth
    nuxtApp.provide('auth', {
      token: 'xxx'
    })
  }
})
```

## 并行加载
```ts
// plugins/parallel.ts
export default defineNuxtPlugin({
  name: 'my-plugin',
  parallel: true, // 允许并行加载
  async setup(nuxtApp) {
    // 不依赖其他插件
  }
})
```

## 原因
- 插件默认按文件名顺序加载
- 数字前缀是简单的排序方式
- dependsOn 明确声明依赖关系
- parallel 提升启动性能
