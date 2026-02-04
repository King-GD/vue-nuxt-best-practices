---
id: perf-04
title: 图片懒加载和优化
priority: high
category: performance
tags: [performance, image, lazy-loading]
---

# 图片懒加载和优化

## 问题
首屏加载过多图片会显著延长加载时间，影响 LCP 指标。

## 错误示例
```vue
<template>
  <!-- 错误：所有图片立即加载 -->
  <div v-for="item in items" :key="item.id">
    <img :src="item.image" :alt="item.name" />
  </div>

  <!-- 错误：没有指定尺寸，导致布局偏移 -->
  <img :src="coverImage" />
</template>
```

## 正确示例
```vue
<template>
  <!-- 原生懒加载 -->
  <img
    :src="item.image"
    :alt="item.name"
    loading="lazy"
    width="300"
    height="200"
  />

  <!-- 使用 NuxtImg（推荐） -->
  <NuxtImg
    :src="item.image"
    :alt="item.name"
    width="300"
    height="200"
    loading="lazy"
    format="webp"
    quality="80"
  />

  <!-- 首屏关键图片不要懒加载 -->
  <NuxtImg
    :src="heroImage"
    alt="Hero"
    loading="eager"
    fetchpriority="high"
    preload
  />
</template>
```

## 配置 @nuxt/image
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

## 响应式图片
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

## 背景图懒加载
```vue
<template>
  <div
    v-lazy-bg="backgroundUrl"
    class="hero-section"
  />
</template>

<script setup lang="ts">
// 使用 Intersection Observer
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

## 原因
- 懒加载减少首屏请求数量
- 指定尺寸避免布局偏移（CLS）
- WebP 格式体积更小
- @nuxt/image 自动优化和响应式处理
