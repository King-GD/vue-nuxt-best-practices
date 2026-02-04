---
id: reactivity-01
title: 使用 shallowRef 处理大对象
priority: high
category: reactivity
tags: [reactivity, performance, shallowRef]
---

# 使用 shallowRef 处理大对象

## 问题
`ref` 会深度响应式转换对象，对于大型数据结构会造成性能开销。

## 错误示例
```vue
<script setup lang="ts">
// 错误：大数组使用 ref，每个元素都被转换为响应式
const tableData = ref<User[]>([])

// 从 API 获取 1000+ 条数据
const { data } = await useFetch('/api/users')
tableData.value = data.value // 每个 user 对象都变成响应式

// 错误：复杂嵌套对象
const chartData = ref({
  datasets: [/* 大量数据点 */],
  labels: [/* ... */]
})
</script>
```

## 正确示例
```vue
<script setup lang="ts">
// 正确：使用 shallowRef，只有 .value 是响应式
const tableData = shallowRef<User[]>([])

// 更新时需要替换整个数组
function updateData(newData: User[]) {
  tableData.value = newData // 触发更新
}

// 修改单个元素后手动触发
function updateItem(index: number, newItem: User) {
  tableData.value[index] = newItem
  triggerRef(tableData) // 手动触发更新
}
</script>
```

## 适用场景
```vue
<script setup lang="ts">
// 图表数据：通常整体替换
const chartData = shallowRef(null)

// 表格数据：大量行数据
const rows = shallowRef<Row[]>([])

// 地图标记：大量坐标点
const markers = shallowRef<Marker[]>([])

// 第三方库实例
const editorInstance = shallowRef<Editor | null>(null)
</script>
```

## shallowRef vs ref 性能对比
| 数据量 | ref 初始化 | shallowRef 初始化 |
|--------|-----------|------------------|
| 100 条 | ~2ms | ~0.1ms |
| 1000 条 | ~20ms | ~0.2ms |
| 10000 条 | ~200ms | ~0.5ms |

## 原因
- `ref` 递归转换所有嵌套属性为响应式 Proxy
- `shallowRef` 只有顶层 `.value` 是响应式
- 对于只需要整体替换的数据，浅响应式足够
- 显著减少内存占用和初始化时间
