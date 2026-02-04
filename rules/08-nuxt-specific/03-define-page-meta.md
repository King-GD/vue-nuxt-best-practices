---
id: nuxt-03
title: 使用 definePageMeta 设置页面元数据
priority: high
category: nuxt-specific
tags: [nuxt, page-meta, middleware]
---

# 使用 definePageMeta 设置页面元数据

## 问题
页面级配置（布局、中间件、过渡）分散难以管理。

## 正确用法
```vue
<!-- pages/dashboard.vue -->
<script setup lang="ts">
definePageMeta({
  // 布局
  layout: 'admin',

  // 中间件
  middleware: ['auth', 'admin'],

  // 页面过渡
  pageTransition: {
    name: 'slide',
    mode: 'out-in'
  },

  // 布局过渡
  layoutTransition: {
    name: 'fade'
  },

  // 保持组件状态
  keepalive: true,

  // 自定义元数据
  title: '控制台',
  requiredPermissions: ['admin:read']
})
</script>
```

## 动态元数据
```vue
<script setup lang="ts">
const route = useRoute()

definePageMeta({
  // 根据路由参数选择布局
  layout: 'default',

  // 中间件可以是函数
  middleware: [
    function (to, from) {
      // 自定义逻辑
      if (!isAuthenticated()) {
        return navigateTo('/login')
      }
    }
  ],

  // 验证路由参数
  validate: async (route) => {
    return /^\d+$/.test(route.params.id as string)
  }
})
</script>
```

## 读取页面元数据
```vue
<script setup lang="ts">
const route = useRoute()

// 访问当前页面的元数据
const pageTitle = route.meta.title
const permissions = route.meta.requiredPermissions
</script>
```

## 原因
- 集中管理页面配置
- 编译时优化（不是运行时）
- 类型安全
- 支持代码分割
