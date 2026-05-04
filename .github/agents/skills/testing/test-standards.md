# 测试编写规范

## 测试文件位置

```
src/
├── composables/
│   ├── useTable.js
│   └── useTable.test.js    # 就近放置
├── utils/
│   ├── format.js
│   └── format.test.js
└── components/
    └── BaseTable/
        ├── index.vue
        └── index.test.js
```

## 命名规范

- 文件名：`xxx.test.js`（与被测文件同名）
- 测试块：`describe('模块名', () => {})`
- 用例：`it('应该...', () => {})` — 用"应该"开头，描述预期行为

## 测试优先级

| 类型 | 优先级 | 说明 |
|------|--------|------|
| utils 工具函数 | 🔴 必须 | 纯函数，最易测试，收益最高 |
| composables | 🔴 必须 | 核心逻辑，如 useTable/useForm |
| 关键业务组件 | 🟡 建议 | 如 BaseDialog 的开关逻辑 |
| 页面组件 | 🟢 可选 | 集成测试，维护成本高 |

## 示例：工具函数测试

```js
// utils/format.test.js
import { formatDate } from './format'

describe('formatDate', () => {
  it('应该返回 YYYY-MM-DD 格式', () => {
    expect(formatDate('2026-05-04T10:00:00')).toBe('2026-05-04')
  })

  it('空值应该返回 -', () => {
    expect(formatDate(null)).toBe('-')
    expect(formatDate('')).toBe('-')
  })

  it('支持自定义格式', () => {
    expect(formatDate('2026-05-04T10:30:00', 'YYYY/MM/DD HH:mm')).toBe('2026/05/04 10:30')
  })
})
```

## 示例：composable 测试

```js
// composables/useTable.test.js
import { useTable } from './useTable'

describe('useTable', () => {
  it('初始状态应该正确', () => {
    const mockFetch = vi.fn().mockResolvedValue({ list: [], total: 0 })
    const { list, loading, pagination } = useTable(mockFetch)

    expect(list.value).toEqual([])
    expect(loading.value).toBe(false)
    expect(pagination.page).toBe(1)
  })

  it('load 后应该更新 list 和 total', async () => {
    const mockData = { list: [{ id: 1, name: '测试' }], total: 1 }
    const mockFetch = vi.fn().mockResolvedValue(mockData)
    const { list, loading, pagination, load } = useTable(mockFetch)

    await load()

    expect(list.value).toEqual(mockData.list)
    expect(pagination.total).toBe(1)
    expect(loading.value).toBe(false)
  })
})
```

## package.json 脚本

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

## 禁止事项

- ❌ 测试中依赖真实接口（使用 vi.mock 或 msw）
- ❌ 一个 it 断言超过 5 个（拆分用例）
- ❌ 测试名称写"测试1""用例2"等无意义名称
