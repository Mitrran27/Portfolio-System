<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold font-orbitron text-white"><span class="text-cyan-400 neon-text">SKILL</span>S</h2>
        <p class="text-gray-500 font-exo text-sm mt-1">{{ store.skills.length }} skills across {{ categories.length }} categories</p>
      </div>
      <button @click="openModal()" class="btn-solid px-5 py-2.5 rounded-xl text-sm font-orbitron">+ ADD SKILL</button>
    </div>

    <div v-if="store.loading" class="flex justify-center py-20"><div class="loading-spinner" /></div>

    <div v-else class="space-y-6">
      <div v-for="cat in categories" :key="cat" class="card-glass rounded-2xl overflow-hidden">
        <div class="px-6 py-4 border-b border-cyan-400/20 flex items-center justify-between">
          <h3 class="text-white font-orbitron text-sm">{{ cat }}</h3>
          <span class="text-gray-500 text-xs font-exo">{{ skillsByCategory(cat).length }} skills</span>
        </div>
        <div class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="skill in skillsByCategory(cat)" :key="skill.id"
            class="skill-card p-4 rounded-xl bg-black/30 border border-cyan-400/10 hover:border-cyan-400/30 transition-all group">
            <div class="flex items-center justify-between mb-3">
              <span class="text-white text-sm font-exo font-medium">{{ skill.name }}</span>
              <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="openModal(skill)" class="text-cyan-400 text-xs hover:underline font-exo">Edit</button>
                <button @click="deleteSkill(skill.id)" class="text-red-400 text-xs hover:underline font-exo">Del</button>
              </div>
            </div>
            <div class="skill-bar-bg rounded-full overflow-hidden h-1.5">
              <div class="skill-bar-fill h-full rounded-full transition-all duration-1000"
                :style="{ width: skill.level + '%' }" />
            </div>
            <p class="text-cyan-400 text-xs font-exo mt-1.5">{{ skill.level }}%</p>
          </div>
        </div>
      </div>
    </div>

    <AppModal v-model="showModal" :title="editing ? 'Edit Skill' : 'New Skill'" width="420px">
      <form @submit.prevent="save" class="space-y-4">
        <div>
          <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Skill Name *</label>
          <input v-model="form.name" required class="input-neon w-full px-4 py-3 rounded-lg font-exo text-sm" placeholder="Vue.js" />
        </div>
        <div>
          <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Category *</label>
          <input v-model="form.category" required class="input-neon w-full px-4 py-3 rounded-lg font-exo text-sm" placeholder="Frontend, Backend, DevOps..." list="cat-list" />
          <datalist id="cat-list">
            <option v-for="c in categories" :key="c" :value="c" />
          </datalist>
        </div>
        <div>
          <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Proficiency: {{ form.level }}%</label>
          <input type="range" v-model.number="form.level" min="0" max="100" class="w-full accent-cyan-400" />
          <div class="skill-bar-bg rounded-full overflow-hidden h-2 mt-2">
            <div class="skill-bar-fill h-full rounded-full transition-all" :style="{ width: form.level + '%' }" />
          </div>
        </div>
      </form>
      <template #footer>
        <button @click="showModal = false" class="btn-neon px-5 py-2.5 rounded-lg text-sm font-exo">Cancel</button>
        <button @click="save" :disabled="saving" class="btn-solid px-5 py-2.5 rounded-lg text-sm font-exo">
          {{ saving ? 'Saving...' : editing ? 'Update' : 'Create' }}
        </button>
      </template>
    </AppModal>
    <ConfirmDialog ref="confirmRef" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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

const defaultForm = () => ({ name: '', category: '', level: 80 })
const form = ref(defaultForm())

const categories = computed(() => [...new Set(store.skills.map(s => s.category))].sort())
const skillsByCategory = (cat) => store.skills.filter(s => s.category === cat)

const openModal = (skill = null) => {
  editing.value = skill?.id || null
  form.value = skill ? { ...skill } : defaultForm()
  showModal.value = true
}

const save = async () => {
  saving.value = true
  try {
    if (editing.value) await store.updateSkill(editing.value, form.value)
    else await store.createSkill(form.value)
    toast.success(editing.value ? 'Skill updated!' : 'Skill added!')
    showModal.value = false
  } catch { toast.error('Failed to save skill') }
  finally { saving.value = false }
}

const deleteSkill = async (id) => {
  const ok = await confirmRef.value?.open('Remove this skill?', 'Remove')
  if (!ok) return
  await store.deleteSkill(id)
  toast.success('Skill removed')
}

onMounted(() => store.fetchAll())
</script>

<style scoped>
.skill-bar-bg { background: rgba(34,211,238,0.1); }
.skill-bar-fill { background: linear-gradient(90deg, var(--cyan), var(--fuchsia)); }
.loading-spinner { width: 28px; height: 28px; border: 2px solid rgba(34,211,238,0.2); border-top-color: var(--cyan); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
