import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/composables/useApi'

export const useMessagesStore = defineStore('messages', () => {
  const messages = ref([])
  const loading = ref(false)
  const unreadCount = ref(0)

  const fetch = async () => {
    loading.value = true
    try {
      const { data } = await api.get('/messages')
      messages.value = data
    } finally {
      loading.value = false
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const { data } = await api.get('/messages/unread-count')
      unreadCount.value = data.count
    } catch {}
  }

  const markRead = async (id) => {
    await api.patch(`/messages/${id}/read`)
    const msg = messages.value.find(m => m.id === id)
    if (msg && !msg.is_read) {
      msg.is_read = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
  }

  const markAllRead = async () => {
    await api.patch('/messages/mark-all-read')
    messages.value.forEach(m => m.is_read = true)
    unreadCount.value = 0
  }

  const remove = async (id) => {
    const msg = messages.value.find(m => m.id === id)
    await api.delete(`/messages/${id}`)
    messages.value = messages.value.filter(m => m.id !== id)
    if (msg && !msg.is_read) unreadCount.value = Math.max(0, unreadCount.value - 1)
  }

  const unread = computed(() => messages.value.filter(m => !m.is_read))

  return { messages, loading, unreadCount, unread, fetch, fetchUnreadCount, markRead, markAllRead, remove }
})
