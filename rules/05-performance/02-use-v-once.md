---
id: perf-02
title: 使用 v-once 渲染静态内容
priority: medium
category: performance
tags: [performance, v-once, static]
---

# 使用 v-once 渲染静态内容

## 问题
不会变化的静态内容每次都参与 diff 计算，浪费性能。

## 错误示例
```vue
<template>
  <div>
    <!-- 这些内容永远不会变化，但每次都重新渲染 -->
    <header>
      <h1>欢迎使用 FOFA</h1>
      <p>网络空间搜索引擎</p>
    </header>

    <footer>
      <p>© 2024 FOFA. All rights reserved.</p>
      <nav>
        <a href="/about">关于我们</a>
        <a href="/contact">联系我们</a>
      </nav>
    </footer>

    <!-- 动态内容 -->
    <main>{{ content }}</main>
  </div>
</template>
```

## 正确示例
```vue
<template>
  <div>
    <!-- v-once：只渲染一次，之后跳过 -->
    <header v-once>
      <h1>欢迎使用 FOFA</h1>
      <p>网络空间搜索引擎</p>
    </header>

    <footer v-once>
      <p>© 2024 FOFA. All rights reserved.</p>
      <nav>
        <a href="/about">关于我们</a>
        <a href="/contact">联系我们</a>
      </nav>
    </footer>

    <!-- 动态内容正常渲染 -->
    <main>{{ content }}</main>
  </div>
</template>
```

## 包含初始数据的静态内容
```vue
<template>
  <!-- 使用初始值渲染一次，之后不再更新 -->
  <div v-once>
    <p>创建时间: {{ formatDate(createdAt) }}</p>
    <p>创建者: {{ creator.name }}</p>
  </div>
</template>
```

## 注意事项
```vue
<template>
  <!-- ❌ 不要对需要更新的内容使用 v-once -->
  <div v-once>
    {{ dynamicContent }} <!-- 永远不会更新！ -->
  </div>

  <!-- ✅ 只对真正静态的内容使用 -->
  <div v-once>
    <Icon name="logo" />
    <span>FOFA</span>
  </div>
</template>
```

## 原因
- v-once 标记的内容只渲染一次
- 后续更新时完全跳过该子树
- 减少虚拟 DOM diff 开销
- 适合 logo、版权信息、静态导航等
