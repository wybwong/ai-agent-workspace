import type { Recipe, RawRecipe, PromptTemplate } from '@/types'
import initSqlJs from 'sql.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let SQL: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any = null
let initialized = false
let initPromise: Promise<void> | null = null

const LS_KEY = 'recipeDb_v2'

async function loadSqlJs() {
  if (SQL) return SQL
  SQL = await initSqlJs({ locateFile: (file: string) => `${import.meta.env.BASE_URL}${file}` })
  return SQL
}

async function persistDb(): Promise<void> {
  if (!db) return
  const data: Uint8Array = db.export()
  try {
    const res = await fetch('/api/db/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: data,
    })
    if (!res.ok) throw new Error('server error')
  } catch {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(Array.from(data)))
    } catch {
      console.warn('[DB] persist failed')
    }
  }
}

async function ensureInit(): Promise<void> {
  if (initialized) return
  if (initPromise) { await initPromise; return }
  initPromise = _init()
  await initPromise
  initialized = true
}

async function _init(): Promise<void> {
  const sql = await loadSqlJs()

  try {
    const res = await fetch('/api/db/export')
    if (res.ok) {
      const buf = await res.arrayBuffer()
      db = buf.byteLength > 0 ? new sql.Database(new Uint8Array(buf)) : new sql.Database()
    } else {
      throw new Error('no file')
    }
  } catch {
    const lsData = localStorage.getItem(LS_KEY)
    if (lsData) {
      try { db = new sql.Database(new Uint8Array(JSON.parse(lsData))) } catch { db = new sql.Database() }
    } else {
      db = new sql.Database()
    }
  }

  createSchema()
  insertDefaults()
  await persistDb()
}

function createSchema() {
  db.run(`CREATE TABLE IF NOT EXISTS recipes (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    title         TEXT    NOT NULL DEFAULT '',
    age           TEXT    DEFAULT '8',
    sellPoint     TEXT    DEFAULT '',
    functionDesc  TEXT    DEFAULT '',
    themeColor    TEXT    DEFAULT '深棕色',
    ingredients   TEXT    DEFAULT '[]',
    steps         TEXT    DEFAULT '[]',
    rawText       TEXT    DEFAULT '',
    watermarkText TEXT    DEFAULT '禾禾妈妈',
    backgroundUrl TEXT    DEFAULT '',
    createdAt     DATETIME DEFAULT (datetime('now','localtime')),
    updatedAt     DATETIME DEFAULT (datetime('now','localtime'))
  )`)
  db.run(`CREATE TABLE IF NOT EXISTS raw_recipes (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT    NOT NULL DEFAULT '',
    ingredients     TEXT    DEFAULT '',
    notes           TEXT    DEFAULT '',
    status          TEXT    DEFAULT 'draft',
    relatedRecipeId INTEGER,
    createdAt       DATETIME DEFAULT (datetime('now','localtime')),
    updatedAt       DATETIME DEFAULT (datetime('now','localtime'))
  )`)
  db.run(`CREATE TABLE IF NOT EXISTS prompt_templates (
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
    name                 TEXT    DEFAULT '',
    system_prompt        TEXT    DEFAULT '',
    user_prompt_template TEXT    DEFAULT '',
    variables            TEXT    DEFAULT '[]',
    created_at           DATETIME DEFAULT (datetime('now','localtime')),
    updated_at           DATETIME DEFAULT (datetime('now','localtime'))
  )`)
  db.run(`CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT DEFAULT ''
  )`)
}

