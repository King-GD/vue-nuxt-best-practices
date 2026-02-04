---
id: component-02
title: 正确使用 v-if vs v-show
priority: high
category: component-design
tags: [component, v-if, v-show, performance]
---

# 正确使用 v-if vs v-show

## 问题
错误选择条件渲染指令会导致不必要的性能开销。

## 错误示例
```vue
<template>
  <!-- 错误：频繁切换使用 v-if -->
  <div v-if="isHovered" class="tooltip">提示信息</div>

  <!-- 错误：很少显示的内容使用 v-show -->
  <AdminPanel v-show="isAdmin" />

  <!-- 错误：初始不需要的重型组件使用 v-show -->
  <HeavyChart v-show="showChart" />
</template>
```

## 正确示例
```vue
<template>
  <!-- v-show：频繁切换，如 hover、toggle -->
  <div v-show="isHovered" class="tooltip">提示信息</div>

  <!-- v-if：条件很少改变 -->
  <AdminPanel v-if="isAdmin" />

  <!-- v-if：初始不需要渲染的重型组件 -->
  <HeavyChart v-if="showChart" />

  <!-- v-if + key：强制重新创建组件 -->
  <UserProfile v-if="userId" :key="userId" :id="userId" />
</template>
```

## 选择指南
| 场景 | 推荐 | 原因 |
|------|------|------|
| 频繁切换（hover、tab） | `v-show` | 避免重复创建/销毁 |
| 条件很少变化 | `v-if` | 避免初始渲染开销 |
| 初始为 false | `v-if` | 延迟渲染 |
| 多个互斥条件 | `v-if/v-else-if` | 只渲染一个 |
| 需要重新初始化 | `v-if` | 条件变化时重新创建 |

## 结合 Transition 使用
```vue
<template>
  <!-- v-show 配合 transition -->
  <Transition name="fade">
    <div v-show="visible" class="modal">
      内容
    </div>
  </Transition>

  <!-- v-if 配合 transition -->
  <Transition name="slide" mode="out-in">
    <component :is="currentTab" :key="currentTab" />
  </Transition>
</template>
```

## 原因
- `v-if` 是"真正"的条件渲染，会创建/销毁 DOM
- `v-show` 只是切换 CSS `display` 属性
- `v-if` 有更高的切换开销，`v-show` 有更高的初始渲染开销
- 根据切换频率选择合适的指令
