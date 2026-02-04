---
id: state-06
title: Server-Side State Initialization
priority: high
category: state-management
tags: [pinia, ssr, nuxt, hydration]
---

# Server-Side State Initialization

## Problem
During SSR, store state needs to be correctly serialized and passed to the client, otherwise it causes hydration mismatch.

## Bad Example
```ts
// stores/user.ts
export const useUserStore = defineStore('user', () => {
  // Bad: Making requests in store definition
  const user = ref(null)

  // This executes every time the store is imported
  $fetch('/api/user').then(data => {
    user.value = data
  })

  return { user }
})
```

## Good Example
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

// Or initialize in page/layout
// layouts/default.vue
<script setup lang="ts">
const userStore = useUserStore()
await userStore.fetchUser()
</script>
```

## Use useState for Simple State
```vue
<script setup lang="ts">
// useState is Nuxt's built-in SSR-friendly state
const user = useState<User | null>('user', () => null)

// Automatically handles SSR hydration
const { data } = await useFetch('/api/user')
user.value = data.value
</script>
```

## Pinia + Nuxt Integration
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@pinia/nuxt']
})

// Pinia state is automatically passed to client via payload
// No need for manual serialization
```

## Using useNuxtApp to Access Context
```ts
// stores/auth.ts
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  async function init() {
    const { ssrContext } = useNuxtApp()

    if (import.meta.server && ssrContext) {
      // Server-side: Get cookie from request
      const cookie = ssrContext.event.headers.get('cookie')
      // ...
    }
  }

  return { user, init }
})
```

## Why
- Pinia + @pinia/nuxt automatically handles SSR state transfer
- Avoid side effects in store definitions
- Use plugins or page components to initialize state
- useState is suitable for simple cross-component state sharing
