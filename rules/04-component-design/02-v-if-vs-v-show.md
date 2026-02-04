---
id: component-02
title: Use v-if vs v-show Correctly
priority: high
category: component-design
tags: [component, v-if, v-show, performance]
---

# Use v-if vs v-show Correctly

## Problem
Choosing the wrong conditional rendering directive causes unnecessary performance overhead.

## Bad Example
```vue
<template>
  <!-- Bad: Using v-if for frequent toggling -->
  <div v-if="isHovered" class="tooltip">Tooltip info</div>

  <!-- Bad: Using v-show for rarely shown content -->
  <AdminPanel v-show="isAdmin" />

  <!-- Bad: Using v-show for heavy components not needed initially -->
  <HeavyChart v-show="showChart" />
</template>
```

## Good Example
```vue
<template>
  <!-- v-show: Frequent toggling, like hover, toggle -->
  <div v-show="isHovered" class="tooltip">Tooltip info</div>

  <!-- v-if: Condition rarely changes -->
  <AdminPanel v-if="isAdmin" />

  <!-- v-if: Heavy components not needed initially -->
  <HeavyChart v-if="showChart" />

  <!-- v-if + key: Force component recreation -->
  <UserProfile v-if="userId" :key="userId" :id="userId" />
</template>
```

## Selection Guide
| Scenario | Recommended | Reason |
|----------|-------------|--------|
| Frequent toggling (hover, tab) | `v-show` | Avoid repeated create/destroy |
| Condition rarely changes | `v-if` | Avoid initial render overhead |
| Initially false | `v-if` | Deferred rendering |
| Multiple mutually exclusive conditions | `v-if/v-else-if` | Only render one |
| Need reinitialization | `v-if` | Recreate on condition change |

## Using with Transition
```vue
<template>
  <!-- v-show with transition -->
  <Transition name="fade">
    <div v-show="visible" class="modal">
      Content
    </div>
  </Transition>

  <!-- v-if with transition -->
  <Transition name="slide" mode="out-in">
    <component :is="currentTab" :key="currentTab" />
  </Transition>
</template>
```

## Why
- `v-if` is "real" conditional rendering, creates/destroys DOM
- `v-show` only toggles CSS `display` property
- `v-if` has higher toggle cost, `v-show` has higher initial render cost
- Choose appropriate directive based on toggle frequency
