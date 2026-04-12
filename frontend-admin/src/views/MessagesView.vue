<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold font-orbitron text-white">
          <span class="text-cyan-400 neon-text">MESS</span>AGES
        </h2>
        <p class="text-gray-500 font-exo text-sm mt-1">{{ store.messages.length }} total · {{ store.unreadCount }} unread</p>
      </div>
      <div class="flex gap-3">
        <button @click="store.markAllRead(); toast.success('All marked as read')" class="btn-neon px-4 py-2 rounded-lg text-sm font-exo">
          Mark all read
        </button>
      </div>
    </div>

    <!-- Filter + Search -->
    <div class="flex flex-col sm:flex-row gap-3">
      <input v-model="search" type="text" placeholder="Search messages..."
        class="input-neon px-4 py-2.5 rounded-lg text-sm font-exo flex-1" />
      <div class="flex gap-2">
        <button v-for="tab in tabs" :key="tab.value" @click="filter = tab.value"
          :class="['px-4 py-2.5 rounded-lg text-sm font-exo transition-colors',
            filter === tab.value ? 'btn-solid' : 'btn-neon']">
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Two-panel layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5" style="min-height: 600px;">
      <!-- Messages list -->
      <div class="card-glass rounded-2xl overflow-hidden flex flex-col">
        <div v-if="store.loading" class="flex justify-center py-16">
          <div class="loading-spinner" />
        </div>
        <div v-else-if="filtered.length === 0" class="flex flex-col items-center justify-center flex-1 py-16 text-gray-600">
          <span class="text-4xl mb-3">✉</span>
          <p class="font-exo">No messages found</p>
        </div>
        <div v-else class="overflow-y-auto flex-1">
          <div v-for="msg in filtered" :key="msg.id"
            @click="select(msg)"
            :class="['msg-row px-5 py-4 border-b border-cyan-400/5 cursor-pointer transition-all group',
              selected?.id === msg.id ? 'bg-cyan-400/10' : 'hover:bg-white/5',
              !msg.is_read ? 'border-l-2 border-l-cyan-400' : 'border-l-2 border-l-transparent']">
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400/20 to-fuchsia-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 font-bold text-sm flex-shrink-0">
                {{ msg.sender_name[0].toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <p :class="['text-sm font-exo', !msg.is_read ? 'text-white font-semibold' : 'text-gray-300']">{{ msg.sender_name }}</p>
                    <span v-if="!msg.is_read" class="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                  </div>
                  <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click.stop="deleteMsg(msg.id)" class="text-red-400 hover:text-red-300 text-xs p-1">✕</button>
                  </div>
                </div>
                <p class="text-gray-500 text-xs font-exo">{{ msg.sender_email }}</p>
                <p class="text-gray-400 text-xs font-exo mt-1 line-clamp-1">{{ msg.message }}</p>
                <p class="text-gray-600 text-xs font-exo mt-1">{{ formatDate(msg.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail panel -->
      <div class="card-glass rounded-2xl overflow-hidden flex flex-col">
        <div v-if="!selected" class="flex flex-col items-center justify-center flex-1 text-gray-600 py-16">
          <span class="text-4xl mb-3">👈</span>
          <p class="font-exo text-sm">Select a message to read</p>
        </div>
        <div v-else class="flex flex-col flex-1 p-6">
          <div class="flex items-start justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center text-black font-bold">
                {{ selected.sender_name[0].toUpperCase() }}
              </div>
              <div>
                <p class="text-white font-exo font-semibold">{{ selected.sender_name }}</p>
                <a :href="`mailto:${selected.sender_email}`" class="text-cyan-400 text-sm font-exo hover:underline">
                  {{ selected.sender_email }}
                </a>
              </div>
            </div>
            <div class="text-right">
              <p class="text-gray-500 text-xs font-exo">{{ formatDate(selected.created_at) }}</p>
              <span :class="['text-xs font-exo px-2 py-1 rounded mt-1 inline-block',
                selected.is_read ? 'text-gray-500 bg-gray-800' : 'text-cyan-400 bg-cyan-400/10']">
                {{ selected.is_read ? 'Read' : 'Unread' }}
              </span>
            </div>
          </div>
          <div class="flex-1 bg-black/30 rounded-xl p-5 overflow-y-auto">
            <p class="text-gray-300 font-exo text-sm leading-relaxed whitespace-pre-wrap">{{ selected.message }}</p>
          </div>
          <div class="flex gap-3 mt-5">
            <a :href="`mailto:${selected.sender_email}?subject=Re: Your message`"
              class="btn-neon flex-1 py-3 rounded-xl text-sm font-exo text-center">
              ✉ Reply via Email
            </a>
            <button @click="deleteMsg(selected.id)" class="btn-fuchsia px-5 py-3 rounded-xl text-sm font-exo">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ConfirmDialog ref="confirmRef" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMessagesStore } from '@/stores/messages'
import { useToast } from '@/composables/useToast'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

const store = useMessagesStore()
const toast = useToast()
const filter = ref('all')
const search = ref('')
const selected = ref(null)
const confirmRef = ref(null)

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Read', value: 'read' },
]

const filtered = computed(() => {
  let msgs = store.messages
  if (filter.value === 'unread') msgs = msgs.filter(m => !m.is_read)
  if (filter.value === 'read') msgs = msgs.filter(m => m.is_read)
  if (search.value) {
    const q = search.value.toLowerCase()
    msgs = msgs.filter(m =>
      m.sender_name.toLowerCase().includes(q) ||
      m.sender_email.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    )
  }
  return msgs
})

const select = async (msg) => {
  selected.value = msg
  if (!msg.is_read) await store.markRead(msg.id)
}

const deleteMsg = async (id) => {
  const ok = await confirmRef.value?.open('Delete this message permanently?', 'Delete')
  if (!ok) return
  if (selected.value?.id === id) selected.value = null
  await store.remove(id)
  toast.success('Message deleted')
}

const formatDate = (d) => new Date(d).toLocaleDateString('en-MY', {
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
})

onMounted(() => store.fetch())
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
