---
id: component-04
title: 使用 provide/inject 依赖注入
priority: medium
category: component-design
tags: [component, provide, inject, dependency-injection]
---

# 使用 provide/inject 依赖注入

## 问题
深层组件间的数据传递通过 props drilling 会导致代码冗余和维护困难。

## 错误示例
```vue
<!-- 错误：Props drilling -->
<!-- App.vue -->
<template>
  <Layout :theme="theme" :user="user" :config="config">
    <Sidebar :theme="theme" :user="user">
      <UserPanel :theme="theme" :user="user" />
    </Sidebar>
  </Layout>
</template>

<!-- 中间组件必须透传不使用的 props -->
```

## 正确示例
```vue
<!-- App.vue -->
<script setup lang="ts">
import { provide } from 'vue'
import type { InjectionKey } from 'vue'

// 定义注入 key（类型安全）
export const ThemeKey: InjectionKey<Ref<'light' | 'dark'>> = Symbol('theme')
export const UserKey: InjectionKey<Ref<User | null>> = Symbol('user')

const theme = ref<'light' | 'dark'>('light')
const user = ref<User | null>(null)

provide(ThemeKey, theme)
provide(UserKey, user)
</script>

<!-- UserPanel.vue（深层子组件） -->
<script setup lang="ts">
import { inject } from 'vue'
import { ThemeKey, UserKey } from '~/App.vue'

// 类型安全的注入
const theme = inject(ThemeKey)!
const user = inject(UserKey)!

// 带默认值
const config = inject('config', { debug: false })
</script>
```

## 封装为 Composable
```ts
// composables/useTheme.ts
const ThemeKey: InjectionKey<{
  theme: Ref<'light' | 'dark'>
  toggle: () => void
}> = Symbol('theme')

export function provideTheme() {
  const theme = ref<'light' | 'dark'>('light')

  function toggle() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  provide(ThemeKey, { theme, toggle })

  return { theme, toggle }
}

export function useTheme() {
  const context = inject(ThemeKey)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
```

## 只读注入（防止子组件修改）
```vue
<script setup lang="ts">
import { provide, readonly } from 'vue'

const state = reactive({ count: 0 })

// 提供只读版本
provide('state', readonly(state))

// 提供修改方法
provide('increment', () => state.count++)
</script>
```

## 原因
- 避免 props drilling，代码更简洁
- 解耦组件间的直接依赖
- 适合主题、用户状态、配置等全局数据
- 使用 InjectionKey 保证类型安全
