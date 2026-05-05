<template>
  <div class="poster-wrapper">
    <div ref="posterRef" class="poster" :style="posterStyle">
      <!-- 顶部装饰线 -->
      <div class="deco-line" :style="{ background: theme.gradient }" />

      <!-- 顶部作者水印行 -->
      <div class="top-watermark">
        <span>{{ recipe.watermarkText }} © {{ currentYear }}</span>
      </div>

      <!-- 对角水印层 -->
      <div class="diagonal-watermarks" aria-hidden="true">
        <span
          v-for="i in 15"
          :key="i"
          class="diagonal-item"
          :style="diagonalWatermarkStyle(i)"
        >{{ recipe.watermarkText }}</span>
      </div>

      <!-- 主内容 -->
      <div class="poster-body">
        <!-- 月龄徽章 + 标题 -->
        <div class="header-block">
          <span class="age-badge" :style="{ background: theme.gradient }">{{ recipe.age }}</span>
          <h1 class="recipe-title">{{ recipe.title }}</h1>
        </div>

        <!-- 卖点 + 功效 -->
        <div class="tags-block">
          <span class="tag sell-point" :style="{ borderColor: theme.value, color: theme.value }">
            ✦ {{ recipe.sellPoint }}
          </span>
          <span class="tag function-desc">{{ recipe.functionDesc }}</span>
        </div>

        <!-- 食材网格 -->
        <section class="section">
          <div class="section-title" :style="{ color: theme.value }">
            <span class="title-bar" :style="{ background: theme.gradient }" />
            食材清单
          </div>
          <div class="ingredients-grid">
            <div
              v-for="(item, idx) in recipe.ingredients"
              :key="idx"
              class="ingredient-card"
            >
              <span class="ing-name">{{ item.name }}</span>
              <span class="ing-amount" :style="{ color: theme.value }">{{ item.amount }}</span>
            </div>
          </div>
        </section>

        <!-- 步骤时间轴 -->
        <section class="section">
          <div class="section-title" :style="{ color: theme.value }">
            <span class="title-bar" :style="{ background: theme.gradient }" />
            制作步骤
          </div>
          <div class="steps-list">
            <div
              v-for="(step, idx) in recipe.steps"
              :key="idx"
              class="step-item"
            >
              <span class="step-num" :style="{ background: theme.gradient }">{{ idx + 1 }}</span>
              <div class="step-line" v-if="idx < recipe.steps.length - 1" />
              <p class="step-text">{{ step }}</p>
            </div>
          </div>
        </section>
      </div>

      <!-- 底部品牌语 + 印章 -->
      <div class="footer-block">
        <div class="brand-slogan">用心做辅食 · 让爱有滋味</div>
        <div class="stamp" :style="{ borderColor: theme.value, color: theme.value }">
          {{ recipe.watermarkText }}
        </div>
      </div>

      <!-- 底部装饰线 -->
      <div class="deco-line bottom" :style="{ background: theme.gradient }" />
    </div>

    <!-- 导出按钮（不渲染在海报内） -->
    <div class="export-bar">
      <el-button
        type="primary"
        :style="{ background: theme.value, borderColor: theme.value }"
        :loading="isExporting"
        @click="handleExport"
      >
        <el-icon><Download /></el-icon>
        导出 PNG
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import domtoimage from 'dom-to-image-more'
import type { Recipe } from '@/types'
import { getThemeByName, DEFAULT_THEME } from '@/constants/themes'

const props = defineProps({
  recipe: {
    type: Object as () => Recipe,
    required: true,
  },
})

const posterRef = ref<HTMLElement | null>(null)
const isExporting = ref(false)
const currentYear = new Date().getFullYear()

const theme = computed(() => {
  return props.recipe.themeColor ? getThemeByName(props.recipe.themeColor) : DEFAULT_THEME
})

const posterStyle = computed(() => ({
  '--poster-color': theme.value.value,
  '--poster-gradient': theme.value.gradient,
}))

function diagonalWatermarkStyle(i: number) {
  const row = Math.floor((i - 1) / 3)
  const col = (i - 1) % 3
  return {
    position: 'absolute' as const,
    top: `${row * 30 + 10}%`,
    left: `${col * 34 + 5}%`,
    transform: 'rotate(-18deg)',
    opacity: 0.13,
    whiteSpace: 'nowrap' as const,
    fontSize: '13px',
    color: theme.value.value,
    pointerEvents: 'none' as const,
    userSelect: 'none' as const,
  }
}

async function handleExport() {
  if (!posterRef.value) return
  isExporting.value = true
  try {
    const dataUrl = await domtoimage.toPng(posterRef.value, { scale: 3 })
    const link = document.createElement('a')
    link.download = `${props.recipe.title || '辅食海报'}.png`
    link.href = dataUrl
    link.click()
    ElMessage.success('导出成功')
  } catch {
    ElMessage.error('导出失败，请重试')
  } finally {
    isExporting.value = false
  }
}

defineExpose({ handleExport })
</script>

<style scoped lang="scss">
.poster-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.poster {
  position: relative;
  width: 375px;
  background: #fffdf9;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.deco-line {
  height: 5px;
  width: 100%;

  &.bottom {
    margin-top: 0;
  }
}

.top-watermark {
  text-align: center;
  font-size: 10px;
  color: #bbb;
  padding: 4px 0;
  letter-spacing: 1px;
}

.diagonal-watermarks {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.poster-body {
  padding: 12px 20px 8px;
}

.header-block {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.age-badge {
  flex-shrink: 0;
  padding: 3px 10px;
  border-radius: 20px;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.recipe-title {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  line-height: 1.3;
}

.tags-block {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}

.tag {
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 12px;

  &.sell-point {
    border: 1px solid;
    background: transparent;
  }

  &.function-desc {
    background: #f5f5f5;
    color: #666;
  }
}

.section {
  margin-bottom: 14px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}

.title-bar {
  display: inline-block;
  width: 4px;
  height: 14px;
  border-radius: 2px;
}

.ingredients-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.ingredient-card {
  background: #fafafa;
  border-radius: 6px;
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border: 1px solid #f0f0f0;
}

.ing-name {
  font-size: 12px;
  color: #333;
  font-weight: 500;
}

.ing-amount {
  font-size: 11px;
  font-weight: 600;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.step-item {
  display: grid;
  grid-template-columns: 22px 1fr;
  grid-template-rows: auto auto;
  column-gap: 10px;
  align-items: start;
}

.step-num {
  grid-row: 1;
  grid-column: 1;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-line {
  grid-row: 2;
  grid-column: 1;
  width: 2px;
  height: 10px;
  background: #e0e0e0;
  margin: 2px auto 0;
}

.step-text {
  grid-row: 1 / 3;
  grid-column: 2;
  font-size: 12px;
  color: #444;
  line-height: 1.6;
  padding: 2px 0 8px;
}

.footer-block {
  padding: 8px 20px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-slogan {
  font-size: 11px;
  color: #999;
  letter-spacing: 1px;
}

.stamp {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  text-align: center;
  line-height: 1.2;
  padding: 4px;
  transform: rotate(-12deg);
}

.export-bar {
  display: flex;
  justify-content: center;
}
</style>
