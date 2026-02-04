---
id: reactivity-08
title: 避免不必要的 ref 包装
priority: medium
category: reactivity
tags: [reactivity, ref, performance]
---

# 避免不必要的 ref 包装

## 问题
过度使用 ref 会增加内存开销和代码复杂度。

## 错误示例
```vue
<script setup lang="ts">
// 错误：常量不需要响应式
const API_URL = ref('https://api.example.com')
const MAX_ITEMS = ref(100)

// 错误：只用于计算的中间值
const tempValue = ref(0)
const result = computed(() => {
  tempValue.value = someCalculation()
  return tempValue.value * 2
})

// 错误：从不修改的数据
const config = ref({
  theme: 'dark',
  language: 'zh'
})
// config 从未被重新赋值
</script>
```

## 正确示例
```vue
<script setup lang="ts">
// 常量直接使用普通变量
const API_URL = 'https://api.example.com'
const MAX_ITEMS = 100

// 计算值使用 computed
const result = computed(() => someCalculation() * 2)

// 不变的配置使用 readonly 或普通对象
const config = {
  theme: 'dark',
  language: 'zh'
} as const

// 只有需要响应式更新的才用 ref
const count = ref(0)
const userInput = ref('')
const isLoading = ref(false)
</script>
```

## 何时使用 ref
```vue
<script setup lang="ts">
// ✅ 用户交互会改变的状态
const isOpen = ref(false)
const selectedId = ref<number | null>(null)

// ✅ 异步数据
const users = ref<User[]>([])

// ✅ 表单输入
const formData = ref({
  name: '',
  email: ''
})

// ✅ 需要在模板中响应变化
const message = ref('Hello')
</script>
```

## 使用 readonly 保护数据
```vue
<script setup lang="ts">
const state = reactive({
  count: 0,
  items: []
})

// 暴露只读版本给子组件
const readonlyState = readonly(state)

// 子组件无法修改
provide('state', readonlyState)
</script>
```

## 原因
- 每个 ref 都有额外的内存开销（Proxy 包装）
- 不必要的响应式包装增加代码复杂度
- 常量和配置不需要响应式追踪
- 正确区分静态数据和动态状态
