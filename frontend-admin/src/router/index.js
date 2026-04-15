import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/login', name: 'Login', component: () => import('@/views/LoginView.vue'), meta: { public: true } },
  {
    path: '/',
    component: () => import('@/views/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/DashboardView.vue') },
      { path: 'messages', name: 'Messages', component: () => import('@/views/MessagesView.vue') },
      { path: 'portfolio', name: 'Portfolio', component: () => import('@/views/PortfolioView.vue') },
      { path: 'projects', name: 'Projects', component: () => import('@/views/ProjectsView.vue') },
      { path: 'experiences', name: 'Experiences', component: () => import('@/views/ExperiencesView.vue') },
      { path: 'education', name: 'Education', component: () => import('@/views/EducationView.vue') },
      { path: 'skills', name: 'Skills', component: () => import('@/views/SkillsView.vue') },
      { path: 'socials', name: 'Socials', component: () => import('@/views/SocialsView.vue') },
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth) {
    const valid = await auth.verify()
    if (!valid) return { name: 'Login' }
  }
  if (to.meta.public && auth.token) return { path: '/dashboard' }
})

export default router
