---
id: bundle-06
title: 配置 vite.optimizeDeps
priority: medium
category: bundle-optimization
tags: [bundle, vite, optimize]
---

# 配置 vite.optimizeDeps

## 问题
开发环境首次加载慢，或某些依赖无法正确预构建。

## 正确配置
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    optimizeDeps: {
      // 强制预构建这些依赖
      include: [
        'lodash-es',
        'dayjs',
        'axios',
        'echarts/core',
        'echarts/charts',
        'echarts/components',
        'vue-echarts'
      ],

      // 排除不需要预构建的（如已经是 ESM 的包）
      exclude: [
        '@vueuse/core'  // 已经是 ESM，不需要预构建
      ]
    },

    // SSR 专属配置
    ssr: {
      // 强制外部化（不打包进 server bundle）
      external: ['some-server-only-package'],

      // 强制内联（打包进 server bundle）
      noExternal: ['some-esm-package']
    }
  }
})
```

## 解决常见问题
```ts
// 依赖预构建问题
export default defineNuxtConfig({
  vite: {
    optimizeDeps: {
      // 强制重新预构建
      force: true,

      // 自定义 esbuild 选项
      esbuildOptions: {
        // 支持顶层 await
        target: 'esnext'
      }
    }
  }
})
```

## 清除缓存
```bash
# 开发环境问题时尝试清除缓存
rm -rf node_modules/.vite
rm -rf .nuxt

# 重新启动
npm run dev
```

## 原因
- 预构建将 CommonJS 转换为 ESM
- 减少开发环境的请求数量
- 解决某些包的兼容性问题
- 优化开发服务器启动速度
