---
id: state-03
title: Use $patch for Batch State Updates
priority: medium
category: state-management
tags: [pinia, patch, performance]
---

# Use $patch for Batch State Updates

## Problem
Multiple individual state modifications trigger multiple reactive updates.

## Bad Example
```ts
// stores/user.ts
function updateProfile(data: ProfileData) {
  // Bad: Each line triggers an update
  this.user.name = data.name
  this.user.email = data.email
  this.user.avatar = data.avatar
  this.user.bio = data.bio
  this.user.updatedAt = new Date()
}
```

## Good Example
```ts
// stores/user.ts
function updateProfile(data: ProfileData) {
  // Correct: Use $patch for batch update, triggers only once
  this.$patch({
    user: {
      ...this.user,
      ...data,
      updatedAt: new Date()
    }
  })
}

// Or use function form (suitable for complex updates)
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

## Array Operations
```ts
// Object form replaces entire array
store.$patch({
  items: [...store.items, newItem]
})

// Function form can modify in place
store.$patch((state) => {
  state.items.push(newItem)
  state.items.sort((a, b) => a.order - b.order)
})
```

## $reset to Reset State
```ts
// Options Store supports $reset
const store = useUserStore()
store.$reset() // Reset to initial state

// Setup Store needs manual implementation
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

## Why
- $patch merges multiple modifications into one update
- Reduces unnecessary re-renders
- Function form supports complex update logic
- Improves performance when updating many state properties
