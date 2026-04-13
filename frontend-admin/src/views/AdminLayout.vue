<template>
  <div class="admin-layout">
    <AdminSidebar :open="sidebarOpen" @close="sidebarOpen = false" />
    <div class="admin-main">
      <AdminHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" @open-messages="messagesOpen = true" />
      <main class="p-4 md:p-6 fade-up min-h-0 flex-1">
        <RouterView />
      </main>
    </div>
    <MessagesSidebar v-model="messagesOpen" />
    <ConfirmDialog ref="confirmRef" />
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue'
import AdminSidebar from '@/components/layout/AdminSidebar.vue'
import AdminHeader from '@/components/layout/AdminHeader.vue'
import MessagesSidebar from '@/components/layout/MessagesSidebar.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { useMessagesStore } from '@/stores/messages'

const sidebarOpen = ref(false)
const messagesOpen = ref(false)
const confirmRef = ref(null)
const messagesStore = useMessagesStore()

provide('confirm', (msg, label) => confirmRef.value?.open(msg, label))

onMounted(() => {
  messagesStore.fetchUnreadCount()
  setInterval(() => messagesStore.fetchUnreadCount(), 60000)
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}
.admin-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  /* Default: no margin (mobile — sidebar is off-screen) */
  margin-left: 0;
  transition: margin-left 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}
/* Desktop: sidebar is always visible, push content right */
@media (min-width: 1024px) {
  .admin-main {
    margin-left: 260px;
  }
}
</style>
