<template>
  <Teleport to="body">
    <Transition name="backdrop-fade">
      <div v-if="modelValue" class="drawer-backdrop" @click.self="$emit('update:modelValue', false)">
        <Transition name="drawer" appear>
          <aside v-if="modelValue" class="messages-drawer card-glass flex flex-col">
            <!-- Header -->
            <div class="flex items-center justify-between p-5 border-b border-cyan-400/20">
              <div class="flex items-center gap-3">
                <h2 class="text-white font-orbitron text-sm font-bold">MESSAGES</h2>
                <span v-if="unreadCount > 0" class="badge-unread">{{ unreadCount }} new</span>
              </div>
              <div class="flex items-center gap-2">
                <AppTooltip text="Mark all read">
                  <button @click="markAllRead" class="text-gray-500 hover:text-cyan-400 transition-colors p-1.5 rounded text-xs">
                    ✓✓
                  </button>
                </AppTooltip>
                <button @click="$emit('update:modelValue', false)" class="text-gray-500 hover:text-white transition-colors p-1">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Filter tabs -->
            <div class="flex border-b border-cyan-400/10">
              <button v-for="tab in tabs" :key="tab.value"
                @click="activeTab = tab.value"
                :class="['flex-1 py-3 text-xs font-orbitron tracking-wider transition-colors',
                  activeTab === tab.value ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500 hover:text-gray-300']">
                {{ tab.label }}
              </button>
            </div>

            <!-- Messages list -->
            <div class="flex-1 overflow-y-auto">
              <div v-if="store.loading" class="flex items-center justify-center h-32">
                <div class="loading-spinner" />
              </div>
              <div v-else-if="filteredMessages.length === 0" class="flex flex-col items-center justify-center h-32 text-gray-600">
                <span class="text-2xl mb-2">✉</span>
                <p class="text-sm font-exo">No messages</p>
              </div>
              <div v-else>
                <MessageItem
                  v-for="msg in filteredMessages"
                  :key="msg.id"
                  :message="msg"
                  :selected="selectedId === msg.id"
                  @select="selectMessage(msg)"
                  @delete="deleteMessage(msg.id)"
                />
              </div>
            </div>

            <!-- Message detail -->
            <Transition name="slide-up">
              <div v-if="selected" class="message-detail border-t border-cyan-400/20 p-5 bg-gray-900/50">
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <p class="text-white font-exo font-semibold">{{ selected.sender_name }}</p>
                    <a :href="`mailto:${selected.sender_email}`" class="text-cyan-400 text-xs hover:underline">{{ selected.sender_email }}</a>
                  </div>
                  <p class="text-gray-600 text-xs font-exo">{{ formatDate(selected.created_at) }}</p>
                </div>
                <p class="text-gray-300 text-sm font-exo leading-relaxed whitespace-pre-wrap">{{ selected.message }}</p>
                <div class="flex gap-2 mt-4">
                  <a :href="`mailto:${selected.sender_email}`"
                    class="btn-neon px-4 py-2 rounded-lg text-xs font-exo flex-1 text-center">
                    Reply
                  </a>
                  <button @click="deleteMessage(selected.id); selected = null"
                    class="btn-fuchsia px-4 py-2 rounded-lg text-xs font-exo">
                    Delete
                  </button>
                </div>
              </div>
            </Transition>
          </aside>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useMessagesStore } from '@/stores/messages'
import { useToast } from '@/composables/useToast'
import AppTooltip from '@/components/ui/AppTooltip.vue'

const props = defineProps({ modelValue: Boolean })
defineEmits(['update:modelValue'])

const store = useMessagesStore()
const toast = useToast()
const activeTab = ref('all')
const selectedId = ref(null)
const selected = ref(null)

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Read', value: 'read' },
]

const unreadCount = computed(() => store.unreadCount)
const filteredMessages = computed(() => {
  if (activeTab.value === 'unread') return store.messages.filter(m => !m.is_read)
  if (activeTab.value === 'read') return store.messages.filter(m => m.is_read)
  return store.messages
})

const selectMessage = async (msg) => {
  selectedId.value = msg.id
  selected.value = msg
  if (!msg.is_read) await store.markRead(msg.id)
}

const deleteMessage = async (id) => {
  await store.remove(id)
  if (selectedId.value === id) { selectedId.value = null; selected.value = null }
  toast.success('Message deleted')
}

const markAllRead = async () => {
  await store.markAllRead()
  toast.success('All messages marked as read')
}

const formatDate = (d) => new Date(d).toLocaleDateString('en-MY', {
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
})

watch(() => props.modelValue, (v) => { if (v) store.fetch() })

// MessageItem sub-component
const MessageItem = {
  props: ['message', 'selected'],
  emits: ['select', 'delete'],
  template: `
    <div @click="$emit('select')"
      :class="['msg-item px-5 py-4 border-b border-cyan-400/5 cursor-pointer transition-all group relative',
        selected ? 'bg-cyan-400/10' : 'hover:bg-white/5',
        !message.is_read ? 'border-l-2 border-l-cyan-400' : 'border-l-2 border-l-transparent'
      ]">
      <div class="flex items-start justify-between gap-2">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <p :class="['text-sm font-exo truncate', !message.is_read ? 'text-white font-semibold' : 'text-gray-300']">
              {{ message.sender_name }}
            </p>
            <span v-if="!message.is_read" class="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0"></span>
          </div>
          <p class="text-gray-500 text-xs font-exo truncate">{{ message.sender_email }}</p>
          <p class="text-gray-400 text-xs font-exo mt-1 line-clamp-2">{{ message.message }}</p>
        </div>
        <div class="flex flex-col items-end gap-2 flex-shrink-0">
          <p class="text-gray-600 text-xs">{{ new Date(message.created_at).toLocaleDateString() }}</p>
          <button @click.stop="$emit('delete')" class="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all text-xs">✕</button>
        </div>
      </div>
    </div>
  `
}
</script>

<style scoped>
.drawer-backdrop {
  position: fixed; inset: 0; z-index: 8000;
  background: rgba(3, 7, 18, 0.7);
  backdrop-filter: blur(4px);
  display: flex; justify-content: flex-end;
}
.messages-drawer {
  width: 420px; max-width: 100vw;
  height: 100vh;
  background: rgba(13, 17, 23, 0.98);
  border-left: 1px solid rgba(34, 211, 238, 0.2);
}
.message-detail { max-height: 320px; overflow-y: auto; }
.loading-spinner {
  width: 28px; height: 28px;
  border: 2px solid rgba(34, 211, 238, 0.2);
  border-top-color: var(--cyan);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Backdrop fade */
.backdrop-fade-enter-active, .backdrop-fade-leave-active { transition: opacity 0.3s ease; }
.backdrop-fade-enter-from, .backdrop-fade-leave-to { opacity: 0; }

/* Drawer slide */
.drawer-enter-active, .drawer-leave-active { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.drawer-enter-from, .drawer-leave-to { transform: translateX(100%); }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.25s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(10px); }
</style>
