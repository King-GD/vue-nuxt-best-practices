---
id: nuxt-06
title: Use useState for Cross-Component State Sharing
priority: high
category: nuxt-specific
tags: [nuxt, useState, ssr]
---

# Use useState for Cross-Component State Sharing

## Problem
Simple state sharing doesn't need the complexity of Pinia.

## Bad Example
```ts
// Bad: Module-level variables are shared across requests in SSR
let globalCount = 0

export function useCounter() {
  return {
    count: globalCount,
    increment: () => globalCount++
  }
}
```

## Good Example
```ts
// composables/useCounter.ts
export function useCounter() {
  // useState: SSR-safe state
  const count = useState('counter', () => 0)

  function increment() {
    count.value++
  }

  return { count, increment }
}

// Use in any component
const { count, increment } = useCounter()
// Same key shares the same state
```

## Common Use Cases
```ts
// User state
const user = useState<User | null>('user', () => null)

// Theme
const theme = useState<'light' | 'dark'>('theme', () => 'light')

// Global config
const config = useState('config', () => ({
  sidebar: true,
  notifications: true
}))
```

## useState vs Pinia
| Scenario | Recommended |
|----------|-------------|
| Simple shared state | useState |
| Complex business logic | Pinia |
| Need devtools | Pinia |
| Need persistence | Pinia |
| Quick prototyping | useState |

## Initialize Server-Side State
```ts
// plugins/init-state.server.ts
export default defineNuxtPlugin(async () => {
  const user = useState('user')

  // Server-side initialization
  const { data } = await useFetch('/api/user')
  user.value = data.value
})
```

## Why
- useState is SSR-safe
- Each request has isolated state
- Automatically serialized and passed to client
- Lighter than Pinia
