---
id: reactivity-06
title: Use toRef and toRefs to Maintain Reactivity
priority: high
category: reactivity
tags: [reactivity, toRef, toRefs, props]
---

# Use toRef and toRefs to Maintain Reactivity

## Problem
Extracting properties from reactive objects or props loses reactivity.

## Bad Example
```vue
<script setup lang="ts">
const props = defineProps<{
  user: { name: string; age: number }
}>()

// Bad: Destructuring props loses reactivity
const { name, age } = props.user

// Bad: Assigning to new variable loses reactivity
const userName = props.user.name
</script>
```

## Good Example
```vue
<script setup lang="ts">
const props = defineProps<{
  user: { name: string; age: number }
}>()

// Option 1: Use toRef to create single reactive reference
const userName = toRef(() => props.user.name)
const userAge = toRef(() => props.user.age)

// Option 2: Use computed (recommended for derived values)
const displayName = computed(() => props.user.name.toUpperCase())

// Option 3: Use directly in template
</script>

<template>
  <span>{{ user.name }}</span>
  <span>{{ userName }}</span>
  <span>{{ displayName }}</span>
</template>
```

## Extracting from Reactive Objects
```vue
<script setup lang="ts">
const state = reactive({
  count: 0,
  name: 'Vue',
  nested: { value: 1 }
})

// toRef: Single property
const count = toRef(state, 'count')
count.value++ // Synchronously modifies state.count

// toRefs: All properties
const { count: countRef, name } = toRefs(state)

// New syntax: Getter function
const nestedValue = toRef(() => state.nested.value)
</script>
```

## Correctly Passing Reactive Data in Composables
```ts
// composables/useUser.ts
export function useUser(userId: MaybeRef<number>) {
  // Use toRef to uniformly handle ref and plain values
  const id = toRef(userId)

  const user = ref<User | null>(null)

  watch(id, async (newId) => {
    user.value = await fetchUser(newId)
  }, { immediate: true })

  return { user }
}

// Usage
const userId = ref(1)
const { user } = useUser(userId)      // Pass ref
const { user: user2 } = useUser(2)    // Pass plain value
```

## Why
- JavaScript destructuring is value copy, doesn't preserve reactive link
- `toRef` creates a ref pointing to source property
- Modifying ref created by toRef synchronously modifies source object
- Ensures data flow consistency and predictability
