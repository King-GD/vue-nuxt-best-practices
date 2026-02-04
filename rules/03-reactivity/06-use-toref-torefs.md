---
id: reactivity-06
title: 使用 toRef 和 toRefs 保持响应性
priority: high
category: reactivity
tags: [reactivity, toRef, toRefs, props]
---

# 使用 toRef 和 toRefs 保持响应性

## 问题
从 reactive 对象或 props 提取属性时会丢失响应性。

## 错误示例
```vue
<script setup lang="ts">
const props = defineProps<{
  user: { name: string; age: number }
}>()

// 错误：解构 props 丢失响应性
const { name, age } = props.user

// 错误：赋值给新变量丢失响应性
const userName = props.user.name
</script>
```

## 正确示例
```vue
<script setup lang="ts">
const props = defineProps<{
  user: { name: string; age: number }
}>()

// 方式1：使用 toRef 创建单个响应式引用
const userName = toRef(() => props.user.name)
const userAge = toRef(() => props.user.age)

// 方式2：使用 computed（推荐用于派生值）
const displayName = computed(() => props.user.name.toUpperCase())

// 方式3：直接在模板中使用
</script>

<template>
  <span>{{ user.name }}</span>
  <span>{{ userName }}</span>
  <span>{{ displayName }}</span>
</template>
```

## 从 reactive 对象提取
```vue
<script setup lang="ts">
const state = reactive({
  count: 0,
  name: 'Vue',
  nested: { value: 1 }
})

// toRef：单个属性
const count = toRef(state, 'count')
count.value++ // 同步修改 state.count

// toRefs：所有属性
const { count: countRef, name } = toRefs(state)

// 新语法：getter 函数
const nestedValue = toRef(() => state.nested.value)
</script>
```

## Composable 中正确传递响应式数据
```ts
// composables/useUser.ts
export function useUser(userId: MaybeRef<number>) {
  // 使用 toRef 统一处理 ref 和普通值
  const id = toRef(userId)

  const user = ref<User | null>(null)

  watch(id, async (newId) => {
    user.value = await fetchUser(newId)
  }, { immediate: true })

  return { user }
}

// 使用方式
const userId = ref(1)
const { user } = useUser(userId)      // 传入 ref
const { user: user2 } = useUser(2)    // 传入普通值
```

## 原因
- JavaScript 解构是值复制，不保留响应式链接
- `toRef` 创建一个指向源属性的 ref
- 修改 toRef 创建的 ref 会同步修改源对象
- 确保数据流的一致性和可预测性
