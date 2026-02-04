---
id: bundle-07
title: 使用外部 CDN 加载大型库
priority: low
category: bundle-optimization
tags: [bundle, cdn, external]
---

# 使用外部 CDN 加载大型库

## 问题
某些大型库（如 echarts）打包后体积较大，影响加载速度。

## 配置示例
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      script: [
        // 从 CDN 加载 echarts
        {
          src: 'https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js',
          defer: true
        }
      ]
    }
  },

  vite: {
    build: {
      rollupOptions: {
        external: ['echarts'],
        output: {
          globals: {
            echarts: 'echarts'
          }
        }
      }
    }
  }
})
```

## 使用 @nuxt/scripts
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/scripts'],
  scripts: {
    globals: {
      echarts: {
        src: 'https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js'
      }
    }
  }
})

// 组件中使用
<script setup lang="ts">
const { $script } = useScript('echarts')
await $script
// echarts 已加载
</script>
```

## 注意事项
```ts
// 1. 确保 CDN 可靠性
// 2. 考虑国内用户使用国内 CDN
// 3. 添加完整性校验
{
  src: 'https://cdn.example.com/lib.js',
  integrity: 'sha384-xxx',
  crossorigin: 'anonymous'
}

// 4. 提供 fallback
<script>
  window.echarts || document.write('<script src="/fallback/echarts.js"><\/script>')
</script>
```

## 原因
- CDN 边缘节点离用户更近
- 可能已被其他网站缓存
- 减少服务器 bundle 体积
- 适合不经常更新的大型库
