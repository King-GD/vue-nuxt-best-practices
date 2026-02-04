import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const RULES_DIR = './rules'
const OUTPUT_FILE = './AGENTS.md'

interface RuleMeta {
  id: string
  title: string
  priority: string
  category: string
  tags: string[]
}

interface Rule {
  meta: RuleMeta
  content: string
}

function parseFrontmatter(content: string): { meta: Partial<RuleMeta>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) {
    return { meta: {}, body: content }
  }

  const frontmatter = match[1]
  const body = match[2]

  const meta: Partial<RuleMeta> = {}
  frontmatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':')
    if (key && valueParts.length) {
      const value = valueParts.join(':').trim()
      if (key === 'tags') {
        meta.tags = value.replace(/[\[\]]/g, '').split(',').map(t => t.trim())
      } else {
        (meta as any)[key.trim()] = value
      }
    }
  })

  return { meta, body }
}

function getCategoryOrder(category: string): number {
  const order: Record<string, number> = {
    'ssr-hydration': 1,
    'data-fetching': 2,
    'reactivity': 3,
    'component-design': 4,
    'performance': 5,
    'state-management': 6,
    'bundle-optimization': 7,
    'nuxt-specific': 8
  }
  return order[category] || 99
}

function getPriorityOrder(priority: string): number {
  const order: Record<string, number> = {
    'critical': 1,
    'high': 2,
    'medium': 3,
    'low': 4
  }
  return order[priority] || 99
}

function collectRules(): Rule[] {
  const rules: Rule[] = []
  const categories = readdirSync(RULES_DIR)

  for (const category of categories) {
    const categoryPath = join(RULES_DIR, category)
    const files = readdirSync(categoryPath).filter(f => f.endsWith('.md'))

    for (const file of files) {
      const filePath = join(categoryPath, file)
      const content = readFileSync(filePath, 'utf-8')
      const { meta, body } = parseFrontmatter(content)

      rules.push({
        meta: meta as RuleMeta,
        content: body.trim()
      })
    }
  }

  // Sort by category, then by priority
  rules.sort((a, b) => {
    const catDiff = getCategoryOrder(a.meta.category) - getCategoryOrder(b.meta.category)
    if (catDiff !== 0) return catDiff
    return getPriorityOrder(a.meta.priority) - getPriorityOrder(b.meta.priority)
  })

  return rules
}

function generateAgentsMd(rules: Rule[]): string {
  const lines: string[] = []

  lines.push('# Vue3 & Nuxt4 Best Practices')
  lines.push('')
  lines.push('> 57 performance optimization rules for Vue3 and Nuxt4 applications.')
  lines.push('> Designed for AI coding agents to automatically apply best practices.')
  lines.push('')
  lines.push('## Categories')
  lines.push('')
  lines.push('| Priority | Category | Rules |')
  lines.push('|----------|----------|-------|')
  lines.push('| Critical | SSR & Hydration | 8 |')
  lines.push('| Critical | Data Fetching | 7 |')
  lines.push('| High | Reactivity | 8 |')
  lines.push('| High | Component Design | 7 |')
  lines.push('| Medium | Performance | 8 |')
  lines.push('| Medium | State Management | 6 |')
  lines.push('| Low | Bundle Optimization | 7 |')
  lines.push('| Low | Nuxt Specific | 6 |')
  lines.push('')
  lines.push('---')
  lines.push('')

  let currentCategory = ''

  for (const rule of rules) {
    if (rule.meta.category !== currentCategory) {
      currentCategory = rule.meta.category
      const categoryTitle = currentCategory
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
      lines.push(`## ${categoryTitle}`)
      lines.push('')
    }

    lines.push(`### [${rule.meta.priority.toUpperCase()}] ${rule.meta.title}`)
    lines.push('')
    lines.push(rule.content)
    lines.push('')
    lines.push('---')
    lines.push('')
  }

  return lines.join('\n')
}

// Main
const rules = collectRules()
const content = generateAgentsMd(rules)
writeFileSync(OUTPUT_FILE, content, 'utf-8')

console.log(`Generated ${OUTPUT_FILE} with ${rules.length} rules`)
