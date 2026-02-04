---
id: state-03
title: 使用 $patch 批量更新状态
priority: medium
category: state-management
tags: [pinia, patch, performance]
---

# 使用 $patch 批量更新状态

## 问题
多次单独修改 state 会触发多次响应式更新。

## 错误示例
```ts
// stores/user.ts
function updateProfile(data: ProfileData) {
  // 错误：每行都触发一次更新
  this.user.name = data.name
  this.user.email = data.email
  this.user.avatar = data.avatar
  this.user.bio = data.bio
  this.user.updatedAt = new Date()
}
```

## 正确示例
```ts
// stores/user.ts
function updateProfile(data: ProfileData) {
  // 正确：使用 $patch 批量更新，只触发一次
  this.$patch({
    user: {
      ...this.user,
      ...data,
      updatedAt: new Date()
    }
  })
}

// 或使用函数形式（适合复杂更新）
function updateProfile(data: ProfileData) {
  this.$patch((state) => {
    state.user.name = data.name
    state.user.email = data.email
    state.user.avatar = data.avatar
    state.user.bio = data.bio
    state.user.updatedAt = new Date()
  })
}
```

## 数组操作
```ts
// 对象形式会替换整个数组
store.$patch({
  items: [...store.items, newItem]
})

// 函数形式可以原地修改
store.$patch((state) => {
  state.items.push(newItem)
  state.items.sort((a, b) => a.order - b.order)
})
```

## $reset 重置状态
```ts
// Options Store 支持 $reset
const store = useUserStore()
store.$reset() // 重置到初始状态

// Setup Store 需要手动实现
export const useUserStore = defineStore('user', () => {
  const initialState = {
    user: null,
    preferences: {}
  }

  const user = ref(initialState.user)
  const preferences = ref(initialState.preferences)

  function $reset() {
    user.value = initialState.user
    preferences.value = { ...initialState.preferences }
  }

  return { user, preferences, $reset }
})
```

## 原因
- $patch 将多次修改合并为一次更新
- 减少不必要的重新渲染
- 函数形式支持复杂的更新逻辑
- 提升大量状态更新时的性能
