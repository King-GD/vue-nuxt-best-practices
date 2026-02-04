---
id: component-06
title: Avoid Deep Component Nesting
priority: medium
category: component-design
tags: [component, nesting, performance]
---

# Avoid Deep Component Nesting

## Problem
Deep component nesting increases rendering overhead and reduces code maintainability.

## Bad Example
```vue
<!-- Over-abstraction -->
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

## Good Example
```vue
<!-- Flattened structure -->
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

<!-- Or only abstract meaningful components -->
<template>
  <PageLayout>
    <Card :title="title">
      {{ content }}
    </Card>
  </PageLayout>
</template>
```

## Reasonable Component Splitting Principles
```vue
<script setup lang="ts">
// ✅ Has logic reuse value
// ✅ Has independent state management
// ✅ Will be used in multiple places
// ✅ Improves readability

// ❌ Just simple DOM wrapper
// ❌ Only used once
// ❌ No own state or logic
</script>
```

## Use Slots Instead of Nesting
```vue
<!-- Don't do this -->
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardBody>Content</CardBody>
</Card>

<!-- Use slots -->
<Card title="Title">
  Content
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

## Why
- Every component has creation and rendering overhead
- Deep nesting increases diff algorithm complexity
- Over-abstraction reduces code readability
- Reasonable flattened structure is easier to maintain
