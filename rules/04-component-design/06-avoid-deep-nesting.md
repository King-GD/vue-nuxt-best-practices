---
id: component-06
title: 避免过深的组件嵌套
priority: medium
category: component-design
tags: [component, nesting, performance]
---

# 避免过深的组件嵌套

## 问题
过深的组件嵌套增加渲染开销，降低代码可维护性。

## 错误示例
```vue
<!-- 过度抽象 -->
<template>
  <PageWrapper>
    <ContentContainer>
      <MainSection>
        <CardWrapper>
          <CardHeader>
            <TitleWrapper>
              <Title>{{ title }}</Title>
            </TitleWrapper>
          </CardHeader>
          <CardBody>
            <TextContent>{{ content }}</TextContent>
          </CardBody>
        </CardWrapper>
      </MainSection>
    </ContentContainer>
  </PageWrapper>
</template>
```

## 正确示例
```vue
<!-- 扁平化结构 -->
<template>
  <div class="page">
    <main class="content">
      <article class="card">
        <h2 class="card-title">{{ title }}</h2>
        <p class="card-content">{{ content }}</p>
      </article>
    </main>
  </div>
</template>

<!-- 或者只抽象有意义的组件 -->
<template>
  <PageLayout>
    <Card :title="title">
      {{ content }}
    </Card>
  </PageLayout>
</template>
```

## 合理的组件拆分原则
```vue
<script setup lang="ts">
// ✅ 有逻辑复用价值
// ✅ 有独立的状态管理
// ✅ 会在多处使用
// ✅ 提升可读性

// ❌ 只是简单的 DOM 包装
// ❌ 只使用一次
// ❌ 没有自己的状态或逻辑
</script>
```

## 使用 Slot 代替嵌套
```vue
<!-- 不要 -->
<Card>
  <CardHeader>
    <CardTitle>标题</CardTitle>
  </CardHeader>
  <CardBody>内容</CardBody>
</Card>

<!-- 使用 slot -->
<Card title="标题">
  内容
</Card>

<!-- Card.vue -->
<template>
  <div class="card">
    <h3 v-if="title" class="card-title">{{ title }}</h3>
    <slot name="header" />
    <div class="card-body">
      <slot />
    </div>
  </div>
</template>
```

## 原因
- 每个组件都有创建和渲染开销
- 深层嵌套增加 diff 算法复杂度
- 过度抽象降低代码可读性
- 合理的扁平化结构更易维护
