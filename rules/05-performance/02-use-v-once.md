---
id: perf-02
title: Use v-once for Static Content
priority: medium
category: performance
tags: [performance, v-once, static]
---

# Use v-once for Static Content

## Problem
Static content that never changes still participates in diff calculations, wasting performance.

## Bad Example
```vue
<template>
  <div>
    <!-- This content never changes, but re-renders every time -->
    <header>
      <h1>Welcome to MyApp</h1>
      <p>The best application ever</p>
    </header>

    <footer>
      <p>© 2024 MyApp. All rights reserved.</p>
      <nav>
        <a href="/about">About Us</a>
        <a href="/contact">Contact Us</a>
      </nav>
    </footer>

    <!-- Dynamic content -->
    <main>{{ content }}</main>
  </div>
</template>
```

## Good Example
```vue
<template>
  <div>
    <!-- v-once: Render only once, skip afterwards -->
    <header v-once>
      <h1>Welcome to MyApp</h1>
      <p>The best application ever</p>
    </header>

    <footer v-once>
      <p>© 2024 MyApp. All rights reserved.</p>
      <nav>
        <a href="/about">About Us</a>
        <a href="/contact">Contact Us</a>
      </nav>
    </footer>

    <!-- Dynamic content renders normally -->
    <main>{{ content }}</main>
  </div>
</template>
```

## Static Content with Initial Data
```vue
<template>
  <!-- Render once with initial value, never update afterwards -->
  <div v-once>
    <p>Created at: {{ formatDate(createdAt) }}</p>
    <p>Created by: {{ creator.name }}</p>
  </div>
</template>
```

## Cautions
```vue
<template>
  <!-- ❌ Don't use v-once on content that needs updates -->
  <div v-once>
    {{ dynamicContent }} <!-- Will never update! -->
  </div>

  <!-- ✅ Only use on truly static content -->
  <div v-once>
    <Icon name="logo" />
    <span>MyApp</span>
  </div>
</template>
```

## Why
- Content marked with v-once only renders once
- Completely skips that subtree on subsequent updates
- Reduces virtual DOM diff overhead
- Suitable for logos, copyright info, static navigation, etc.
