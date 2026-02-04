---
id: state-04
title: 避免在 Store 中存储非序列化数据
priority: medium
category: state-management
tags: [pinia, serialization, ssr]
---

# 避免在 Store 中存储非序列化数据

## 问题
非序列化数据（如函数、DOM 元素、类实例）会导致 SSR 和持久化问题。

## 错误示例
```ts
// stores/editor.ts
export const useEditorStore = defineStore('editor', () => {
  // 错误：存储 DOM 元素
  const editorElement = ref<HTMLElement | null>(null)

  // 错误：存储类实例
  const editorInstance = ref<EditorClass | null>(null)

  // 错误：存储函数
  const onChange = ref<(() => void) | null>(null)

  // 错误：存储 Map/Set
  const cache = ref(new Map())

  return { editorElement, editorInstance, onChange, cache }
})
```

## 正确示例
```ts
// stores/editor.ts
export const useEditorStore = defineStore('editor', () => {
  // 正确：只存储可序列化的状态
  const content = ref('')
  const isReady = ref(false)
  const config = ref<EditorConfig>({
    theme: 'dark',
    fontSize: 14
  })

  return { content, isReady, config }
})

// composables/useEditor.ts
// 非序列化对象放在 composable 中
export function useEditor() {
  const store = useEditorStore()
  const editorRef = ref<HTMLElement | null>(null)
  const instance = shallowRef<EditorClass | null>(null)

  onMounted(() => {
    if (editorRef.value) {
      instance.value = new EditorClass(editorRef.value, {
        content: store.content,
        ...store.config
      })
    }
  })

  return { editorRef, instance, store }
}
```

## 使用 skipHydrate 标记
```ts
import { skipHydrate } from 'pinia'

export const useStore = defineStore('store', () => {
  const cache = ref(new Map())

  return {
    // 标记此属性跳过 SSR hydration
    cache: skipHydrate(cache)
  }
})
```

## 原因
- SSR 时 state 需要序列化传递给客户端
- 非序列化数据无法通过 JSON.stringify
- 持久化插件（如 pinia-plugin-persistedstate）需要序列化
- 分离关注点：状态 vs 运行时对象
