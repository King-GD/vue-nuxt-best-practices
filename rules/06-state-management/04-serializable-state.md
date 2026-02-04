---
id: state-04
title: Avoid Storing Non-Serializable Data in Store
priority: medium
category: state-management
tags: [pinia, serialization, ssr]
---

# Avoid Storing Non-Serializable Data in Store

## Problem
Non-serializable data (like functions, DOM elements, class instances) causes SSR and persistence issues.

## Bad Example
```ts
// stores/editor.ts
export const useEditorStore = defineStore('editor', () => {
  // Bad: Storing DOM element
  const editorElement = ref<HTMLElement | null>(null)

  // Bad: Storing class instance
  const editorInstance = ref<EditorClass | null>(null)

  // Bad: Storing function
  const onChange = ref<(() => void) | null>(null)

  // Bad: Storing Map/Set
  const cache = ref(new Map())

  return { editorElement, editorInstance, onChange, cache }
})
```

## Good Example
```ts
// stores/editor.ts
export const useEditorStore = defineStore('editor', () => {
  // Correct: Only store serializable state
  const content = ref('')
  const isReady = ref(false)
  const config = ref<EditorConfig>({
    theme: 'dark',
    fontSize: 14
  })

  return { content, isReady, config }
})

// composables/useEditor.ts
// Non-serializable objects go in composable
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

## Using skipHydrate Marker
```ts
import { skipHydrate } from 'pinia'

export const useStore = defineStore('store', () => {
  const cache = ref(new Map())

  return {
    // Mark this property to skip SSR hydration
    cache: skipHydrate(cache)
  }
})
```

## Why
- State needs to be serialized for SSR transfer to client
- Non-serializable data cannot go through JSON.stringify
- Persistence plugins (like pinia-plugin-persistedstate) require serialization
- Separation of concerns: state vs runtime objects
