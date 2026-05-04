export interface Ingredient {
  name: string
  amount: string
}

export interface Recipe {
  id?: number
  title: string
  age: string
  sellPoint: string
  functionDesc: string
  themeColor: string
  ingredients: Ingredient[]
  steps: string[]
  rawText: string
  watermarkText: string
  backgroundUrl: string
  createdAt?: string
  updatedAt?: string
}

export interface RawRecipe {
  id?: number
  name: string
  ingredients: string
  notes: string
  status: 'draft' | 'analyzed'
  relatedRecipeId?: number
  createdAt?: string
  updatedAt?: string
}

export interface PromptTemplate {
  id?: number
  name: string
  systemPrompt: string
  userPromptTemplate: string
  variables: string[]
  createdAt?: string
  updatedAt?: string
}

export interface ThemeColor {
  name: string
  value: string
  gradient: string
  keywords: string[]
}
