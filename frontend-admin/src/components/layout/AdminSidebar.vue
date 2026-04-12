<template>
  <!-- Overlay for mobile -->
  <div v-if="open" class="sidebar-overlay lg:hidden" @click="$emit('close')" />

  <aside :class="['admin-sidebar card-glass border-r border-cyan-400/20 flex flex-col', open ? 'open' : '']">
    <!-- Logo -->
    <div class="p-6 border-b border-cyan-400/20">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center">
          <span class="text-black font-orbitron font-bold text-sm">P</span>
        </div>
        <div>
          <p class="text-white font-orbitron text-xs font-bold tracking-widest">PORTFOLIO</p>
          <p class="text-cyan-400 text-xs font-exo">Control Panel</p>
        </div>
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
      <p class="text-gray-600 text-xs font-orbitron tracking-widest px-3 py-2 uppercase">Navigation</p>
      <NavItem v-for="item in navItems" :key="item.path" v-bind="item" @close="$emit('close')" />

      <p class="text-gray-600 text-xs font-orbitron tracking-widest px-3 py-2 mt-4 uppercase">Content</p>
      <NavItem v-for="item in contentItems" :key="item.path" v-bind="item" @close="$emit('close')" />
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-cyan-400/20">
      <p class="text-gray-600 text-xs text-center font-exo">Portfolio Admin v1.0</p>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useMessagesStore } from '@/stores/messages'

defineProps({ open: Boolean })
defineEmits(['close'])

const messagesStore = useMessagesStore()

// NavItem inline component
const NavItem = {
  props: ['path', 'label', 'icon', 'badge'],
  emits: ['close'],
  setup(props, { emit }) {
    const route = useRoute()
    const isActive = computed(() => route.path === props.path || route.path.startsWith(props.path + '/'))
    return { isActive }
  },
  template: `
    <RouterLink :to="path" @click="$emit('close')"
      :class="['nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-exo transition-all group', isActive ? 'sidebar-active' : 'text-gray-400 hover:text-white hover:bg-white/5']">
      <span class="text-lg">{{ icon }}</span>
      <span class="flex-1">{{ label }}</span>
      <span v-if="badge" class="badge-unread">{{ badge }}</span>
    </RouterLink>
  `
}

const unreadCount = computed(() => messagesStore.unreadCount || undefined)

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '⚡' },
  { path: '/messages', label: 'Messages', icon: '✉', badge: unreadCount },
]

const contentItems = [
  { path: '/portfolio', label: 'Profile & Info', icon: '👤' },
  { path: '/projects', label: 'Projects', icon: '🚀' },
  { path: '/skills', label: 'Skills', icon: '⚙' },
  { path: '/socials', label: 'Social Links', icon: '🔗' },
]
</script>

<style scoped>
.admin-sidebar {
  width: 260px; min-height: 100vh;
  background: rgba(13, 17, 23, 0.95);
  position: fixed; left: 0; top: 0; bottom: 0;
  z-index: 40;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}
.admin-sidebar.open { transform: translateX(0); }
@media (min-width: 1024px) { .admin-sidebar { transform: translateX(0); position: sticky; top: 0; height: 100vh; } }
.sidebar-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 39;
  backdrop-filter: blur(2px);
}
.nav-item { cursor: pointer; }
</style>
