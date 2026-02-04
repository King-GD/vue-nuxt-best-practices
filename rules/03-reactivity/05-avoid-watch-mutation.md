---
id: reactivity-05
title: 避免在 watch 中修改源数据
priority: high
category: reactivity
tags: [reactivity, watch, infinite-loop]
---

# 避免在 watch 中修改源数据

## 问题
在 watch 回调中修改被监听的数据会导致无限循环。

## 错误示例
```vue
<script setup lang="ts">
const count = ref(0)

// 错误：无限循环！
watch(count, (val) => {
  count.value = val + 1
})

// 错误：间接修改也会循环
const items = ref<string[]>([])
watch(items, (val) => {
  items.value = [...val, 'new item'] // 无限循环
}, { deep: true })
</script>
```

## 正确示例
```vue
<script setup lang="ts">
const count = ref(0)
const doubledCount = ref(0)

// 正确：修改其他响应式数据
watch(count, (val) => {
  doubledCount.value = val * 2
})

// 或使用 computed
const doubled = computed(() => count.value * 2)

// 正确：条件修改，避免循环
const input = ref('')
watch(input, (val) => {
  // 只在特定条件下修改，且修改后不会再触发
  if (val.includes('  ')) {
    input.value = val.replace(/  +/g, ' ')
  }
})
</script>
```

## 使用 watchEffect 的清理函数
```vue
<script setup lang="ts">
const searchQuery = ref('')
const results = ref([])

watchEffect((onCleanup) => {
  const query = searchQuery.value
  if (!query) {
    results.value = []
    return
  }

  const controller = new AbortController()

  fetch(`/api/search?q=${query}`, { signal: controller.signal })
    .then(res => res.json())
    .then(data => {
      results.value = data // 修改其他数据，不是源数据
    })

  onCleanup(() => controller.abort())
})
</script>
```

## 使用 flush 控制时机
```vue
<script setup lang="ts">
const data = ref(null)

// flush: 'post' - DOM 更新后执行
watch(data, () => {
  // 可以安全访问更新后的 DOM
  nextTick(() => {
    scrollToBottom()
  })
}, { flush: 'post' })

// flush: 'sync' - 同步执行（谨慎使用）
watch(urgent, () => {
  // 立即同步执行
}, { flush: 'sync' })
</script>
```

## 原因
- watch 回调修改源数据会再次触发 watch
- 形成 watch → 修改 → watch 的无限循环
- 正确做法是修改其他数据或使用条件判断
