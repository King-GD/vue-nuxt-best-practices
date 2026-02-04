---
id: component-05
title: 使用 Suspense 处理异步组件
priority: medium
category: component-design
tags: [component, suspense, async]
---

# 使用 Suspense 处理异步组件

## 问题
多个异步组件的加载状态难以统一管理。

## 错误示例
```vue
<template>
  <!-- 错误：每个组件单独处理加载状态 -->
  <div v-if="loading1">加载用户...</div>
  <UserProfile v-else :data="userData" />

  <div v-if="loading2">加载文章...</div>
  <ArticleList v-else :data="articles" />

  <div v-if="loading3">加载评论...</div>
  <Comments v-else :data="comments" />
</template>
```

## 正确示例
```vue
<template>
  <!-- 使用 Suspense 统一处理 -->
  <Suspense>
    <template #default>
      <div class="content">
        <UserProfile />
        <ArticleList />
        <Comments />
      </div>
    </template>
    <template #fallback>
      <PageSkeleton />
    </template>
  </Suspense>
</template>

<script setup lang="ts">
// 子组件使用 async setup
// UserProfile.vue
const { data: user } = await useFetch('/api/user')
</script>
```

## 嵌套 Suspense
```vue
<template>
  <Suspense>
    <!-- 关键内容 -->
    <template #default>
      <MainContent />

      <!-- 嵌套 Suspense 处理非关键内容 -->
      <Suspense>
        <template #default>
          <Sidebar />
        </template>
        <template #fallback>
          <SidebarSkeleton />
        </template>
      </Suspense>
    </template>
    <template #fallback>
      <MainSkeleton />
    </template>
  </Suspense>
</template>
```

## 错误处理
```vue
<script setup lang="ts">
import { onErrorCaptured } from 'vue'

const error = ref<Error | null>(null)

onErrorCaptured((e) => {
  error.value = e
  return false // 阻止错误继续传播
})
</script>

<template>
  <div v-if="error" class="error">
    加载失败: {{ error.message }}
    <button @click="error = null">重试</button>
  </div>
  <Suspense v-else>
    <AsyncComponent />
    <template #fallback>
      <Loading />
    </template>
  </Suspense>
</template>
```

## 原因
- Suspense 统一管理多个异步依赖的加载状态
- 避免多个 loading 状态导致的布局跳动
- 配合 async setup 使用更简洁
- 支持嵌套实现渐进式加载
