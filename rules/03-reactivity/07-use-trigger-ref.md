---
id: reactivity-07
title: 使用 triggerRef 强制更新
priority: low
category: reactivity
tags: [reactivity, triggerRef, shallowRef]
---

# 使用 triggerRef 强制更新

## 问题
使用 shallowRef 时，修改内部属性不会触发视图更新。

## 错误示例
```vue
<script setup lang="ts">
const data = shallowRef({ count: 0, items: [] })

function increment() {
  // 错误：修改内部属性不会触发更新
  data.value.count++
}

function addItem() {
  // 错误：push 不会触发更新
  data.value.items.push('new item')
}
</script>
```

## 正确示例
```vue
<script setup lang="ts">
const data = shallowRef({ count: 0, items: [] })

// 方式1：替换整个对象（推荐）
function increment() {
  data.value = { ...data.value, count: data.value.count + 1 }
}

function addItem() {
  data.value = {
    ...data.value,
    items: [...data.value.items, 'new item']
  }
}

// 方式2：修改后手动触发更新
function incrementWithTrigger() {
  data.value.count++
  triggerRef(data) // 手动触发更新
}

function addItemWithTrigger() {
  data.value.items.push('new item')
  triggerRef(data)
}
</script>
```

## 批量修改后触发
```vue
<script setup lang="ts">
const tableData = shallowRef<Row[]>([])

// 批量修改多个属性后一次性触发
function updateMultipleRows(updates: Map<number, Partial<Row>>) {
  updates.forEach((update, index) => {
    Object.assign(tableData.value[index], update)
  })
  // 所有修改完成后触发一次更新
  triggerRef(tableData)
}
</script>
```

## customRef 自定义触发逻辑
```vue
<script setup lang="ts">
// 创建防抖的 ref
function useDebouncedRef<T>(value: T, delay = 300) {
  let timeout: NodeJS.Timeout

  return customRef((track, trigger) => ({
    get() {
      track()
      return value
    },
    set(newValue) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        value = newValue
        trigger() // 延迟触发
      }, delay)
    }
  }))
}

const searchQuery = useDebouncedRef('', 500)
</script>
```

## 原因
- shallowRef 只追踪 .value 的变化，不追踪内部属性
- triggerRef 强制触发依赖更新
- 适合性能敏感场景的精细控制
- 替换整个对象是更清晰的不可变更新模式
