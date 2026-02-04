---
id: bundle-05
title: 避免全量导入组件库
priority: high
category: bundle-optimization
tags: [bundle, component-library, element-plus]
---

# 避免全量导入组件库

## 问题
全量导入 UI 组件库会大幅增加 bundle 体积。

## 错误示例
```ts
// plugins/element-plus.ts
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  // 错误：全量导入，打包所有组件（~1MB）
  nuxtApp.vueApp.use(ElementPlus)
})
```

## 正确示例
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@element-plus/nuxt'],
  elementPlus: {
    // 自动按需导入
    importStyle: 'scss',
    themes: ['dark']
  }
})

// 直接在模板中使用，无需手动导入
// <el-button>按钮</el-button>
// <el-input v-model="value" />
```

## 手动按需导入
```ts
// 如果不使用 @element-plus/nuxt
import { ElButton, ElInput, ElMessage } from 'element-plus'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/input/style/css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('ElButton', ElButton)
  nuxtApp.vueApp.component('ElInput', ElInput)
})
```

## 图标按需导入
```vue
<script setup lang="ts">
// 错误：导入所有图标
import * as Icons from '@element-plus/icons-vue'

// 正确：只导入需要的
import { Search, Plus, Delete } from '@element-plus/icons-vue'
</script>
```

## 原因
- Element Plus 全量约 1MB，按需可能只需 100KB
- @element-plus/nuxt 自动处理按需导入
- 图标库同样需要按需导入
- 大幅减少首屏加载时间
