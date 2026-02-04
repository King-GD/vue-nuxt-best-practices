---
id: perf-04
title: Image Lazy Loading and Optimization
priority: high
category: performance
tags: [performance, image, lazy-loading]
---

# Image Lazy Loading and Optimization

## Problem
Loading too many images on first paint significantly extends load time and affects LCP metrics.

## Bad Example
```vue
<template>
  <!-- Bad: All images load immediately -->
  <div v-for="item in items" :key="item.id">
    <img :src="item.image" :alt="item.name" />
  </div>

  <!-- Bad: No dimensions specified, causes layout shift -->
  <img :src="coverImage" />
</template>
```

## Good Example
```vue
<template>
  <!-- Native lazy loading -->
  <img
    :src="item.image"
    :alt="item.name"
    loading="lazy"
    width="300"
    height="200"
  />

  <!-- Using NuxtImg (recommended) -->
  <NuxtImg
    :src="item.image"
    :alt="item.name"
    width="300"
    height="200"
    loading="lazy"
    format="webp"
    quality="80"
  />

  <!-- Critical images above fold should not be lazy loaded -->
  <NuxtImg
    :src="heroImage"
    alt="Hero"
    loading="eager"
    fetchpriority="high"
    preload
  />
</template>
```

## Configure @nuxt/image
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  image: {
    quality: 80,
    format: ['webp', 'png', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280
    }
  }
})
```

## Responsive Images
```vue
<template>
  <NuxtPicture
    :src="image"
    :alt="alt"
    sizes="(max-width: 768px) 100vw, 50vw"
    :modifiers="{ fit: 'cover' }"
  />
</template>
```

## Background Image Lazy Loading
```vue
<template>
  <div
    v-lazy-bg="backgroundUrl"
    class="hero-section"
  />
</template>

<script setup lang="ts">
// Using Intersection Observer
const vLazyBg = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.backgroundImage = `url(${binding.value})`
        observer.disconnect()
      }
    })
    observer.observe(el)
  }
}
</script>
```

## Why
- Lazy loading reduces first paint request count
- Specifying dimensions avoids layout shift (CLS)
- WebP format has smaller file size
- @nuxt/image provides automatic optimization and responsive handling
