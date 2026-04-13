<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold font-orbitron text-white">
          <span class="text-cyan-400 neon-text">EXPER</span>IENCES
        </h2>
        <p class="text-gray-500 font-exo text-sm mt-1">{{ store.experiences.length }} entries</p>
      </div>
      <button @click="openModal()" class="btn-solid px-5 py-2.5 rounded-xl text-sm font-orbitron">
        + ADD EXPERIENCE
      </button>
    </div>

    <div v-if="store.loading" class="flex justify-center py-20"><div class="loading-spinner" /></div>

    <div v-else-if="!store.experiences.length" class="card-glass rounded-2xl p-12 text-center text-gray-600">
      <span class="text-5xl block mb-3">💼</span>
      <p class="font-exo">No experiences yet. Add your first one!</p>
    </div>

    <!-- Timeline list -->
    <div v-else class="relative">
      <div class="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400/50 to-transparent hidden md:block" />
      <div class="space-y-4">
        <div v-for="exp in store.experiences" :key="exp.id"
          class="card-glass rounded-2xl p-5 md:ml-16 relative group hover:border-cyan-400/30 transition-all">
          <!-- Timeline dot -->
          <div class="absolute -left-10 top-6 w-4 h-4 rounded-full border-2 border-gray-900 hidden md:block"
            :class="exp.sort_order % 2 === 1 ? 'bg-cyan-400' : 'bg-fuchsia-500'" />

          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <h3 class="text-white font-exo font-semibold">{{ exp.role }}</h3>
                <span class="text-xs px-2 py-0.5 rounded-full font-exo"
                  :class="exp.type === 'work' ? 'bg-cyan-400/10 text-cyan-400' : 'bg-fuchsia-400/10 text-fuchsia-400'">
                  {{ exp.type }}
                </span>
              </div>
              <p class="text-fuchsia-400 text-sm font-exo">{{ exp.company }}</p>
              <p class="text-gray-500 text-xs font-exo mt-0.5">{{ exp.period }}</p>
              <ul v-if="exp.bullets?.length" class="mt-3 space-y-1">
                <li v-for="b in exp.bullets" :key="b" class="text-gray-400 text-xs font-exo flex gap-2">
                  <span class="text-cyan-400 flex-shrink-0">▹</span>{{ b }}
                </li>
              </ul>
              <div v-if="exp.tech_stack?.length" class="flex flex-wrap gap-1 mt-3">
                <span v-for="t in exp.tech_stack" :key="t" class="tech-tag">{{ t }}</span>
              </div>
            </div>
            <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button @click="openModal(exp)" class="text-cyan-400 hover:text-cyan-300 text-xs font-exo px-3 py-1.5 rounded-lg border border-cyan-400/30 hover:bg-cyan-400/10 transition-all">Edit</button>
              <button @click="deleteExp(exp.id)" class="text-red-400 hover:text-red-300 text-xs font-exo px-3 py-1.5 rounded-lg border border-red-400/30 hover:bg-red-400/10 transition-all">Del</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <AppModal v-model="showModal" :title="editing ? 'Edit Experience' : 'New Experience'" width="680px">
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Role / Title *</label>
            <input v-model="form.role" class="input-neon w-full px-4 py-2.5 rounded-lg font-exo text-sm" placeholder="Senior Developer" />
          </div>
          <div>
            <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Company *</label>
            <input v-model="form.company" class="input-neon w-full px-4 py-2.5 rounded-lg font-exo text-sm" placeholder="Acme Corp" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Period *</label>
            <input v-model="form.period" class="input-neon w-full px-4 py-2.5 rounded-lg font-exo text-sm" placeholder="2022 - Present" />
          </div>
          <div>
            <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Type</label>
            <select v-model="form.type" class="input-neon w-full px-4 py-2.5 rounded-lg font-exo text-sm">
              <option value="work">Work</option>
              <option value="education">Education</option>
              <option value="freelance">Freelance</option>
              <option value="volunteer">Volunteer</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Short Description</label>
          <input v-model="form.description" class="input-neon w-full px-4 py-2.5 rounded-lg font-exo text-sm" placeholder="Brief overview..." />
        </div>
        <div>
          <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Bullet Points (one per line)</label>
          <textarea v-model="bulletsInput" rows="4" class="input-neon w-full px-4 py-2.5 rounded-lg font-exo text-sm resize-none"
            placeholder="Led team of 5 engineers&#10;Reduced load time by 40%&#10;Shipped 3 major features" />
        </div>
        <div>
          <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Tech Stack (comma-separated)</label>
          <input v-model="techInput" class="input-neon w-full px-4 py-2.5 rounded-lg font-exo text-sm" placeholder="Vue.js, Node.js, PostgreSQL" />
        </div>
        <div>
          <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Sort Order (lower = higher position)</label>
          <input v-model.number="form.sort_order" type="number" class="input-neon w-full px-4 py-2.5 rounded-lg font-exo text-sm" />
        </div>
      </div>
      <template #footer>
        <button @click="showModal = false" class="btn-neon px-5 py-2.5 rounded-lg text-sm font-exo">Cancel</button>
        <button @click="save" :disabled="saving" class="btn-solid px-5 py-2.5 rounded-lg text-sm font-exo disabled:opacity-50">
          {{ saving ? 'Saving...' : editing ? 'Update' : 'Create' }}
        </button>
      </template>
    </AppModal>

    <ConfirmDialog ref="confirmRef" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { useToast } from '@/composables/useToast'
import AppModal from '@/components/ui/AppModal.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

const store = usePortfolioStore()
const toast = useToast()
const showModal = ref(false)
const saving = ref(false)
const editing = ref(null)
const confirmRef = ref(null)
const bulletsInput = ref('')
const techInput = ref('')

const defaultForm = () => ({ role: '', company: '', period: '', description: '', type: 'work', sort_order: 0 })
const form = ref(defaultForm())

const openModal = (exp = null) => {
  editing.value = exp?.id || null
  form.value = exp ? { ...exp } : defaultForm()
  bulletsInput.value = exp?.bullets?.join('\n') || ''
  techInput.value = exp?.tech_stack?.join(', ') || ''
  showModal.value = true
}

const save = async () => {
  if (!form.value.role || !form.value.company || !form.value.period) {
    toast.error('Role, company and period are required')
    return
  }
  saving.value = true
  const payload = {
    ...form.value,
    bullets: bulletsInput.value.split('\n').map(b => b.trim()).filter(Boolean),
    tech_stack: techInput.value.split(',').map(t => t.trim()).filter(Boolean)
  }
  try {
    if (editing.value) await store.updateExperience(editing.value, payload)
    else await store.createExperience(payload)
    toast.success(editing.value ? 'Experience updated!' : 'Experience created!')
    showModal.value = false
  } catch { toast.error('Failed to save') }
  finally { saving.value = false }
}

const deleteExp = async (id) => {
  const ok = await confirmRef.value?.open('Delete this experience?', 'Delete')
  if (!ok) return
  await store.deleteExperience(id)
  toast.success('Deleted')
}

onMounted(() => store.fetchAll())
</script>

<style scoped>
.loading-spinner { width: 28px; height: 28px; border: 2px solid rgba(34,211,238,0.2); border-top-color: var(--cyan); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
