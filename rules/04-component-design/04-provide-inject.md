---
id: component-04
title: Use provide/inject for Dependency Injection
priority: medium
category: component-design
tags: [component, provide, inject, dependency-injection]
---

# Use provide/inject for Dependency Injection

## Problem
Passing data between deeply nested components via props drilling leads to code redundancy and maintenance difficulties.

## Bad Example
```vue
<!-- Bad: Props drilling -->
<!-- App.vue -->
<template>
  <Layout :theme="theme" :user="user" :config="config">
    <Sidebar :theme="theme" :user="user">
      <UserPanel :theme="theme" :user="user" />
    </Sidebar>
  </Layout>
</template>

<!-- Intermediate components must pass through props they don't use -->
```

## Good Example
```vue
<!-- App.vue -->
<script setup lang="ts">
import { provide } from 'vue'
import type { InjectionKey } from 'vue'

// Define injection keys (type-safe)
export const ThemeKey: InjectionKey<Ref<'light' | 'dark'>> = Symbol('theme')
export const UserKey: InjectionKey<Ref<User | null>> = Symbol('user')

const theme = ref<'light' | 'dark'>('light')
const user = ref<User | null>(null)

provide(ThemeKey, theme)
provide(UserKey, user)
</script>

<!-- UserPanel.vue (deeply nested child component) -->
<script setup lang="ts">
import { inject } from 'vue'
import { ThemeKey, UserKey } from '~/App.vue'

// Type-safe injection
const theme = inject(ThemeKey)!
const user = inject(UserKey)!

// With default value
const config = inject('config', { debug: false })
</script>
```

## Encapsulate as Composable
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

## Readonly Injection (Prevent Child Modification)
```vue
<script setup lang="ts">
import { provide, readonly } from 'vue'

const state = reactive({ count: 0 })

// Provide readonly version
provide('state', readonly(state))

// Provide modification method
provide('increment', () => state.count++)
</script>
```

## Why
- Avoids props drilling, cleaner code
- Decouples direct dependencies between components
- Suitable for global data like theme, user state, configuration
- InjectionKey ensures type safety
