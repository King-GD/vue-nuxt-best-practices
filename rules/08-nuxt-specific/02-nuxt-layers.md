---
id: nuxt-02
title: 正确使用 Nuxt Layers
priority: medium
category: nuxt-specific
tags: [nuxt, layers, modular]
---

# 正确使用 Nuxt Layers

## 问题
大型项目代码难以复用和维护。

## Layer 结构
```
my-layer/
├── nuxt.config.ts
├── components/
│   └── MyButton.vue
├── composables/
│   └── useMyFeature.ts
├── pages/
│   └── layer-page.vue
└── plugins/
    └── my-plugin.ts
```

## 使用 Layer
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: [
    // 本地 layer
    './layers/base',
    './layers/admin',

    // npm 包
    '@my-org/nuxt-base-layer',

    // GitHub（需要安装 giget）
    'github:user/repo/layer'
  ]
})
```

## 创建可复用 Layer
```ts
// layers/base/nuxt.config.ts
export default defineNuxtConfig({
  // 基础配置
  modules: ['@pinia/nuxt'],

  // 公共样式
  css: ['./assets/base.css'],

  // 默认配置，可被上层覆盖
  runtimeConfig: {
    public: {
      apiBase: '/api'
    }
  }
})
```

## Layer 优先级
```ts
// 后面的 layer 覆盖前面的
extends: [
  './layers/base',     // 优先级最低
  './layers/feature',  // 中间
  // 主项目配置优先级最高
]
```

## 原因
- 代码复用跨项目
- 关注点分离
- 独立开发和测试
- 类似微前端的模块化架构