function insertDefaults() {
  const defaults = [
    ['watermarkText', '禾禾妈妈'],
    ['aiApiKey', ''],
    ['aiApiUrl', 'https://api.openai.com/v1/chat/completions'],
    ['aiModel', 'gpt-4o-mini'],
  ]
  for (const [k, v] of defaults) {
    db.run('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)', [k, v])
  }
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function queryAll(sql: string, params: unknown[] = []): Record<string, unknown>[] {
  const stmt = db.prepare(sql)
  stmt.bind(params)
  const rows: Record<string, unknown>[] = []
  while (stmt.step()) rows.push(stmt.getAsObject())
  stmt.free()
  return rows
}

function queryOne(sql: string, params: unknown[] = []): Record<string, unknown> | null {
  const stmt = db.prepare(sql)
  stmt.bind(params)
  if (stmt.step()) { const o = stmt.getAsObject(); stmt.free(); return o }
  stmt.free()
  return null
}

function safeJson<T>(val: unknown, fallback: T): T {
  try { return JSON.parse(val as string) as T } catch { return fallback }
}

// ─── recipes ─────────────────────────────────────────────────────────────────

function toRecipe(row: Record<string, unknown>): Recipe {
  return {
    id:           row.id as number,
    title:        (row.title as string) || '',
    age:          (row.age as string) || '8',
    sellPoint:    (row.sellPoint as string) || '',
    functionDesc: (row.functionDesc as string) || '',
    themeColor:   (row.themeColor as string) || '深棕色',
    ingredients:  safeJson(row.ingredients, []),
    steps:        safeJson(row.steps, []),
    rawText:      (row.rawText as string) || '',
    watermarkText:(row.watermarkText as string) || '禾禾妈妈',
    backgroundUrl:(row.backgroundUrl as string) || '',
    createdAt:    row.createdAt as string,
    updatedAt:    row.updatedAt as string,
  }
}

export async function getAllRecipes(): Promise<Recipe[]> {
  await ensureInit()
  return queryAll('SELECT * FROM recipes ORDER BY id DESC').map(toRecipe)
}

export async function getRecipeById(id: number): Promise<Recipe | null> {
  await ensureInit()
  const row = queryOne('SELECT * FROM recipes WHERE id = ?', [id])
  return row ? toRecipe(row) : null
}

export async function createRecipe(r: Omit<Recipe, 'id'>): Promise<number> {
  await ensureInit()
  const wm = r.watermarkText || await getSetting('watermarkText') || '禾禾妈妈'
  db.run(
    `INSERT INTO recipes (title,age,sellPoint,functionDesc,themeColor,ingredients,steps,rawText,watermarkText,backgroundUrl)
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [r.title, r.age || '8', r.sellPoint || '', r.functionDesc || '', r.themeColor || '深棕色',
      JSON.stringify(r.ingredients || []), JSON.stringify(r.steps || []),
      r.rawText || '', wm, r.backgroundUrl || ''],
  )
  const row = queryOne('SELECT last_insert_rowid() as id')
  const id = row!.id as number
  await persistDb()
  return id
}

export async function updateRecipe(id: number, r: Partial<Recipe>): Promise<void> {
  await ensureInit()
  const fields: string[] = []
  const vals: unknown[] = []
  const map: Record<string, unknown> = {
    title: r.title, age: r.age, sellPoint: r.sellPoint,
    functionDesc: r.functionDesc, themeColor: r.themeColor,
    ingredients: r.ingredients !== undefined ? JSON.stringify(r.ingredients) : undefined,
    steps: r.steps !== undefined ? JSON.stringify(r.steps) : undefined,
    rawText: r.rawText, watermarkText: r.watermarkText, backgroundUrl: r.backgroundUrl,
  }
  for (const [k, v] of Object.entries(map)) {
    if (v !== undefined) { fields.push(`${k} = ?`); vals.push(v) }
  }
  if (!fields.length) return
  fields.push(`updatedAt = datetime('now','localtime')`)
  vals.push(id)
  db.run(`UPDATE recipes SET ${fields.join(', ')} WHERE id = ?`, vals)
  await persistDb()
}

export async function deleteRecipe(id: number): Promise<void> {
  await ensureInit()
  db.run('DELETE FROM recipes WHERE id = ?', [id])
  db.run('UPDATE raw_recipes SET relatedRecipeId = NULL WHERE relatedRecipeId = ?', [id])
  await persistDb()
}

// ─── raw_recipes ─────────────────────────────────────────────────────────────

function toRaw(row: Record<string, unknown>): RawRecipe {
  return {
    id:              row.id as number,
    name:            (row.name as string) || '',
    ingredients:     (row.ingredients as string) || '',
    notes:           (row.notes as string) || '',
    status:          ((row.status as string) || 'draft') as 'draft' | 'analyzed',
    relatedRecipeId: row.relatedRecipeId as number | undefined,
    createdAt:       row.createdAt as string,
    updatedAt:       row.updatedAt as string,
  }
}

export async function getAllRawRecipes(): Promise<RawRecipe[]> {
  await ensureInit()
  return queryAll('SELECT * FROM raw_recipes ORDER BY id DESC').map(toRaw)
}

export async function createRawRecipe(r: Omit<RawRecipe, 'id'>): Promise<number> {
  await ensureInit()
  db.run(
    'INSERT INTO raw_recipes (name,ingredients,notes,status,relatedRecipeId) VALUES (?,?,?,?,?)',
    [r.name, r.ingredients || '', r.notes || '', r.status || 'draft', r.relatedRecipeId || null],
  )
  const row = queryOne('SELECT last_insert_rowid() as id')
  const id = row!.id as number
  await persistDb()
  return id
}

export async function updateRawRecipe(id: number, r: Partial<RawRecipe>): Promise<void> {
  await ensureInit()
  const fields: string[] = []
  const vals: unknown[] = []
  const map: Record<string, unknown> = {
    name: r.name, ingredients: r.ingredients, notes: r.notes,
    status: r.status, relatedRecipeId: r.relatedRecipeId,
  }
  for (const [k, v] of Object.entries(map)) {
    if (v !== undefined) { fields.push(`${k} = ?`); vals.push(v) }
  }
  if (!fields.length) return
  fields.push(`updatedAt = datetime('now','localtime')`)
  vals.push(id)
  db.run(`UPDATE raw_recipes SET ${fields.join(', ')} WHERE id = ?`, vals)
  await persistDb()
}

export async function deleteRawRecipe(id: number): Promise<void> {
  await ensureInit()
  db.run('DELETE FROM raw_recipes WHERE id = ?', [id])
  await persistDb()
}

// ─── prompt_templates ────────────────────────────────────────────────────────

function toTpl(row: Record<string, unknown>): PromptTemplate {
  return {
    id:                 row.id as number,
    name:               (row.name as string) || '',
    systemPrompt:       (row.system_prompt as string) || '',
    userPromptTemplate: (row.user_prompt_template as string) || '',
    variables:          safeJson(row.variables, []),
    createdAt:          row.created_at as string,
    updatedAt:          row.updated_at as string,
  }
}

export async function getAllPromptTemplates(): Promise<PromptTemplate[]> {
  await ensureInit()
  return queryAll('SELECT * FROM prompt_templates ORDER BY id DESC').map(toTpl)
}

export async function createPromptTemplate(t: Omit<PromptTemplate, 'id'>): Promise<number> {
  await ensureInit()
  db.run(
    'INSERT INTO prompt_templates (name,system_prompt,user_prompt_template,variables) VALUES (?,?,?,?)',
    [t.name, t.systemPrompt, t.userPromptTemplate, JSON.stringify(t.variables || [])],
  )
  const row = queryOne('SELECT last_insert_rowid() as id')
  const id = row!.id as number
  await persistDb()
  return id
}

export async function updatePromptTemplate(id: number, t: Partial<PromptTemplate>): Promise<void> {
  await ensureInit()
  const fields: string[] = []
  const vals: unknown[] = []
  if (t.name !== undefined) { fields.push('name = ?'); vals.push(t.name) }
  if (t.systemPrompt !== undefined) { fields.push('system_prompt = ?'); vals.push(t.systemPrompt) }
  if (t.userPromptTemplate !== undefined) { fields.push('user_prompt_template = ?'); vals.push(t.userPromptTemplate) }
  if (t.variables !== undefined) { fields.push('variables = ?'); vals.push(JSON.stringify(t.variables)) }
  if (!fields.length) return
  fields.push(`updated_at = datetime('now','localtime')`)
  vals.push(id)
  db.run(`UPDATE prompt_templates SET ${fields.join(', ')} WHERE id = ?`, vals)
  await persistDb()
}

export async function deletePromptTemplate(id: number): Promise<void> {
  await ensureInit()
  db.run('DELETE FROM prompt_templates WHERE id = ?', [id])
  await persistDb()
}

// ─── settings ────────────────────────────────────────────────────────────────

export async function getSetting(key: string): Promise<string> {
  await ensureInit()
  const row = queryOne('SELECT value FROM settings WHERE key = ?', [key])
  return (row?.value as string) || ''
}

export async function setSetting(key: string, value: string): Promise<void> {
  await ensureInit()
  db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, value])
  await persistDb()
}

export async function getAllSettings(): Promise<Record<string, string>> {
  await ensureInit()
  const rows = queryAll('SELECT key, value FROM settings')
  return Object.fromEntries(rows.map(r => [r.key as string, r.value as string]))
}

export const dbService = {
  init: ensureInit,
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getAllRawRecipes,
  createRawRecipe,
  updateRawRecipe,
  deleteRawRecipe,
  getAllPromptTemplates,
  createPromptTemplate,
  updatePromptTemplate,
  deletePromptTemplate,
  getSetting,
  setSetting,
  getAllSettings,
}
