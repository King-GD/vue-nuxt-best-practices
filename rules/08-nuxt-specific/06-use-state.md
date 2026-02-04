---
id: nuxt-06
title: 使用 useState 跨组件共享状态
priority: high
category: nuxt-specific
tags: [nuxt, useState, ssr]
---

# 使用 useState 跨组件共享状态

## 问题
简单状态共享不需要引入 Pinia 的复杂度。

## 错误示例
```ts
// 错误：模块级变量在 SSR 中会跨请求共享
let globalCount = 0

export function useCounter() {
  return {
    count: globalCount,
    increment: () => globalCount++
  }
}
```

## 正确示例
```ts
// composables/useCounter.ts
export function useCounter() {
  // useState：SSR 安全的状态
  const count = useState('counter', () => 0)

  function increment() {
    count.value++
  }

  return { count, increment }
}

// 在任何组件中使用
const { count, increment } = useCounter()
// 相同 key 共享同一个状态
```

## 常见使用场景
```ts
// 用户状态
const user = useState<User | null>('user', () => null)

// 主题
const theme = useState<'light' | 'dark'>('theme', () => 'light')

// 全局配置
const config = useState('config', () => ({
  sidebar: true,
  notifications: true
}))
```

## useState vs Pinia
| 场景 | 推荐 |
|------|------|
| 简单共享状态 | useState |
| 复杂业务逻辑 | Pinia |
| 需要 devtools | Pinia |
| 需要持久化 | Pinia |
| 快速原型 | useState |

## 初始化服务端状态
```ts
// plugins/init-state.server.ts
export default defineNuxtPlugin(async () => {
  const user = useState('user')

  // 服务端初始化
  const { data } = await useFetch('/api/user')
  user.value = data.value
})
```

## 原因
- useState 是 SSR 安全的
- 每个请求有独立的状态
- 自动序列化传递给客户端
- 比 Pinia 更轻量
