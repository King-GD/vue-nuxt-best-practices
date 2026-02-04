---
id: bundle-02
title: Tree-shaking 友好的导入方式
priority: high
category: bundle-optimization
tags: [bundle, tree-shaking, import]
---

# Tree-shaking 友好的导入方式

## 问题
错误的导入方式会导致整个库被打包。

## 错误示例
```ts
// 错误：导入整个 lodash（~70KB）
import _ from 'lodash'
const result = _.debounce(fn, 300)

// 错误：命名空间导入
import * as utils from './utils'
console.log(utils.formatDate(date))

// 错误：从 barrel 文件导入
import { Button } from '@/components'  // 如果 index.ts 导出所有组件
```

## 正确示例
```ts
// 正确：使用 lodash-es 并具名导入
import { debounce } from 'lodash-es'
const result = debounce(fn, 300)

// 正确：直接导入需要的函数
import debounce from 'lodash-es/debounce'

// 正确：具名导入
import { formatDate } from './utils/date'

// 正确：直接从组件文件导入
import Button from '@/components/Button.vue'
```

## 组件库按需导入
```ts
// nuxt.config.ts - Element Plus 自动按需导入
export default defineNuxtConfig({
  modules: ['@element-plus/nuxt'],
  elementPlus: {
    // 按需导入
  }
})

// 使用时直接用，无需手动导入
// <el-button>按钮</el-button>
```

## 检查 tree-shaking 效果
```ts
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 分析大型依赖
        }
      }
    }
  }
}
```

## 原因
- ESM 具名导入支持静态分析
- 构建工具可以移除未使用的导出
- lodash-es 比 lodash 更适合现代打包
- 避免 barrel 文件导致的意外打包
