<template>
  <div class="admin-layout">
    <AdminSidebar :open="sidebarOpen" @close="sidebarOpen = false" />
    <div class="admin-main" :class="{ 'sidebar-open': sidebarOpen }">
      <AdminHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" @open-messages="messagesOpen = true" />
      <main class="p-4 md:p-6 fade-up">
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
  position: relative;
}
.admin-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
}
/* On desktop (lg+), sidebar is always visible so push main content right */
@media (min-width: 1024px) {
  .admin-main {
    margin-left: 260px;
  }
}
</style>
