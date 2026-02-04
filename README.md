# Vue3 & Nuxt4 Best Practices

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Agent Skill](https://img.shields.io/badge/Agent%20Skill-Compatible-blue)](https://github.com/anthropics/skills)

Vue3 和 Nuxt4 性能优化最佳实践，专为 AI 编码助手设计的 Agent Skill。

## 特性

- **57 条优化规则**：覆盖 SSR、数据获取、响应式、组件设计、性能优化等 8 个领域
- **优先级分类**：Critical / High / Medium / Low 四级优先级
- **实战导向**：规则来源于真实生产环境的性能优化经验
- **跨平台兼容**：支持 Claude Code、Cursor、VS Code、Windsurf 等主流 AI 编码工具

---

## 🚀 安装方式

### 方式一：使用 add-skill CLI（推荐）

```bash
# 从 GitHub 安装
npx add-skill King-GD/vue-nuxt-best-practices

# 或指定完整路径
npx add-skill github:King-GD/vue-nuxt-best-practices
```

安装时会提示选择：
- **Global（全局）**：适用于所有项目
- **Project（项目）**：仅当前项目

---

### 方式二：Claude Code 手动配置

#### 全局安装（所有项目生效）

1. 克隆仓库到本地：
```bash
git clone https://github.com/King-GD/vue-nuxt-best-practices.git ~/.claude/skills/vue-nuxt-best-practices
```

2. 编辑 `~/.claude/settings.json`：
```json
{
  "skills": [
    "~/.claude/skills/vue-nuxt-best-practices"
  ]
}
```

#### 项目级安装（仅当前项目生效）

1. 将 skill 添加到项目：
```bash
# 作为 git submodule
git submodule add https://github.com/King-GD/vue-nuxt-best-practices.git .claude/skills/vue-nuxt-best-practices

# 或直接克隆
git clone https://github.com/King-GD/vue-nuxt-best-practices.git .claude/skills/vue-nuxt-best-practices
```

2. 创建 `.claude/settings.local.json`：
```json
{
  "skills": [
    ".claude/skills/vue-nuxt-best-practices"
  ]
}
```

---

### 方式三：Cursor

将 `SKILL.md` 复制到项目的 `.cursor/rules/` 目录：

```bash
mkdir -p .cursor/rules
curl -o .cursor/rules/vue-nuxt-best-practices.md https://raw.githubusercontent.com/King-GD/vue-nuxt-best-practices/main/SKILL.md
```

或在 Cursor 设置中添加 Rules：
1. 打开 Cursor Settings → Rules
2. 添加新规则，粘贴 `SKILL.md` 内容

---

### 方式四：VS Code + Continue/Cline

将 `SKILL.md` 内容添加到 `.continuerules` 或 `.clinerules` 文件。

---

### 方式五：直接下载

```bash
# 下载单个文件
curl -O https://raw.githubusercontent.com/King-GD/vue-nuxt-best-practices/main/SKILL.md

# 下载完整仓库
git clone https://github.com/King-GD/vue-nuxt-best-practices.git
```

---

## 📖 使用效果

安装后，AI 编码助手会自动：

### 1. 代码审查
```
用户：帮我检查这段代码有什么问题

AI：我发现以下问题：
1. [CRITICAL] 第 15 行使用 $fetch 会导致数据重复获取，应使用 useFetch
2. [HIGH] 第 23 行解构 reactive 对象会丢失响应性，应使用 toRefs
3. [MEDIUM] 第 45 行的复杂表达式应该使用 computed 缓存
```

### 2. 代码生成
```
用户：帮我写一个获取用户列表的页面

AI：我会应用以下最佳实践：
- 使用 useFetch 而非 $fetch
- 并行化多个请求
- 使用 shallowRef 处理大数组
- 正确处理 loading 和 error 状态

[生成符合最佳实践的代码]
```

### 3. 重构建议
```
用户：这个组件很慢，帮我优化

AI：根据 Vue/Nuxt 最佳实践，我建议：
1. 使用 v-memo 缓存列表项
2. 使用虚拟滚动处理大列表
3. 将非关键数据改为 lazy 加载
```

---

## 📋 规则分类

| 优先级 | 分类 | 规则数 | 说明 |
|--------|------|--------|------|
| 🔴 Critical | SSR & Hydration | 8 | 必须遵循，违反会导致 bug |
| 🔴 Critical | Data Fetching | 7 | 必须遵循，影响性能和 SEO |
| 🟠 High | Reactivity | 8 | 强烈推荐，影响响应式正确性 |
| 🟠 High | Component Design | 7 | 强烈推荐，影响可维护性 |
| 🟡 Medium | Performance | 8 | 推荐，提升用户体验 |
| 🟡 Medium | State Management | 6 | 推荐，Pinia 最佳实践 |
| 🟢 Low | Bundle Optimization | 7 | 进阶，减少打包体积 |
| 🟢 Low | Nuxt Specific | 6 | 进阶，Nuxt 特有优化 |

---

## 🔧 项目结构

```
vue-nuxt-best-practices/
├── SKILL.md               # 主入口文件（AI 读取）
├── AGENTS.md              # 详细规则摘要
├── README.md              # 项目说明
├── package.json           # Skill 元数据
├── rules/                 # 详细规则文件（57 条）
│   ├── 01-ssr-hydration/
│   ├── 02-data-fetching/
│   ├── 03-reactivity/
│   ├── 04-component-design/
│   ├── 05-performance/
│   ├── 06-state-management/
│   ├── 07-bundle-optimization/
│   └── 08-nuxt-specific/
└── scripts/
    └── build.js           # 编译规则脚本
```

---

## 🛠 技术栈支持

- Vue 3.5+
- Nuxt 4.x / Nuxt 3.x
- Pinia 3.x
- VueUse
- Element Plus
- TypeScript

---

## 🤝 贡献

欢迎提交 PR 添加新规则或改进现有规则！

### 规则格式

每条规则应包含：
```markdown
---
id: category-01
title: 规则标题
priority: critical | high | medium | low
category: category-name
tags: [tag1, tag2]
---

# 规则标题

## 问题
描述这个规则要解决的问题

## 错误示例
展示错误的代码

## 正确示例
展示正确的代码

## 原因
解释为什么这样做更好
```

### 提交规则

1. Fork 本仓库
2. 在对应分类目录下创建规则文件
3. 运行 `npm run build` 更新 AGENTS.md
4. 提交 PR

---

## 📄 许可证

MIT License

---

## 🙏 致谢

- 设计理念参考 [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills)
- 感谢 [Anthropic](https://anthropic.com) 创建 Agent Skills 规范
