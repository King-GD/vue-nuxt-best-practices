---
id: reactivity-04
title: Choose Correctly Between watch and watchEffect
priority: medium
category: reactivity
tags: [reactivity, watch, watchEffect]
---

# Choose Correctly Between watch and watchEffect

## Problem
Choosing the wrong watcher causes unnecessary executions or missed dependencies.

## When to Use watch
```vue
<script setup lang="ts">
const searchQuery = ref('')
const userId = ref(1)

// 1. Need access to old value
watch(searchQuery, (newVal, oldVal) => {
  console.log(`Changed from "${oldVal}" to "${newVal}"`)
})

// 2. Need lazy execution (doesn't run immediately by default)
watch(userId, async (id) => {
  userData.value = await fetchUser(id)
})

// 3. Watch specific reactive source
watch(
  () => route.params.id,
  (id) => fetchData(id),
  { immediate: true }
)

// 4. Watch multiple sources
watch(
  [firstName, lastName],
  ([first, last], [prevFirst, prevLast]) => {
    console.log(`${prevFirst} ${prevLast} -> ${first} ${last}`)
  }
)
</script>
```

## When to Use watchEffect
```vue
<script setup lang="ts">
const count = ref(0)
const multiplier = ref(2)

// 1. Auto-track all dependencies
watchEffect(() => {
  // Automatically tracks count and multiplier
  console.log(`${count.value} * ${multiplier.value} = ${count.value * multiplier.value}`)
})

// 2. Need immediate execution
watchEffect(() => {
  document.title = `Count: ${count.value}`
})

// 3. Side effects with cleanup
watchEffect((onCleanup) => {
  const controller = new AbortController()

  fetch(`/api/data/${id.value}`, { signal: controller.signal })
    .then(res => res.json())
    .then(data => result.value = data)

  onCleanup(() => controller.abort())
})
</script>
```

## Comparison Table
| Feature | watch | watchEffect |
|---------|-------|-------------|
| Dependency tracking | Explicit declaration | Auto-tracking |
| Immediate execution | Default no | Default yes |
| Access old value | ✅ | ❌ |
| Precise control | ✅ | ❌ |
| Code brevity | ❌ | ✅ |

## Avoid Common Mistakes
```vue
<script setup lang="ts">
// Bad: Modifying watched source in watch callback
watch(count, (val) => {
  count.value = val + 1 // Infinite loop!
})

// Bad: Conditional access in watchEffect
watchEffect(() => {
  if (showDetails.value) {
    // details.value only tracked when condition is true
    console.log(details.value)
  }
})

// Correct: Ensure all dependencies are tracked
watchEffect(() => {
  const shouldShow = showDetails.value
  const detailData = details.value
  if (shouldShow) {
    console.log(detailData)
  }
})
</script>
```

## Why
- `watch` is suitable when needing precise control or access to old values
- `watchEffect` is suitable when needing immediate execution with complex dependencies
- Wrong choice leads to performance issues or logic errors
