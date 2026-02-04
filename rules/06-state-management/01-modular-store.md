---
id: state-01
title: Modular Pinia Store Design
priority: high
category: state-management
tags: [pinia, store, modular]
---

# Modular Pinia Store Design

## Problem
A single massive store is difficult to maintain and affects code splitting.

## Bad Example
```ts
// stores/index.ts
// Bad: All state in one store
export const useMainStore = defineStore('main', {
  state: () => ({
    user: null,
    products: [],
    cart: [],
    orders: [],
    settings: {},
    notifications: [],
    // ... more state
  }),
  actions: {
    // Hundreds of lines of actions...
  }
})
```

## Good Example
```ts
// stores/user.ts
export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => !!user.value)

  async function login(credentials: Credentials) {
    user.value = await $fetch('/api/login', {
      method: 'POST',
      body: credentials
    })
  }

  function logout() {
    user.value = null
  }

  return { user, isLoggedIn, login, logout }
})

// stores/cart.ts
export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  function addItem(product: Product) {
    // ...
  }

  return { items, total, addItem }
})
```

## Store Composition
```ts
// stores/checkout.ts
export const useCheckoutStore = defineStore('checkout', () => {
  const userStore = useUserStore()
  const cartStore = useCartStore()

  const canCheckout = computed(() =>
    userStore.isLoggedIn && cartStore.items.length > 0
  )

  async function checkout() {
    if (!canCheckout.value) return

    await $fetch('/api/orders', {
      method: 'POST',
      body: {
        userId: userStore.user!.id,
        items: cartStore.items
      }
    })
  }

  return { canCheckout, checkout }
})
```

## Why
- Modular stores are easier to maintain and test
- Supports code splitting, load on demand
- Separation of concerns, clear responsibilities
- Facilitates team collaboration
