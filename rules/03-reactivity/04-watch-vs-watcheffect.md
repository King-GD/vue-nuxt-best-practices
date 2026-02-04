---
id: reactivity-04
title: 正确选择 watch vs watchEffect
priority: medium
category: reactivity
tags: [reactivity, watch, watchEffect]
---

# 正确选择 watch vs watchEffect

## 问题
选择错误的监听方式会导致不必要的执行或遗漏依赖。

## watch 适用场景
```vue
<script setup lang="ts">
const searchQuery = ref('')
const userId = ref(1)

// 1. 需要访问旧值
watch(searchQuery, (newVal, oldVal) => {
  console.log(`从 "${oldVal}" 变为 "${newVal}"`)
})

// 2. 需要惰性执行（默认不立即执行）
watch(userId, async (id) => {
  userData.value = await fetchUser(id)
})

// 3. 监听特定的响应式源
watch(
  () => route.params.id,
  (id) => fetchData(id),
  { immediate: true }
)

// 4. 监听多个源
watch(
  [firstName, lastName],
  ([first, last], [prevFirst, prevLast]) => {
    console.log(`${prevFirst} ${prevLast} -> ${first} ${last}`)
  }
)
</script>
```

## watchEffect 适用场景
```vue
<script setup lang="ts">
const count = ref(0)
const multiplier = ref(2)

// 1. 自动追踪所有依赖
watchEffect(() => {
  // 自动追踪 count 和 multiplier
  console.log(`${count.value} * ${multiplier.value} = ${count.value * multiplier.value}`)
})

// 2. 需要立即执行
watchEffect(() => {
  document.title = `Count: ${count.value}`
})

// 3. 带清理的副作用
watchEffect((onCleanup) => {
  const controller = new AbortController()

  fetch(`/api/data/${id.value}`, { signal: controller.signal })
    .then(res => res.json())
    .then(data => result.value = data)

  onCleanup(() => controller.abort())
})
</script>
```

## 对比表
| 特性 | watch | watchEffect |
|------|-------|-------------|
| 依赖追踪 | 显式声明 | 自动追踪 |
| 立即执行 | 默认否 | 默认是 |
| 访问旧值 | ✅ | ❌ |
| 精确控制 | ✅ | ❌ |
| 代码简洁 | ❌ | ✅ |

## 避免常见错误
```vue
<script setup lang="ts">
// 错误：在 watch 回调中修改监听的源
watch(count, (val) => {
  count.value = val + 1 // 无限循环！
})

// 错误：watchEffect 中有条件访问
watchEffect(() => {
  if (showDetails.value) {
    // details.value 只在条件为 true 时被追踪
    console.log(details.value)
  }
})

// 正确：确保所有依赖都被追踪
watchEffect(() => {
  const shouldShow = showDetails.value
  const detailData = details.value
  if (shouldShow) {
    console.log(detailData)
  }
})
</script>
```

## 原因
- `watch` 适合需要精确控制或访问旧值的场景
- `watchEffect` 适合需要立即执行且依赖复杂的场景
- 错误选择会导致性能问题或逻辑错误
