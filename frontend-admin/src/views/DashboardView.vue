<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-2xl font-bold font-orbitron text-white">
        <span class="text-cyan-400 neon-text">DASH</span>BOARD
      </h2>
      <p class="text-gray-500 font-exo text-sm mt-1">Welcome back, {{ auth.admin?.email }}</p>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard v-for="stat in stats" :key="stat.label" v-bind="stat" />
    </div>

    <!-- Recent messages -->
    <div class="card-glass rounded-2xl overflow-hidden">
      <div class="flex items-center justify-between px-6 py-4 border-b border-cyan-400/20">
        <h3 class="text-white font-orbitron text-sm font-bold">RECENT MESSAGES</h3>
        <RouterLink to="/messages" class="text-cyan-400 text-xs font-exo hover:underline">View all →</RouterLink>
      </div>
      <div v-if="messagesStore.loading" class="flex justify-center py-10">
        <div class="loading-spinner" />
      </div>
      <div v-else-if="recentMessages.length === 0" class="py-10 text-center text-gray-600 font-exo text-sm">
        No messages yet. Share your portfolio link to start receiving messages!
      </div>
      <div v-else>
        <div v-for="msg in recentMessages" :key="msg.id"
          class="flex items-start gap-4 px-6 py-4 border-b border-cyan-400/5 hover:bg-white/5 transition-colors">
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400/20 to-fuchsia-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 font-bold text-sm flex-shrink-0">
            {{ msg.sender_name[0].toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p :class="['text-sm font-exo', !msg.is_read ? 'text-white font-semibold' : 'text-gray-300']">{{ msg.sender_name }}</p>
              <span v-if="!msg.is_read" class="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
            </div>
            <p class="text-gray-500 text-xs font-exo truncate">{{ msg.message }}</p>
          </div>
          <p class="text-gray-600 text-xs font-exo flex-shrink-0">{{ formatDate(msg.created_at) }}</p>
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div>
      <h3 class="text-gray-500 font-orbitron text-xs tracking-widest uppercase mb-4">Quick Actions</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <RouterLink v-for="action in quickActions" :key="action.to" :to="action.to"
          class="card-glass rounded-xl p-4 hover:border-cyan-400/40 transition-all group text-center cursor-pointer">
          <span class="text-2xl block mb-2">{{ action.icon }}</span>
          <p class="text-gray-400 group-hover:text-cyan-400 text-xs font-exo transition-colors">{{ action.label }}</p>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, defineComponent } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMessagesStore } from '@/stores/messages'
import { usePortfolioStore } from '@/stores/portfolio'

const auth = useAuthStore()
const messagesStore = useMessagesStore()
const portfolioStore = usePortfolioStore()

const recentMessages = computed(() => messagesStore.messages.slice(0, 5))

const stats = computed(() => [
  { label: 'Total Messages', value: messagesStore.messages.length, accent: 'cyan', icon: '✉' },
  { label: 'Unread', value: messagesStore.unreadCount, accent: 'fuchsia', icon: '🔔' },
  { label: 'Projects', value: portfolioStore.projects.length, accent: 'cyan', icon: '🚀' },
  { label: 'Experiences', value: portfolioStore.experiences.length, accent: 'fuchsia', icon: '💼' },
])

const quickActions = [
  { to: '/portfolio', icon: '👤', label: 'Edit Profile' },
  { to: '/projects', icon: '🚀', label: 'Projects' },
  { to: '/experiences', icon: '💼', label: 'Experiences' },
  { to: '/skills', icon: '⚙', label: 'Skills' },
  { to: '/messages', icon: '✉', label: 'Messages' },
]

const formatDate = (d) => new Date(d).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })

const StatCard = defineComponent({
  props: ['label', 'value', 'accent', 'icon'],
  template: `
    <div class="card-glass rounded-xl p-5 relative overflow-hidden">
      <div :class="['absolute inset-0 opacity-5', accent === 'cyan' ? 'bg-cyan-400' : 'bg-fuchsia-500']" />
      <div class="relative">
        <div class="flex items-center justify-between mb-3">
          <span class="text-2xl">{{ icon }}</span>
          <div :class="['w-2 h-2 rounded-full', accent === 'cyan' ? 'bg-cyan-400' : 'bg-fuchsia-500']" />
        </div>
        <p :class="['text-3xl font-bold font-orbitron', accent === 'cyan' ? 'text-cyan-400' : 'text-fuchsia-400']">{{ value }}</p>
        <p class="text-gray-500 text-sm font-exo mt-1">{{ label }}</p>
      </div>
    </div>
  `
})

onMounted(async () => {
  await Promise.all([
    messagesStore.fetch(),
    portfolioStore.fetchAll()
  ])
})
</script>

<style scoped>
.loading-spinner {
  width: 28px; height: 28px;
  border: 2px solid rgba(34, 211, 238, 0.2);
  border-top-color: var(--cyan);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
