---
id: state-05
title: Getter 缓存与依赖追踪
priority: medium
category: state-management
tags: [pinia, getter, computed]
---

# Getter 缓存与依赖追踪

## 问题
不当使用 getter 会导致性能问题或计算结果不正确。

## 错误示例
```ts
// Options API Store
export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    filters: { category: '', minPrice: 0 }
  }),
  getters: {
    // 错误：getter 接收参数，无法缓存
    getProductById: (state) => (id: number) => {
      return state.products.find(p => p.id === id)
    },

    // 错误：在 getter 中修改 state
    sortedProducts(state) {
      state.products.sort((a, b) => a.name.localeCompare(b.name)) // 副作用！
      return state.products
    }
  }
})
```

## 正确示例
```ts
// Setup Store（推荐）
export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const filters = ref({ category: '', minPrice: 0 })

  // 正确：使用 computed 自动缓存
  const filteredProducts = computed(() =>
    products.value.filter(p =>
      (!filters.value.category || p.category === filters.value.category) &&
      p.price >= filters.value.minPrice
    )
  )

  const sortedProducts = computed(() =>
    [...filteredProducts.value].sort((a, b) => a.name.localeCompare(b.name))
  )

  // 需要参数的查询用 Map 缓存
  const productById = computed(() => {
    const map = new Map<number, Product>()
    products.value.forEach(p => map.set(p.id, p))
    return map
  })

  function getProductById(id: number) {
    return productById.value.get(id)
  }

  return {
    products,
    filters,
    filteredProducts,
    sortedProducts,
    getProductById
  }
})
```

## 复杂计算使用 useMemoize
```ts
import { useMemoize } from '@vueuse/core'

export const useSearchStore = defineStore('search', () => {
  const items = ref<Item[]>([])

  // 带缓存的搜索函数
  const searchItems = useMemoize((query: string) =>
    items.value.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    )
  )

  return { items, searchItems }
})
```

## 原因
- computed/getter 基于依赖自动缓存
- 返回函数的 getter 每次调用都执行
- 不要在 getter 中产生副作用
- 复杂查询考虑使用 Map 或 memoize
