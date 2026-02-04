---
id: nuxt-04
title: 中间件性能优化
priority: medium
category: nuxt-specific
tags: [nuxt, middleware, performance]
---

# 中间件性能优化

## 问题
中间件逻辑过重会影响每次路由跳转的性能。

## 错误示例
```ts
// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  // 错误：每次路由跳转都请求 API
  const user = await $fetch('/api/user')

  if (!user) {
    return navigateTo('/login')
  }

  // 错误：在中间件中做复杂计算
  const permissions = calculatePermissions(user)
  // ...
})
```

## 正确示例
```ts
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()

  // 使用缓存的用户状态
  if (!userStore.isLoggedIn) {
    return navigateTo('/login')
  }

  // 检查页面权限
  const requiredPermissions = to.meta.requiredPermissions as string[] | undefined
  if (requiredPermissions && !userStore.hasPermissions(requiredPermissions)) {
    return navigateTo('/403')
  }
})

// middleware/auth.global.ts
// 全局中间件：只在需要时请求
export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore()

  // 只在用户未初始化时请求
  if (!userStore.initialized) {
    await userStore.init()
  }
})
```

## 按需应用中间件
```vue
<script setup lang="ts">
definePageMeta({
  // 只在需要的页面应用
  middleware: ['auth']
})
</script>

<!-- 而不是使用全局中间件 -->
```

## 内联中间件
```vue
<script setup lang="ts">
definePageMeta({
  middleware: [
    // 内联中间件，只对当前页面生效
    function (to, from) {
      const { isAdmin } = useUserStore()
      if (!isAdmin) {
        return navigateTo('/403')
      }
    }
  ]
})
</script>
```

## 原因
- 中间件在每次路由跳转时执行
- 避免不必要的 API 请求
- 使用缓存的状态而非每次重新获取
- 按需应用减少不必要的检查
