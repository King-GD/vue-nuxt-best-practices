---
id: component-05
title: Use Suspense for Async Components
priority: medium
category: component-design
tags: [component, suspense, async]
---

# Use Suspense for Async Components

## Problem
Managing loading states for multiple async components individually is difficult.

## Bad Example
```vue
<template>
  <!-- Bad: Each component handles loading state separately -->
  <div v-if="loading1">Loading user...</div>
  <UserProfile v-else :data="userData" />

  <div v-if="loading2">Loading articles...</div>
  <ArticleList v-else :data="articles" />

  <div v-if="loading3">Loading comments...</div>
  <Comments v-else :data="comments" />
</template>
```

## Good Example
```vue
<template>
  <!-- Use Suspense for unified handling -->
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
// Child components use async setup
// UserProfile.vue
const { data: user } = await useFetch('/api/user')
</script>
```

## Nested Suspense
```vue
<template>
  <Suspense>
    <!-- Critical content -->
    <template #default>
      <MainContent />

      <!-- Nested Suspense for non-critical content -->
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

## Error Handling
```vue
<script setup lang="ts">
import { onErrorCaptured } from 'vue'

const error = ref<Error | null>(null)

onErrorCaptured((e) => {
  error.value = e
  return false // Prevent error from propagating
})
</script>

<template>
  <div v-if="error" class="error">
    Failed to load: {{ error.message }}
    <button @click="error = null">Retry</button>
  </div>
  <Suspense v-else>
    <AsyncComponent />
    <template #fallback>
      <Loading />
    </template>
  </Suspense>
</template>
```

## Why
- Suspense uniformly manages loading state for multiple async dependencies
- Avoids layout jumping caused by multiple loading states
- Works more cleanly with async setup
- Supports nesting for progressive loading
