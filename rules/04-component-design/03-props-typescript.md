---
id: component-03
title: Use TypeScript for Props Definition
priority: high
category: component-design
tags: [component, props, typescript]
---

# Use TypeScript for Props Definition

## Problem
Runtime props definitions lack type safety, are error-prone, and have poor IDE support.

## Bad Example
```vue
<script setup lang="ts">
// Bad: Runtime definition, types not precise enough
const props = defineProps({
  id: Number,
  name: String,
  items: Array,
  config: Object
})

// Bad: Using any
const props = defineProps<{
  data: any
}>()
</script>
```

## Good Example
```vue
<script setup lang="ts">
// Correct: Use interface for precise types
interface User {
  id: number
  name: string
  email: string
}

interface Props {
  user: User
  items: string[]
  loading?: boolean
  size?: 'small' | 'medium' | 'large'
}

const props = defineProps<Props>()

// With defaults
const props = withDefaults(defineProps<Props>(), {
  loading: false,
  size: 'medium',
  items: () => []  // Reference types need factory function
})
</script>
```

## Complex Type Definitions
```vue
<script setup lang="ts">
// Generic components
interface Props<T> {
  items: T[]
  selected?: T
  renderItem?: (item: T) => string
}

// Vue 3.3+ supports generic components
const props = defineProps<Props<T>>()

// Event type definitions
interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'submit', data: FormData): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

// Or use simplified syntax
const emit = defineEmits<{
  'update:modelValue': [value: string]
  submit: [data: FormData]
  cancel: []
}>()
</script>
```

## Extract Reusable Types
```ts
// types/components.ts
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

export interface TableColumn<T> {
  key: keyof T
  label: string
  width?: number
  sortable?: boolean
  render?: (value: T[keyof T], row: T) => VNode
}
```

## Why
- TypeScript types are checked at compile time, zero runtime overhead
- IDE autocomplete and error hints
- Automatically detect type mismatches during refactoring
- Cleaner code, better documentation
