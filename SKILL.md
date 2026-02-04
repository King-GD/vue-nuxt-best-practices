---
name: vue-nuxt-best-practices
description: 57 performance optimization rules for Vue3 and Nuxt4 applications. Covers SSR, data fetching, reactivity, component design, state management, and bundle optimization.
globs:
  - "**/*.vue"
  - "**/*.ts"
  - "**/*.js"
  - "**/nuxt.config.*"
  - "**/app.vue"
---

# Vue3 & Nuxt4 Best Practices

You are an expert Vue3 and Nuxt4 developer. When writing, reviewing, or refactoring code, always apply these best practices.

## Priority Levels

- **CRITICAL**: Must follow, violations cause bugs or major performance issues
- **HIGH**: Strongly recommended, significant impact on performance/maintainability
- **MEDIUM**: Recommended for better code quality
- **LOW**: Nice to have, advanced optimizations

---

## 1. SSR & Hydration (Critical)

### Avoid Hydration Mismatch

Server and client renders must produce identical HTML.

```vue
<!-- ❌ BAD: Different values on server vs client -->
<template>
  <div>{{ Date.now() }}</div>
  <div>{{ Math.random() }}</div>
  <div>{{ window.innerWidth }}</div>
</template>

<!-- ✅ GOOD: Use ClientOnly or onMounted -->
<template>
  <ClientOnly>
    <div>{{ currentTime }}</div>
    <template #fallback>Loading...</template>
  </ClientOnly>
</template>

<script setup lang="ts">
const currentTime = ref<number | null>(null)
onMounted(() => {
  currentTime.value = Date.now()
})
</script>
```

### Use import.meta.client for Environment Checks

```ts
// ✅ GOOD: Nuxt 3/4 recommended way
if (import.meta.client) {
  // Client-only code
  initAnalytics()
}

if (import.meta.server) {
  // Server-only code
}

// ❌ BAD: Deprecated
if (process.client) { }
```

### Use onMounted for Browser APIs

```ts
// ❌ BAD: Crashes on server
const width = window.innerWidth

// ✅ GOOD: Safe for SSR
const width = ref(0)
onMounted(() => {
  width.value = window.innerWidth
})

// ✅ BETTER: Use VueUse
import { useWindowSize } from '@vueuse/core'
const { width } = useWindowSize()
```

---

## 2. Data Fetching (Critical)

### Use useFetch Instead of $fetch

```ts
// ❌ BAD: Fetches twice (server + client)
const data = await $fetch('/api/users')

// ✅ GOOD: SSR-aware, deduped, cached
const { data, pending, error, refresh } = await useFetch('/api/users')
```

### Parallelize Independent Requests

```ts
// ❌ BAD: Sequential (slow)
const { data: user } = await useFetch('/api/user')
const { data: posts } = await useFetch('/api/posts')
const { data: comments } = await useFetch('/api/comments')

// ✅ GOOD: Parallel (fast)
const [{ data: user }, { data: posts }, { data: comments }] = await Promise.all([
  useFetch('/api/user'),
  useFetch('/api/posts'),
  useFetch('/api/comments')
])
```

### Use Lazy for Non-Critical Data

```ts
// Critical data: blocks SSR
const { data: mainContent } = await useFetch('/api/content')

// Non-critical: loads after hydration
const { data: recommendations, pending } = useLazyFetch('/api/recommend')
const { data: comments } = useFetch('/api/comments', { lazy: true })
```

### Set Unique Keys to Avoid Duplicate Requests

```ts
const { data } = await useFetch(`/api/article/${id}`, {
  key: `article-${id}`
})
```

---

## 3. Reactivity (High)

### Use shallowRef for Large Objects

```ts
// ❌ BAD: Deep reactivity overhead for 10000 items
const tableData = ref<User[]>([])

// ✅ GOOD: Only .value is reactive
const tableData = shallowRef<User[]>([])

// Update by replacing entire array
tableData.value = newData

// Or mutate + trigger manually
tableData.value[0].name = 'New'
triggerRef(tableData)
```

### Never Destructure reactive() Objects

```ts
const state = reactive({ count: 0, name: 'Vue' })

// ❌ BAD: Loses reactivity
const { count } = state
count++ // Won't trigger updates!

// ✅ GOOD: Use toRefs
const { count } = toRefs(state)
count.value++ // Works!

// ✅ BETTER: Use ref instead of reactive
const count = ref(0)
```

### Use computed for Derived Values

