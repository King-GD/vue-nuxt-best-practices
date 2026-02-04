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

### [CRITICAL] 避免 Hydration Mismatch

服务端和客户端渲染结果不一致会导致 hydration 警告和潜在 bug。

**错误示例：**
```vue
<template>
  <div>{{ Date.now() }}</div>
  <div>{{ Math.random() }}</div>
</template>
```

**正确示例：**
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

### [CRITICAL] 正确使用 ClientOnly 组件

某些组件只能在客户端运行（如 ECharts、地图组件）。

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

### [CRITICAL] 使用 onMounted 处理浏览器 API

在 `<script setup>` 顶层直接访问浏览器 API 会导致 SSR 错误。

**错误：**
```ts
const width = window.innerWidth // SSR 报错
```

**正确：**
```ts
const width = ref(0)
onMounted(() => {
  width.value = window.innerWidth
})
```

---

### [HIGH] 使用 import.meta.client 条件判断

```ts
if (import.meta.client) {
  // 仅客户端执行
  initAnalytics()
}

if (import.meta.server) {
  // 仅服务端执行
}
```

---

## Data Fetching

### [CRITICAL] 使用 useFetch 而非 $fetch

`$fetch` 会导致数据重复获取。

**错误：**
```ts
const data = await $fetch('/api/users')
```

**正确：**
```ts
const { data, pending, error, refresh } = await useFetch('/api/users')
```

---

### [CRITICAL] 并行化多个数据请求

**错误（串行）：**
```ts
const { data: user } = await useFetch('/api/user')
const { data: posts } = await useFetch('/api/posts')
```

**正确（并行）：**
```ts
const [{ data: user }, { data: posts }] = await Promise.all([
  useFetch('/api/user'),
  useFetch('/api/posts')
])
```

---

### [HIGH] 使用 lazy 延迟非关键数据

```ts
// 关键数据：阻塞渲染
const { data: mainContent } = await useFetch('/api/content')

// 非关键数据：lazy 模式
const { data: recommendations } = useLazyFetch('/api/recommend')
```

---

## Reactivity

### [HIGH] 使用 shallowRef 处理大对象

```ts
// 大数组使用 shallowRef
const tableData = shallowRef<User[]>([])

// 更新时替换整个数组
tableData.value = newData
```

---

### [CRITICAL] 避免解构 reactive 对象

**错误：**
```ts
const { count } = reactive({ count: 0 })
count++ // 不会触发更新
```

**正确：**
```ts
const { count } = toRefs(reactive({ count: 0 }))
count.value++ // 正确
```

---

### [HIGH] 正确使用 computed 缓存计算

```ts
// 使用 computed 而非模板表达式
const activeItems = computed(() =>
  items.value.filter(i => i.active)
)
```

---

## Component Design

### [HIGH] 使用 defineAsyncComponent 懒加载

```ts
const HeavyChart = defineAsyncComponent(() => import('./HeavyChart.vue'))

// Nuxt 自动懒加载
<LazyHeavyChart v-if="showChart" />
```

---

### [HIGH] 正确使用 v-if vs v-show

| 场景 | 推荐 |
|------|------|
| 频繁切换 | `v-show` |
| 条件很少变化 | `v-if` |
| 初始为 false | `v-if` |

---

### [HIGH] Props 使用 TypeScript 类型定义

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

### [HIGH] 使用 v-memo 缓存列表项

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

### [CRITICAL] 大列表使用虚拟滚动

```ts
import { useVirtualList } from '@vueuse/core'

const { list: virtualList } = useVirtualList(items, {
  itemHeight: 40
})
```

---

### [HIGH] 防抖和节流事件处理

```ts
import { useDebounceFn } from '@vueuse/core'

const debouncedSearch = useDebounceFn(async () => {
  results.value = await $fetch(`/api/search?q=${query.value}`)
}, 300)
```

---

## State Management (Pinia)

### [HIGH] 使用 storeToRefs 解构 state

```ts
import { storeToRefs } from 'pinia'

const store = useUserStore()
const { user, isLoggedIn } = storeToRefs(store)
const { login, logout } = store // actions 直接解构
```

---

### [MEDIUM] 使用 $patch 批量更新

```ts
store.$patch({
  user: { ...store.user, name: 'New Name' },
  updatedAt: new Date()
})
```

---

## Bundle Optimization

### [HIGH] Tree-shaking 友好的导入

**错误：**
```ts
import _ from 'lodash'
```

**正确：**
```ts
import { debounce } from 'lodash-es'
```

---

### [HIGH] 避免全量导入组件库

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@element-plus/nuxt']
  // 自动按需导入
})
```

---

## Nuxt Specific

### [HIGH] 使用 routeRules 配置缓存

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

### [HIGH] 使用 useState 跨组件共享状态

```ts
// SSR 安全的状态共享
const user = useState<User | null>('user', () => null)
```

---

### [HIGH] 使用 definePageMeta 设置页面元数据

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
