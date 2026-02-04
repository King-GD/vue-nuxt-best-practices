---
id: state-05
title: Getter Caching and Dependency Tracking
priority: medium
category: state-management
tags: [pinia, getter, computed]
---

# Getter Caching and Dependency Tracking

## Problem
Improper use of getters causes performance issues or incorrect computation results.

## Bad Example
```ts
// Options API Store
export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    filters: { category: '', minPrice: 0 }
  }),
  getters: {
    // Bad: Getter receives parameters, cannot be cached
    getProductById: (state) => (id: number) => {
      return state.products.find(p => p.id === id)
    },

    // Bad: Modifying state in getter
    sortedProducts(state) {
      state.products.sort((a, b) => a.name.localeCompare(b.name)) // Side effect!
      return state.products
    }
  }
})
```

## Good Example
```ts
// Setup Store (recommended)
export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const filters = ref({ category: '', minPrice: 0 })

  // Correct: Use computed for automatic caching
  const filteredProducts = computed(() =>
    products.value.filter(p =>
      (!filters.value.category || p.category === filters.value.category) &&
      p.price >= filters.value.minPrice
    )
  )

  const sortedProducts = computed(() =>
    [...filteredProducts.value].sort((a, b) => a.name.localeCompare(b.name))
  )

  // Cache queries that need parameters using Map
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

## Use useMemoize for Complex Calculations
```ts
import { useMemoize } from '@vueuse/core'

export const useSearchStore = defineStore('search', () => {
  const items = ref<Item[]>([])

  // Cached search function
  const searchItems = useMemoize((query: string) =>
    items.value.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    )
  )

  return { items, searchItems }
})
```

## Why
- computed/getter automatically caches based on dependencies
- Getters that return functions execute on every call
- Don't create side effects in getters
- Consider using Map or memoize for complex queries
