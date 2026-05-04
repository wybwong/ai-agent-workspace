import type { Recipe, Ingredient } from '@/types'
import { autoDetectTheme } from '@/constants/themes'
import { truncate } from './escape'

function parseIngredientLine(line: string): Ingredient | null {
  const cleaned = line.replace(/^[\-\•\·\*\s]+/, '').trim()
  if (!cleaned) return null

  const spaceMatch = cleaned.match(/^(.+?)\s+(.+)$/)
  if (spaceMatch) {
    return { name: truncate(spaceMatch[1].trim(), 50), amount: truncate(spaceMatch[2].trim(), 30) }
  }

  const bracketMatch = cleaned.match(/^(.+?)[（(]([^)）]+)[)）]$/)
  if (bracketMatch) {
    return { name: truncate(bracketMatch[1].trim(), 50), amount: truncate(bracketMatch[2].trim(), 30) }
  }

  return { name: truncate(cleaned, 50), amount: '' }
}

function cleanStep(line: string): string {
  return line
    .replace(/^[\d]+[\.、．。]\s*/, '')
    .replace(/^[①②③④⑤⑥⑦⑧⑨⑩]\s*/, '')
    .replace(/^第[一二三四五六七八九十]+步[：:]\s*/, '')
    .replace(/^步骤[\d]+[：:]\s*/, '')
    .trim()
}

export function parseRecipeText(text: string): Partial<Recipe> {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)

  const recipe: Partial<Recipe> = {
    title: '', age: '8', sellPoint: '', functionDesc: '',
    themeColor: '深棕色', ingredients: [], steps: [],
    rawText: truncate(text), watermarkText: '', backgroundUrl: '',
  }

  let section: 'none' | 'ingredients' | 'steps' = 'none'
  let titleSet = false

  for (const line of lines) {
    const fieldMatch = line.match(/^([^：:]{1,10})[：:]\s*(.*)$/)

    if (fieldMatch) {
      const key = fieldMatch[1].trim()
      const val = truncate(fieldMatch[2].trim())

      if (/月龄|适用/.test(key)) { recipe.age = val.replace(/[^0-9]/g, '') || '8'; section = 'none'; continue }
      if (/卖点|核心/.test(key)) { recipe.sellPoint = val; section = 'none'; continue }
      if (/功能/.test(key)) { recipe.functionDesc = val; section = 'none'; continue }
      if (/主题色|颜色/.test(key)) { recipe.themeColor = val || '深棕色'; section = 'none'; continue }
      if (/食材|原料|材料/.test(key)) {
        section = 'ingredients'
        if (val) { const ing = parseIngredientLine(val); if (ing) recipe.ingredients!.push(ing) }
        continue
      }
      if (/步骤|做法|制作/.test(key)) {
        section = 'steps'
        if (val) { const s = cleanStep(val); if (s) recipe.steps!.push(truncate(s)) }
        continue
      }
    }

    if (!titleSet && !fieldMatch) {
      recipe.title = truncate(line, 50)
      titleSet = true
      continue
    }

    if (section === 'ingredients') {
      const ing = parseIngredientLine(line)
      if (ing) recipe.ingredients!.push(ing)
    } else if (section === 'steps') {
      const s = cleanStep(line)
      if (s) recipe.steps!.push(truncate(s))
    }
  }

  if (recipe.themeColor === '深棕色' && recipe.ingredients!.length > 0) {
    const detected = autoDetectTheme(recipe.ingredients!.map(i => i.name))
    if (detected.name !== '深棕色') recipe.themeColor = detected.name
  }

  return recipe
}
