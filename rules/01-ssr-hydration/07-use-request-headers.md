---
id: ssr-07
title: 使用 useRequestHeaders 获取请求信息
priority: medium
category: ssr-hydration
tags: [ssr, headers, cookies]
---

# 使用 useRequestHeaders 获取请求信息

## 问题
在 SSR 阶段需要访问请求头（如 cookies、user-agent）时，不能直接使用浏览器 API。

## 错误示例
```vue
<script setup lang="ts">
// 错误：服务端没有 document.cookie
const token = document.cookie.split('token=')[1]

// 错误：服务端没有 navigator
const isMobile = navigator.userAgent.includes('Mobile')
</script>
```

## 正确示例
```vue
<script setup lang="ts">
// 使用 Nuxt 提供的 composable
const headers = useRequestHeaders(['cookie', 'user-agent'])

// 获取 cookie
const cookies = headers.cookie || ''
const token = useCookie('token')

// 获取 User-Agent
const userAgent = headers['user-agent'] || ''
const isMobile = computed(() => /Mobile/i.test(userAgent))

// 客户端补充
onMounted(() => {
  // 客户端可以获取更多信息
  if (!userAgent) {
    // 使用浏览器 API
  }
})
</script>
```

## 使用 useCookie
```vue
<script setup lang="ts">
// Nuxt 内置，SSR 友好的 cookie 操作
const token = useCookie('auth-token')
const theme = useCookie('theme', { default: () => 'light' })

// 设置 cookie
token.value = 'new-token'

// 配置选项
const session = useCookie('session', {
  maxAge: 60 * 60 * 24 * 7, // 7 天
  secure: true,
  httpOnly: false
})
</script>
```

## 获取请求 URL
```vue
<script setup lang="ts">
// 获取当前请求的 URL 信息
const requestURL = useRequestURL()
console.log(requestURL.pathname)
console.log(requestURL.searchParams.get('id'))
</script>
```

## 原因
- `useRequestHeaders` 在服务端返回真实请求头，客户端返回空对象
- `useCookie` 统一处理服务端和客户端的 cookie 操作
- 避免 hydration mismatch
