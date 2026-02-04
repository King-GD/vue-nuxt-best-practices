---
id: state-06
title: 服务端状态初始化
priority: high
category: state-management
tags: [pinia, ssr, nuxt, hydration]
---

# 服务端状态初始化

## 问题
SSR 时 store 状态需要正确序列化传递给客户端，否则会导致 hydration mismatch。

## 错误示例
```ts
// stores/user.ts
export const useUserStore = defineStore('user', () => {
  // 错误：在 store 定义中发起请求
  const user = ref(null)

  // 这会在每次导入 store 时执行
  $fetch('/api/user').then(data => {
    user.value = data
  })

  return { user }
})
```

## 正确示例
```ts
// stores/user.ts
export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)

  async function fetchUser() {
    user.value = await $fetch('/api/user')
  }

  return { user, fetchUser }
})

// plugins/init-store.server.ts
export default defineNuxtPlugin(async () => {
  const userStore = useUserStore()
  await userStore.fetchUser()
})

// 或在页面/布局中初始化
// layouts/default.vue
<script setup lang="ts">
const userStore = useUserStore()
await userStore.fetchUser()
</script>
```

## 使用 useState 替代简单状态
```vue
<script setup lang="ts">
// useState 是 Nuxt 内置的 SSR 友好状态
const user = useState<User | null>('user', () => null)

// 自动处理 SSR hydration
const { data } = await useFetch('/api/user')
user.value = data.value
</script>
```

## Pinia + Nuxt 集成
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@pinia/nuxt']
})

// Pinia 状态会自动通过 payload 传递给客户端
// 无需手动处理序列化
```

## 使用 useNuxtApp 访问上下文
```ts
// stores/auth.ts
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  async function init() {
    const { ssrContext } = useNuxtApp()

    if (import.meta.server && ssrContext) {
      // 服务端：从请求中获取 cookie
      const cookie = ssrContext.event.headers.get('cookie')
      // ...
    }
  }

  return { user, init }
})
```

## 原因
- Pinia + @pinia/nuxt 自动处理 SSR 状态传递
- 避免在 store 定义中发起副作用
- 使用 plugins 或页面组件初始化状态
- useState 适合简单的跨组件状态共享
