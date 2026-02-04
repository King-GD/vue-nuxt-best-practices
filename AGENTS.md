# Vue3 & Nuxt4 Best Practices

> 57 performance optimization rules for Vue3 and Nuxt4 applications.
> Designed for AI coding agents to automatically apply best practices.

## Quick Reference

| Priority | Category | Rules |
|----------|----------|-------|
| Critical | SSR & Hydration | 8 |
| Critical | Data Fetching | 7 |
| High | Reactivity | 8 |
| High | Component Design | 7 |
| Medium | Performance | 8 |
| Medium | State Management | 6 |
| Low | Bundle Optimization | 7 |
| Low | Nuxt Specific | 6 |

---

## SSR & Hydration

### [CRITICAL] Avoid Hydration Mismatch

Inconsistent rendering results between server and client cause hydration warnings and potential bugs.

**Bad Example:**
```vue
<template>
  <div>{{ Date.now() }}</div>
  <div>{{ Math.random() }}</div>
</template>
```

**Good Example:**
```vue
<template>
  <ClientOnly>
    <div>{{ currentTime }}</div>
  </ClientOnly>
</template>

<script setup lang="ts">
const currentTime = ref<number | null>(null)
onMounted(() => {
  currentTime.value = Date.now()
})
</script>
```

---

### [CRITICAL] Use ClientOnly Component Correctly

Some components can only run on the client side (e.g., ECharts, map components).

```vue
<template>
  <ClientOnly>
    <VChart :option="chartOption" />
    <template #fallback>
      <ChartSkeleton />
    </template>
  </ClientOnly>
</template>
```

---

### [CRITICAL] Use onMounted for Browser APIs

Directly accessing browser APIs at the top level of `<script setup>` causes SSR errors.

**Bad:**
```ts
const width = window.innerWidth // SSR error
```

**Good:**
```ts
const width = ref(0)
onMounted(() => {
  width.value = window.innerWidth
})
```

---

### [HIGH] Use import.meta.client for Conditional Logic

```ts
if (import.meta.client) {
  // Client-side only execution
  initAnalytics()
}

if (import.meta.server) {
  // Server-side only execution
}
```

---

## Data Fetching

### [CRITICAL] Use useFetch Instead of $fetch

`$fetch` causes duplicate data fetching.

**Bad:**
```ts
const data = await $fetch('/api/users')
```

**Good:**
```ts
const { data, pending, error, refresh } = await useFetch('/api/users')
```

---

### [CRITICAL] Parallelize Multiple Data Requests

**Bad (Sequential):**
```ts
const { data: user } = await useFetch('/api/user')
const { data: posts } = await useFetch('/api/posts')
```

**Good (Parallel):**
```ts
const [{ data: user }, { data: posts }] = await Promise.all([
  useFetch('/api/user'),
  useFetch('/api/posts')
])
```

---

### [HIGH] Use lazy for Non-Critical Data

```ts
// Critical data: blocks rendering
const { data: mainContent } = await useFetch('/api/content')

// Non-critical data: lazy mode
const { data: recommendations } = useLazyFetch('/api/recommend')
```

---

## Reactivity

### [HIGH] Use shallowRef for Large Objects

```ts
// Use shallowRef for large arrays
const tableData = shallowRef<User[]>([])

// Replace the entire array when updating
tableData.value = newData
```

---

### [CRITICAL] Avoid Destructuring Reactive Objects

**Bad:**
```ts
const { count } = reactive({ count: 0 })
count++ // Won't trigger updates
```

**Good:**
```ts
const { count } = toRefs(reactive({ count: 0 }))
count.value++ // Correct
```

---

### [HIGH] Use computed for Caching Calculations

```ts
// Use computed instead of template expressions
const activeItems = computed(() =>
  items.value.filter(i => i.active)
)
```

---

## Component Design

### [HIGH] Use defineAsyncComponent for Lazy Loading

```ts
const HeavyChart = defineAsyncComponent(() => import('./HeavyChart.vue'))

// Nuxt auto lazy loading
<LazyHeavyChart v-if="showChart" />
```

---

### [HIGH] Use v-if vs v-show Correctly

| Scenario | Recommended |
|----------|-------------|
| Frequent toggling | `v-show` |
| Condition rarely changes | `v-if` |
| Initially false | `v-if` |

---

### [HIGH] Use TypeScript for Props Definition

```ts
interface Props {
  user: User
  items: string[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})
```

---

## Performance

### [HIGH] Use v-memo to Cache List Items

```vue
<div
  v-for="item in items"
  :key="item.id"
  v-memo="[item.id, item === selected]"
>
  <ExpensiveComponent :item="item" />
</div>
```

---

### [CRITICAL] Use Virtual Scrolling for Large Lists

```ts
import { useVirtualList } from '@vueuse/core'

const { list: virtualList } = useVirtualList(items, {
  itemHeight: 40
})
```

---

### [HIGH] Debounce and Throttle Event Handlers

```ts
import { useDebounceFn } from '@vueuse/core'

const debouncedSearch = useDebounceFn(async () => {
  results.value = await $fetch(`/api/search?q=${query.value}`)
}, 300)
```

---

## State Management (Pinia)

### [HIGH] Use storeToRefs for Destructuring State

```ts
import { storeToRefs } from 'pinia'

const store = useUserStore()
const { user, isLoggedIn } = storeToRefs(store)
const { login, logout } = store // Destructure actions directly
```

---

### [MEDIUM] Use $patch for Batch Updates

```ts
store.$patch({
  user: { ...store.user, name: 'New Name' },
  updatedAt: new Date()
})
```

---

## Bundle Optimization

### [HIGH] Tree-Shaking Friendly Imports

**Bad:**
```ts
import _ from 'lodash'
```

**Good:**
```ts
import { debounce } from 'lodash-es'
```

---

### [HIGH] Avoid Full Component Library Imports

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@element-plus/nuxt']
  // Auto on-demand imports
})
```

---

## Nuxt Specific

### [HIGH] Use routeRules for Caching Configuration

```ts
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },
    '/blog/**': { isr: 3600 },
    '/admin/**': { ssr: false }
  }
})
```

---

### [HIGH] Use useState for Cross-Component State Sharing

```ts
// SSR-safe state sharing
const user = useState<User | null>('user', () => null)
```

---

### [HIGH] Use definePageMeta for Page Metadata

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

## Full Rules

For complete rules with detailed examples, see the individual rule files in the `rules/` directory.
