---
id: reactivity-08
title: Avoid Unnecessary ref Wrapping
priority: medium
category: reactivity
tags: [reactivity, ref, performance]
---

# Avoid Unnecessary ref Wrapping

## Problem
Overusing ref increases memory overhead and code complexity.

## Bad Example
```vue
<script setup lang="ts">
// Bad: Constants don't need reactivity
const API_URL = ref('https://api.example.com')
const MAX_ITEMS = ref(100)

// Bad: Intermediate values only used for calculation
const tempValue = ref(0)
const result = computed(() => {
  tempValue.value = someCalculation()
  return tempValue.value * 2
})

// Bad: Data that's never modified
const config = ref({
  theme: 'dark',
  language: 'en'
})
// config is never reassigned
</script>
```

## Good Example
```vue
<script setup lang="ts">
// Constants use plain variables directly
const API_URL = 'https://api.example.com'
const MAX_ITEMS = 100

// Calculated values use computed
const result = computed(() => someCalculation() * 2)

// Immutable config uses readonly or plain object
const config = {
  theme: 'dark',
  language: 'en'
} as const

// Only use ref for data that needs reactive updates
const count = ref(0)
const userInput = ref('')
const isLoading = ref(false)
</script>
```

## When to Use ref
```vue
<script setup lang="ts">
// ✅ State that changes via user interaction
const isOpen = ref(false)
const selectedId = ref<number | null>(null)

// ✅ Async data
const users = ref<User[]>([])

// ✅ Form inputs
const formData = ref({
  name: '',
  email: ''
})

// ✅ Needs to respond to changes in template
const message = ref('Hello')
</script>
```

## Using readonly to Protect Data
```vue
<script setup lang="ts">
const state = reactive({
  count: 0,
  items: []
})

// Expose readonly version to child components
const readonlyState = readonly(state)

// Child components cannot modify
provide('state', readonlyState)
</script>
```

## Why
- Every ref has additional memory overhead (Proxy wrapping)
- Unnecessary reactive wrapping increases code complexity
- Constants and config don't need reactive tracking
- Correctly distinguish between static data and dynamic state
