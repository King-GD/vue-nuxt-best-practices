# Vue3 & Nuxt4 Best Practices

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Agent Skill](https://img.shields.io/badge/Agent%20Skill-Compatible-blue)](https://github.com/anthropics/skills)

Performance optimization best practices for Vue3 and Nuxt4, designed as an Agent Skill for AI coding assistants.

## Features

- **57 Optimization Rules**: Covering 8 areas including SSR, data fetching, reactivity, component design, and performance optimization
- **Priority Classification**: Four priority levels - Critical / High / Medium / Low
- **Production-Ready**: Rules derived from real-world production environment optimization experience
- **Cross-Platform Compatible**: Supports mainstream AI coding tools including Claude Code, Cursor, VS Code, Windsurf, and more

---

## 🚀 Installation

### Option 1: Using add-skill CLI (Recommended)

```bash
# Install from GitHub
npx add-skill King-GD/vue-nuxt-best-practices

# Or specify the full path
npx add-skill github:King-GD/vue-nuxt-best-practices
```

During installation, you'll be prompted to choose:
- **Global**: Applies to all projects
- **Project**: Current project only

---

### Option 2: Claude Code Manual Configuration

#### Global Installation (Applies to All Projects)

1. Clone the repository locally:
```bash
git clone https://github.com/King-GD/vue-nuxt-best-practices.git ~/.claude/skills/vue-nuxt-best-practices
```

2. Edit `~/.claude/settings.json`:
```json
{
  "skills": [
    "~/.claude/skills/vue-nuxt-best-practices"
  ]
}
```

#### Project-Level Installation (Current Project Only)

1. Add the skill to your project:
```bash
# As a git submodule
git submodule add https://github.com/King-GD/vue-nuxt-best-practices.git .claude/skills/vue-nuxt-best-practices

# Or clone directly
git clone https://github.com/King-GD/vue-nuxt-best-practices.git .claude/skills/vue-nuxt-best-practices
```

2. Create `.claude/settings.local.json`:
```json
{
  "skills": [
    ".claude/skills/vue-nuxt-best-practices"
  ]
}
```

---

### Option 3: Cursor

Copy `SKILL.md` to your project's `.cursor/rules/` directory:

```bash
mkdir -p .cursor/rules
curl -o .cursor/rules/vue-nuxt-best-practices.md https://raw.githubusercontent.com/King-GD/vue-nuxt-best-practices/main/SKILL.md
```

Or add Rules in Cursor settings:
1. Open Cursor Settings → Rules
2. Add a new rule and paste the contents of `SKILL.md`

---

### Option 4: VS Code + Continue/Cline

Add the contents of `SKILL.md` to your `.continuerules` or `.clinerules` file.

---

### Option 5: Direct Download

```bash
# Download a single file
curl -O https://raw.githubusercontent.com/King-GD/vue-nuxt-best-practices/main/SKILL.md

# Download the complete repository
git clone https://github.com/King-GD/vue-nuxt-best-practices.git
```

---

## 📖 Usage Examples

After installation, your AI coding assistant will automatically:

### 1. Code Review
```
User: Help me check what's wrong with this code

AI: I found the following issues:
1. [CRITICAL] Line 15 uses $fetch which causes duplicate data fetching, should use useFetch
2. [HIGH] Line 23 destructures a reactive object which loses reactivity, should use toRefs
3. [MEDIUM] The complex expression on line 45 should be cached using computed
```

### 2. Code Generation
```
User: Help me write a page to fetch and display a user list

AI: I will apply the following best practices:
- Use useFetch instead of $fetch
- Parallelize multiple requests
- Use shallowRef for large arrays
- Properly handle loading and error states

[Generates code following best practices]
```

### 3. Refactoring Suggestions
```
User: This component is slow, help me optimize it

AI: Based on Vue/Nuxt best practices, I suggest:
1. Use v-memo to cache list items
2. Use virtual scrolling for large lists
3. Change non-critical data to lazy loading
```

---

## 📋 Rule Categories

| Priority | Category | Rules | Description |
|----------|----------|-------|-------------|
| 🔴 Critical | SSR & Hydration | 8 | Must follow, violations cause bugs |
| 🔴 Critical | Data Fetching | 7 | Must follow, affects performance and SEO |
| 🟠 High | Reactivity | 8 | Strongly recommended, affects reactivity correctness |
| 🟠 High | Component Design | 7 | Strongly recommended, affects maintainability |
| 🟡 Medium | Performance | 8 | Recommended, improves user experience |
| 🟡 Medium | State Management | 6 | Recommended, Pinia best practices |
| 🟢 Low | Bundle Optimization | 7 | Advanced, reduces bundle size |
| 🟢 Low | Nuxt Specific | 6 | Advanced, Nuxt-specific optimizations |

---

## 🔧 Project Structure

```
vue-nuxt-best-practices/
├── SKILL.md               # Main entry file (read by AI)
├── AGENTS.md              # Detailed rules summary
├── README.md              # Project documentation
├── package.json           # Skill metadata
├── rules/                 # Detailed rule files (57 rules)
│   ├── 01-ssr-hydration/
│   ├── 02-data-fetching/
│   ├── 03-reactivity/
│   ├── 04-component-design/
│   ├── 05-performance/
│   ├── 06-state-management/
│   ├── 07-bundle-optimization/
│   └── 08-nuxt-specific/
└── scripts/
    └── build.js           # Build rules script
```

---

## 🛠 Tech Stack Support

- Vue 3.5+
- Nuxt 4.x / Nuxt 3.x
- Pinia 3.x
- VueUse
- Element Plus
- TypeScript

---

## 🤝 Contributing

PRs are welcome to add new rules or improve existing ones!

### Rule Format

Each rule should include:
```markdown
---
id: category-01
title: Rule Title
priority: critical | high | medium | low
category: category-name
tags: [tag1, tag2]
---

# Rule Title

## Problem
Describe the problem this rule addresses

## Bad Example
Show incorrect code

## Good Example
Show correct code

## Why
Explain why this approach is better
```

### Submission Guidelines

1. Fork this repository
2. Create a rule file in the appropriate category directory
3. Run `npm run build` to update AGENTS.md
4. Submit a PR

---

## 📄 License

MIT License

---

## 🙏 Acknowledgments

- Design concept inspired by [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills)
- Thanks to [Anthropic](https://anthropic.com) for creating the Agent Skills specification
