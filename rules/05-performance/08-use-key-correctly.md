---
id: perf-08
title: 正确使用 key 优化列表渲染
priority: high
category: performance
tags: [performance, key, list, diff]
---

# 正确使用 key 优化列表渲染

## 问题
错误的 key 会导致不必要的 DOM 操作或状态错乱。

## 错误示例
```vue
<template>
  <!-- 错误：使用 index 作为 key -->
  <div v-for="(item, index) in items" :key="index">
    <input v-model="item.value" />
  </div>

  <!-- 错误：没有 key -->
  <div v-for="item in items">
    {{ item.name }}
  </div>

  <!-- 错误：非唯一 key -->
  <div v-for="item in items" :key="item.category">
    {{ item.name }}
  </div>
</template>
```

## 正确示例
```vue
<template>
  <!-- 正确：使用唯一且稳定的 id -->
  <div v-for="item in items" :key="item.id">
    <input v-model="item.value" />
  </div>

  <!-- 复合 key（当单个字段不唯一时） -->
  <div v-for="item in items" :key="`${item.type}-${item.id}`">
    {{ item.name }}
  </div>

  <!-- 强制重新创建组件 -->
  <UserProfile :key="userId" :id="userId" />
</template>
```

## 何时可以用 index
```vue
<template>
  <!-- ✅ 静态列表，不会增删改 -->
  <li v-for="(item, index) in staticMenu" :key="index">
    {{ item.label }}
  </li>

  <!-- ✅ 纯展示，没有状态 -->
  <span v-for="(tag, index) in tags" :key="index">
    {{ tag }}
  </span>
</template>
```

## key 的作用
```vue
<script setup lang="ts">
// 使用 key 强制重置组件状态
const formKey = ref(0)

function resetForm() {
  formKey.value++ // 组件会被销毁重建
}
</script>

<template>
  <FormComponent :key="formKey" />
  <button @click="resetForm">重置</button>
</template>
```

## 原因
- key 帮助 Vue 识别节点身份
- 正确的 key 使 diff 算法更高效
- 错误的 key 导致状态错乱（如输入框内容跑到其他行）
- 唯一稳定的 key 是最佳实践
