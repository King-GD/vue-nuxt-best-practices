---
id: bundle-04
title: 使用 nuxi analyze 分析 bundle
priority: medium
category: bundle-optimization
tags: [bundle, analyze, optimization]
---

# 使用 nuxi analyze 分析 bundle

## 问题
不了解 bundle 构成就无法有效优化。

## 使用方法
```bash
# 生成 bundle 分析报告
npx nuxi analyze

# 会打开一个可视化页面显示：
# - 各模块大小
# - 依赖关系
# - 重复打包的库
```

## 分析要点
```
1. 识别大型依赖
   - 查找超过 100KB 的包
   - 考虑是否可以替换或懒加载

2. 发现重复依赖
   - 同一个库被打包多次
   - 不同版本的同一个库

3. 检查 vendor chunk
   - node_modules 占比
   - 是否有不必要的包
```

## 配置手动分块
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // 将大型库单独打包
            'echarts': ['echarts', 'echarts/core'],
            'element-plus': ['element-plus'],
            'vendor': ['lodash-es', 'dayjs', 'axios']
          }
        }
      }
    }
  }
})
```

## 监控 bundle 大小
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    build: {
      // 超过阈值时警告
      chunkSizeWarningLimit: 500 // KB
    }
  }
})
```

## 原因
- 了解 bundle 构成才能针对性优化
- 发现意外打包的大型依赖
- 指导代码分割策略
- 持续监控防止 bundle 膨胀
