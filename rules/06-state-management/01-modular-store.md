---
id: state-01
title: Pinia Store 模块化设计
priority: high
category: state-management
tags: [pinia, store, modular]
---

# Pinia Store 模块化设计

## 问题
单一巨大的 store 难以维护，且影响代码分割。

## 错误示例
```ts
// stores/index.ts
// 错误：所有状态放在一个 store
export const useMainStore = defineStore('main', {
  state: () => ({
    user: null,
    products: [],
    cart: [],
    orders: [],
    settings: {},
    notifications: [],
    // ... 更多状态
  }),
  actions: {
    // 数百行 actions...
  }
})
```

## 正确示例
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

## Store 组合
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

## 原因
- 模块化 store 更易维护和测试
- 支持代码分割，按需加载
- 关注点分离，职责清晰
- 便于团队协作
