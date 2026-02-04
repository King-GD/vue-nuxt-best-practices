---
id: component-07
title: Use defineExpose Correctly
priority: medium
category: component-design
tags: [component, expose, ref]
---

# Use defineExpose Correctly

## Problem
Variables in `<script setup>` are not exposed to parent components by default, requiring explicit declaration.

## Bad Example
```vue
<!-- Child.vue -->
<script setup lang="ts">
const count = ref(0)

function reset() {
  count.value = 0
}
</script>

<!-- Parent.vue -->
<script setup lang="ts">
const childRef = ref()

function handleReset() {
  // Error: reset is not exposed, cannot be called
  childRef.value.reset()
}
</script>

<template>
  <Child ref="childRef" />
</template>
```

## Good Example
```vue
<!-- Child.vue -->
<script setup lang="ts">
const count = ref(0)

function reset() {
  count.value = 0
}

function validate(): boolean {
  return count.value > 0
}

// Explicitly expose needed methods and properties
defineExpose({
  reset,
  validate,
  count: readonly(count) // Expose readonly version
})
</script>

<!-- Parent.vue -->
<script setup lang="ts">
const childRef = ref<InstanceType<typeof Child> | null>(null)

function handleReset() {
  childRef.value?.reset()
}

async function handleSubmit() {
  if (childRef.value?.validate()) {
    // Submit
  }
}
</script>
```

## Form Component Exposure
```vue
<!-- FormInput.vue -->
<script setup lang="ts">
const inputRef = ref<HTMLInputElement | null>(null)

function focus() {
  inputRef.value?.focus()
}

function blur() {
  inputRef.value?.blur()
}

function clear() {
  emit('update:modelValue', '')
}

defineExpose({
  focus,
  blur,
  clear,
  el: inputRef
})
</script>
```

## Type-Safe Component References
```ts
// Define component exposed interface
interface FormInputExpose {
  focus: () => void
  blur: () => void
  clear: () => void
  el: HTMLInputElement | null
}

// Usage
const inputRef = ref<FormInputExpose | null>(null)
inputRef.value?.focus()
```

## Why
- `<script setup>` is closed by default, protecting internal implementation
- Explicit expose clarifies component's public API
- Prevents parent components from depending on child's internal implementation
- Combined with TypeScript for type safety
