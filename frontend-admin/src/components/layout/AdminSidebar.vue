<template>
  <Transition name="overlay">
    <div v-if="open" class="sidebar-overlay lg:hidden" @click="$emit('close')" />
  </Transition>

  <aside :class="['admin-sidebar flex flex-col', open ? 'open' : '']">
    <!-- Logo -->
    <div class="sidebar-logo">
      <img :src="logoSrc" alt="Logo" class="logo-img"
        @error="e => e.target.style.display='none'" />
      <div>
        <p class="text-white font-orbitron text-xs font-bold tracking-widest">PORTFOLIO</p>
        <p class="text-cyan-400 text-xs font-exo">Control Panel</p>
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 p-3 overflow-y-auto">
      <p class="nav-section-label">Navigation</p>

      <router-link
        v-for="item in navItems" :key="item.path"
        :to="item.path"
        @click="$emit('close')"
        :class="['nav-link-item font-exo', isActive(item.path) ? 'active' : '']">
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="flex-1 text-sm">{{ item.label }}</span>
        <span v-if="item.badge > 0" class="badge-unread text-xs">{{ item.badge }}</span>
      </router-link>

      <p class="nav-section-label mt-5">Content</p>

      <router-link
        v-for="item in contentItems" :key="item.path"
        :to="item.path"
        @click="$emit('close')"
        :class="['nav-link-item font-exo', isActive(item.path) ? 'active' : '']">
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="flex-1 text-sm">{{ item.label }}</span>
      </router-link>
    </nav>

    <div class="p-4 border-t border-cyan-400/10">
      <p class="text-gray-700 text-xs text-center font-exo">Portfolio Admin v1.0</p>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMessagesStore } from '@/stores/messages'
import logoSrc from '@/assets/logo.png'

defineProps({ open: Boolean })
defineEmits(['close'])

const route = useRoute()
const messagesStore = useMessagesStore()
const unreadCount = computed(() => messagesStore.unreadCount || 0)

const isActive = (path) =>
  route.path === path || route.path.startsWith(path + '/')

const navItems = computed(() => [
  { path: '/dashboard', label: 'Dashboard', icon: '⚡', badge: 0 },
  { path: '/messages', label: 'Messages', icon: '✉', badge: unreadCount.value },
])

const contentItems = [
  { path: '/portfolio', label: 'Profile & Info', icon: '👤' },
  { path: '/projects', label: 'Projects', icon: '🚀' },
  { path: '/experiences', label: 'Experiences', icon: '💼' },
  { path: '/skills', label: 'Skills', icon: '⚙' },
  { path: '/socials', label: 'Social Links', icon: '🔗' },
]
</script>

<style scoped>
.admin-sidebar {
  width: 260px; height: 100vh;
  background: rgba(10, 14, 20, 0.99);
  border-right: 1px solid rgba(34, 211, 238, 0.12);
  position: fixed; left: 0; top: 0; bottom: 0;
  z-index: 50;
  transform: translateX(-100%);
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden; display: flex; flex-direction: column;
}
.admin-sidebar.open { transform: translateX(0); }
@media (min-width: 1024px) {
  .admin-sidebar { transform: translateX(0) !important; }
}
.sidebar-logo {
  display: flex; align-items: center; gap: 10px;
  padding: 16px; border-bottom: 1px solid rgba(34,211,238,0.1); flex-shrink: 0;
}
.logo-img {
  width: 38px; height: 38px; object-fit: contain; flex-shrink: 0;
  filter: drop-shadow(0 0 5px rgba(34,211,238,0.5));
}
.nav-section-label {
  color: #374151; font-size: 10px; font-family: 'Orbitron', sans-serif;
  letter-spacing: 0.1em; text-transform: uppercase; padding: 6px 12px 4px; display: block;
}
.nav-link-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 12px; border-radius: 8px; color: #6b7280;
  text-decoration: none; transition: all 0.18s ease; cursor: pointer;
  border-left: 2px solid transparent; margin-bottom: 2px;
}
.nav-link-item:hover { color: #e5e7eb; background: rgba(255,255,255,0.04); }
.nav-link-item.active {
  color: #22d3ee; background: rgba(34,211,238,0.08); border-left-color: #22d3ee;
}
.nav-icon { width: 20px; text-align: center; font-size: 14px; flex-shrink: 0; }
.sidebar-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:49; backdrop-filter:blur(3px); }
.overlay-enter-active, .overlay-leave-active { transition: opacity 0.25s; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }
</style>