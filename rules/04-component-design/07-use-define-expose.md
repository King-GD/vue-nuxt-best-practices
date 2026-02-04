---
id: component-07
title: 正确使用 defineExpose
priority: medium
category: component-design
tags: [component, expose, ref]
---

# 正确使用 defineExpose

## 问题
`<script setup>` 中的变量默认不暴露给父组件，需要显式声明。

## 错误示例
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
  // 错误：reset 未暴露，无法调用
  childRef.value.reset()
}
</script>

<template>
  <Child ref="childRef" />
</template>
```

## 正确示例
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

// 显式暴露需要的方法和属性
defineExpose({
  reset,
  validate,
  count: readonly(count) // 暴露只读版本
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
    // 提交
  }
}
</script>
```

## 表单组件暴露
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

## 类型安全的组件引用
```ts
// 定义组件暴露的接口
interface FormInputExpose {
  focus: () => void
  blur: () => void
  clear: () => void
  el: HTMLInputElement | null
}

// 使用
const inputRef = ref<FormInputExpose | null>(null)
inputRef.value?.focus()
```

## 原因
- `<script setup>` 默认是封闭的，保护内部实现
- 显式 expose 明确组件的公共 API
- 避免父组件依赖子组件的内部实现
- 配合 TypeScript 提供类型安全
