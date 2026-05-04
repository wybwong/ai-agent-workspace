import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/recipes' },
    { path: '/recipes', name: 'RecipeList', component: () => import('@/views/recipes/index.vue') },
    { path: '/recipes/:id/edit', name: 'RecipeEdit', component: () => import('@/views/recipes/edit.vue') },
    { path: '/ai-generate', name: 'AiGenerate', component: () => import('@/views/ai-generate/index.vue') },
    { path: '/raw-recipes', name: 'RawRecipeManage', component: () => import('@/views/raw-recipes/index.vue') },
    { path: '/prompt-templates', name: 'PromptTemplates', component: () => import('@/views/prompt-templates/index.vue') },
    { path: '/settings', name: 'Settings', component: () => import('@/views/settings/index.vue') },
  ],
})

export default router
