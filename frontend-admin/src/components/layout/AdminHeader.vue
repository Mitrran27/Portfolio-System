<template>
  <header class="admin-header card-glass border-b border-cyan-400/20 sticky top-0 z-50">
    <div class="flex items-center justify-between px-4 h-16">
      <!-- Left -->
      <div class="flex items-center gap-3">
        <button @click="$emit('toggle-sidebar')"
          class="text-gray-400 hover:text-cyan-400 transition-colors lg:hidden p-1.5 rounded-lg hover:bg-white/5">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <div class="hidden sm:block">
          <h1 class="text-white font-orbitron text-xs font-bold tracking-wider">
            <span class="text-cyan-400 neon-text">ADMIN</span> PANEL
          </h1>
          <p class="text-gray-600 text-xs font-exo">{{ currentRoute }}</p>
        </div>
      </div>

      <!-- Right -->
      <div class="flex items-center gap-2">
        <!-- Notification Bell -->
        <AppTooltip text="Messages">
          <button @click="handleBellClick"
            class="relative text-gray-400 hover:text-cyan-400 transition-colors p-2 rounded-lg hover:bg-cyan-400/10">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <Transition name="badge-pop">
              <span v-if="unreadCount > 0" key="badge" class="badge-unread absolute -top-1 -right-1">
                {{ unreadCount > 99 ? '99+' : unreadCount }}
              </span>
            </Transition>
          </button>
        </AppTooltip>

        <!-- View Portfolio -->
        <AppTooltip text="View Portfolio">
          <a href="http://localhost:5173" target="_blank"
            class="text-gray-400 hover:text-fuchsia-400 transition-colors p-2 rounded-lg hover:bg-fuchsia-400/10">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>
        </AppTooltip>

        <!-- Avatar + logout -->
        <div class="flex items-center gap-2 pl-3 border-l border-cyan-400/15">
          <div class="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center text-black font-bold text-xs flex-shrink-0">
            {{ adminInitial }}
          </div>
          <span class="hidden md:block text-white text-xs font-exo max-w-[140px] truncate">{{ auth.admin?.email }}</span>
          <AppTooltip text="Logout">
            <button @click="handleLogout" class="text-gray-600 hover:text-red-400 transition-colors p-1 ml-0.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </AppTooltip>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMessagesStore } from '@/stores/messages'
import AppTooltip from '@/components/ui/AppTooltip.vue'

const emit = defineEmits(['toggle-sidebar', 'open-messages'])

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const messagesStore = useMessagesStore()

const portfolioUrl = import.meta.env.VITE_PORTFOLIO_URL || 'http://localhost:5173'

const unreadCount = computed(() => messagesStore.unreadCount)
const currentRoute = computed(() => route.name || 'Dashboard')
const adminInitial = computed(() => auth.admin?.email?.[0]?.toUpperCase() || 'A')

// FIX: Always fetch + always emit open-messages so the drawer actually opens
const handleBellClick = async () => {
  // Always fetch fresh messages first
  await messagesStore.fetch()
  // Then tell AdminLayout to open the drawer
  emit('open-messages')
}

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.admin-header { background: rgba(13,17,23,0.97); backdrop-filter: blur(16px); }
.badge-pop-enter-active { transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1); }
.badge-pop-enter-from { opacity:0; transform:scale(0.3); }
</style>