```vue
<!-- ❌ BAD: Recalculates every render -->
<div>{{ items.filter(i => i.active).length }}</div>

<!-- ✅ GOOD: Cached -->
<script setup>
const activeCount = computed(() => items.value.filter(i => i.active).length)
</script>
<div>{{ activeCount }}</div>
```

---

## 4. Component Design (High)

### Lazy Load Heavy Components

```ts
// ❌ BAD: Loaded immediately
import HeavyChart from './HeavyChart.vue'

// ✅ GOOD: Loaded on demand
const HeavyChart = defineAsyncComponent(() => import('./HeavyChart.vue'))

// ✅ NUXT: Auto lazy with Lazy prefix
<template>
  <LazyHeavyChart v-if="showChart" />
</template>
```

### v-if vs v-show

| Scenario | Use |
|----------|-----|
| Frequent toggle (hover, tabs) | `v-show` |
| Rarely changes | `v-if` |
| Initially false | `v-if` |
| Heavy component | `v-if` |

### Type Props with TypeScript

```ts
interface Props {
  user: User
  items: string[]
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  size: 'md',
  items: () => []
})
```

---

## 5. Performance (Medium)

### Use v-memo for List Optimization

```vue
<div
  v-for="item in items"
  :key="item.id"
  v-memo="[item.id, item === selected]"
>
  <ExpensiveComponent :item="item" />
</div>
```

### Use Virtual Scrolling for Large Lists

```ts
// For 1000+ items, use virtual scrolling
import { useVirtualList } from '@vueuse/core'

const { list, containerProps, wrapperProps } = useVirtualList(items, {
  itemHeight: 40
})
```

### Debounce/Throttle High-Frequency Events

```ts
import { useDebounceFn, useThrottleFn } from '@vueuse/core'

// Search input: debounce
const debouncedSearch = useDebounceFn(search, 300)

// Scroll handler: throttle
const throttledScroll = useThrottleFn(handleScroll, 100)
```

### Use KeepAlive for Cached Components

```vue
<KeepAlive :include="['TabA', 'TabB']" :max="5">
  <component :is="currentTab" />
</KeepAlive>
```

---

## 6. State Management - Pinia (Medium)

### Use storeToRefs for Destructuring

```ts
import { storeToRefs } from 'pinia'

const store = useUserStore()

// ❌ BAD: Loses reactivity
const { user, isLoggedIn } = store

// ✅ GOOD: Keeps reactivity
const { user, isLoggedIn } = storeToRefs(store)

// Actions can be destructured directly
const { login, logout } = store
```

### Use $patch for Batch Updates

```ts
// ❌ BAD: Multiple reactive updates
store.user.name = 'New'
store.user.email = 'new@example.com'
store.updatedAt = new Date()

// ✅ GOOD: Single update
store.$patch({
  user: { ...store.user, name: 'New', email: 'new@example.com' },
  updatedAt: new Date()
})
```

---

## 7. Bundle Optimization (Low)

### Tree-Shaking Friendly Imports

```ts
// ❌ BAD: Imports entire lodash (~70KB)
import _ from 'lodash'

// ✅ GOOD: Only imports debounce (~2KB)
import { debounce } from 'lodash-es'
```

### Use Auto-Import for Component Libraries

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@element-plus/nuxt'],
  // Auto-imports only used components
})
```

### Analyze Bundle Size

```bash
npx nuxi analyze
```

---

## 8. Nuxt Specific (Low)

### Configure Route Rules for Caching

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },
    '/blog/**': { isr: 3600 },        // Regenerate hourly
    '/api/products': { swr: 60 },     // Stale-while-revalidate
    '/admin/**': { ssr: false }       // Client-only
  }
})
```

### Use useState for Simple Shared State

```ts
// SSR-safe shared state (simpler than Pinia)
const user = useState<User | null>('user', () => null)
const theme = useState('theme', () => 'light')
```

### Use definePageMeta for Page Configuration

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  keepalive: true
})
</script>
```

---

## Quick Reference

| Issue | Solution |
|-------|----------|
| Hydration mismatch | Use `<ClientOnly>` or `onMounted` |
| Double fetching | Use `useFetch` not `$fetch` |
| Slow sequential requests | Use `Promise.all()` |
| Large list performance | Use virtual scrolling |
| Reactivity lost | Don't destructure `reactive()`, use `toRefs()` |
| Store reactivity lost | Use `storeToRefs()` |
| Large bundle | Use dynamic `import()` and tree-shaking |
