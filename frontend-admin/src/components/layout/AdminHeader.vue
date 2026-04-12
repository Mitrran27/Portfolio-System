<template>
  <header class="admin-header card-glass border-b border-cyan-400/20 sticky top-0 z-50">
    <div class="flex items-center justify-between px-6 h-16">
      <!-- Left: burger + title -->
      <div class="flex items-center gap-4">
        <button @click="$emit('toggle-sidebar')" class="text-gray-400 hover:text-cyan-400 transition-colors lg:hidden">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <div>
          <h1 class="text-white font-orbitron text-sm font-bold tracking-wider">
            <span class="text-cyan-400 neon-text">ADMIN</span> PANEL
          </h1>
          <p class="text-gray-500 text-xs font-exo">{{ currentRoute }}</p>
        </div>
      </div>

      <!-- Right: notifications + profile -->
      <div class="flex items-center gap-4">
        <!-- Notification Bell -->
        <AppTooltip text="Messages">
          <button
            @click="$emit('open-messages')"
            class="relative text-gray-400 hover:text-cyan-400 transition-colors p-2 rounded-lg hover:bg-cyan-400/10"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span v-if="unreadCount > 0" class="badge-unread absolute -top-1 -right-1">
              {{ unreadCount > 99 ? '99+' : unreadCount }}
            </span>
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

        <!-- Admin info -->
        <div class="flex items-center gap-2 pl-4 border-l border-cyan-400/20">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center text-black font-bold text-xs">
            {{ adminInitial }}
          </div>
          <div class="hidden sm:block">
            <p class="text-white text-xs font-exo font-medium">{{ auth.admin?.email }}</p>
          </div>
          <AppTooltip text="Logout">
            <button @click="handleLogout" class="text-gray-500 hover:text-red-400 transition-colors p-1 ml-1">
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

defineEmits(['toggle-sidebar', 'open-messages'])

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const messagesStore = useMessagesStore()

const unreadCount = computed(() => messagesStore.unreadCount)
const currentRoute = computed(() => route.name || 'Dashboard')
const adminInitial = computed(() => auth.admin?.email?.[0]?.toUpperCase() || 'A')

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.admin-header { background: rgba(13, 17, 23, 0.95); backdrop-filter: blur(16px); }
</style>
