---
id: bundle-03
title: 配置 build.transpile 优化依赖
priority: medium
category: bundle-optimization
tags: [bundle, transpile, nuxt]
---

# 配置 build.transpile 优化依赖

## 问题
某些 npm 包未编译为 ES5 或存在 ESM 兼容问题。

## 错误示例
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  // 未配置 transpile，某些包可能在低版本浏览器报错
})

// 控制台错误：Unexpected token 'export'
```

## 正确示例
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  build: {
    transpile: [
      // ESM 包需要转译
      'vue-echarts',
      'resize-detector',

      // 正则匹配
      /echarts/,

      // 条件转译
      ...(process.env.NODE_ENV === 'production' ? ['some-package'] : [])
    ]
  },

  vite: {
    optimizeDeps: {
      include: [
        // 预构建这些依赖
        'lodash-es',
        'dayjs',
        'axios'
      ],
      exclude: [
        // 排除不需要预构建的
      ]
    }
  }
})
```

## 处理 CommonJS 依赖
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    build: {
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true
      }
    }
  }
})
```

## 调试依赖问题
```bash
# 清除缓存重新构建
rm -rf .nuxt node_modules/.vite
npm run build

# 分析是哪个包导致的问题
npx nuxi analyze
```

## 原因
- 部分 npm 包使用现代 JS 语法未转译
- ESM 和 CJS 混用可能导致问题
- transpile 确保兼容性
- optimizeDeps 优化开发环境启动速度
