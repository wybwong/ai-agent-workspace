import type { ThemeColor } from '@/types'

export const THEME_COLORS: ThemeColor[] = [
  { name: '玫红色', value: '#D43f6b', gradient: 'linear-gradient(135deg, #D43f6b 0%, #e8698a 100%)', keywords: ['火龙果', '草莓'] },
  { name: '红色', value: '#D0494C', gradient: 'linear-gradient(135deg, #D0494C 0%, #e07173 100%)', keywords: ['番茄', '红枣', '山楂'] },
  { name: '深粉色', value: '#C44569', gradient: 'linear-gradient(135deg, #C44569 0%, #d97088 100%)', keywords: ['红心火龙果'] },
  { name: '深绿色', value: '#2E7D64', gradient: 'linear-gradient(135deg, #2E7D64 0%, #4aa888 100%)', keywords: ['西兰花', '菠菜'] },
  { name: '薄荷绿', value: '#5C9E7C', gradient: 'linear-gradient(135deg, #5C9E7C 0%, #82c4a2 100%)', keywords: ['豌豆', '芦笋'] },
  { name: '橙色', value: '#E68A2E', gradient: 'linear-gradient(135deg, #E68A2E 0%, #f0ad60 100%)', keywords: ['南瓜', '胡萝卜'] },
  { name: '暖黄色', value: '#E7B42C', gradient: 'linear-gradient(135deg, #E7B42C 0%, #f0ce6e 100%)', keywords: ['玉米', '蛋黄'] },
  { name: '深紫色', value: '#7B4B8A', gradient: 'linear-gradient(135deg, #7B4B8A 0%, #a272b0 100%)', keywords: ['紫薯', '紫米'] },
  { name: '淡紫色', value: '#B794C4', gradient: 'linear-gradient(135deg, #B794C4 0%, #d0b8db 100%)', keywords: ['山药', '芋头'] },
  { name: '蓝紫色', value: '#6B7FA8', gradient: 'linear-gradient(135deg, #6B7FA8 0%, #95a7c8 100%)', keywords: ['蓝莓', '紫甘蓝'] },
  { name: '咖啡色', value: '#A16B4A', gradient: 'linear-gradient(135deg, #A16B4A 0%, #c4957a 100%)', keywords: ['芝麻酱', '肉松'] },
  { name: '深棕色', value: '#8B5A2B', gradient: 'linear-gradient(135deg, #8B5A2B 0%, #b07d52 100%)', keywords: ['黑芝麻', '可可'] },
]

export const DEFAULT_THEME = THEME_COLORS[11]

export function getThemeByName(name: string): ThemeColor {
  return THEME_COLORS.find(t => t.name === name) || DEFAULT_THEME
}

export function autoDetectTheme(ingredientNames: string[]): ThemeColor {
  const text = ingredientNames.join('')
  for (const t of THEME_COLORS) {
    if (t.keywords.some(kw => text.includes(kw))) return t
  }
  return DEFAULT_THEME
}
