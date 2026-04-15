<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold font-orbitron text-white"><span class="text-cyan-400 neon-text">PROJ</span>ECTS</h2>
        <p class="text-gray-500 font-exo text-sm mt-1">{{ store.projects.length }} projects</p>
      </div>
      <button @click="openModal()" class="btn-solid px-5 py-2.5 rounded-xl text-sm font-orbitron">+ ADD PROJECT</button>
    </div>

    <div v-if="store.loading" class="flex justify-center py-20"><div class="loading-spinner" /></div>

    <div v-else-if="store.projects.length === 0" class="card-glass rounded-2xl p-12 text-center text-gray-600">
      <span class="text-5xl block mb-3">🚀</span>
      <p class="font-exo">No projects yet. Add your first one!</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <div v-for="project in store.projects" :key="project.id"
        class="card-glass rounded-2xl overflow-hidden group hover:border-cyan-400/40 transition-all">
        <div class="h-2 bg-gradient-to-r from-cyan-400 to-fuchsia-500" />
        <div class="p-5">
          <div class="flex items-start justify-between mb-3">
            <h3 class="text-white font-exo font-semibold">{{ project.title }}</h3>
            <div class="flex items-center gap-1.5 flex-shrink-0 ml-2">
              <span v-if="project.project_type" :class="typeStyle(project.project_type)" class="text-xs px-2 py-0.5 rounded font-exo">
                {{ typeLabel(project.project_type) }}
              </span>
              <span v-if="project.featured" class="text-xs bg-cyan-400/20 text-cyan-400 px-2 py-0.5 rounded font-exo">Featured</span>
            </div>
          </div>
          <p class="text-gray-400 text-sm font-exo line-clamp-2 mb-4">{{ project.description }}</p>
          <div class="flex flex-wrap gap-1.5 mb-4">
            <span v-for="tech in project.tech_stack" :key="tech"
              class="text-xs bg-fuchsia-400/10 text-fuchsia-400 border border-fuchsia-400/20 px-2 py-0.5 rounded font-exo">
              {{ tech }}
            </span>
          </div>
          <!-- Screenshots count indicator -->
          <div v-if="project.screenshots?.length" class="text-xs text-gray-500 font-exo mb-3">
            📷 {{ project.screenshots.length }} screenshot{{ project.screenshots.length > 1 ? 's' : '' }}
          </div>
          <div class="flex items-center gap-2 mt-4 pt-4 border-t border-cyan-400/10">
            <a v-if="project.live_url" :href="project.live_url" target="_blank" class="text-cyan-400 hover:underline text-xs font-exo">↗ Live</a>
            <a v-if="project.github_url" :href="project.github_url" target="_blank" class="text-gray-400 hover:text-white text-xs font-exo ml-auto">GitHub →</a>
            <button @click="openModal(project)" class="text-gray-500 hover:text-cyan-400 text-xs font-exo transition-colors ml-2">Edit</button>
            <button @click="deleteProject(project.id)" class="text-gray-500 hover:text-red-400 text-xs font-exo transition-colors">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <AppModal v-model="showModal" :title="editing ? 'Edit Project' : 'New Project'" width="680px">
      <form @submit.prevent="save" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2">
            <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Title *</label>
            <input v-model="form.title" required class="input-neon w-full px-4 py-3 rounded-lg font-exo text-sm" placeholder="My Awesome Project" />
          </div>
          <div class="col-span-2">
            <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Description</label>
            <textarea v-model="form.description" rows="3" class="input-neon w-full px-4 py-3 rounded-lg font-exo text-sm resize-none" placeholder="What does this project do?" />
          </div>

          <!-- Project Type -->
          <div>
            <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Project Type</label>
            <select v-model="form.project_type" class="input-neon w-full px-4 py-3 rounded-lg font-exo text-sm">
              <option value="web-app">Web App</option>
              <option value="mobile-app">Mobile App</option>
              <option value="website">Website</option>
            </select>
          </div>

          <div>
            <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Sort Order</label>
            <input v-model.number="form.sort_order" type="number" class="input-neon w-full px-4 py-3 rounded-lg font-exo text-sm" />
          </div>

          <div>
            <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Live URL</label>
            <input v-model="form.live_url" class="input-neon w-full px-4 py-3 rounded-lg font-exo text-sm" placeholder="https://..." />
          </div>
          <div>
            <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">GitHub URL</label>
            <input v-model="form.github_url" class="input-neon w-full px-4 py-3 rounded-lg font-exo text-sm" placeholder="https://github.com/..." />
          </div>

          <!-- Thumbnail -->
          <div class="col-span-2">
            <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Thumbnail Image URL</label>
            <input v-model="form.image_url" class="input-neon w-full px-4 py-3 rounded-lg font-exo text-sm" placeholder="https://..." />
          </div>

          <!-- Screenshots -->
          <div class="col-span-2">
            <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Screenshots (one URL per line)</label>
            <textarea v-model="screenshotsInput" rows="4" class="input-neon w-full px-4 py-3 rounded-lg font-exo text-sm resize-none"
              placeholder="https://example.com/screenshot1.png&#10;https://example.com/screenshot2.png" />
            <p class="text-gray-600 text-xs font-exo mt-1">These will be shown in the project modal gallery.</p>
          </div>

          <div class="col-span-2">
            <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Tech Stack (comma-separated)</label>
            <input :value="techInput" @input="techInput = $event.target.value" class="input-neon w-full px-4 py-3 rounded-lg font-exo text-sm" placeholder="Vue.js, Node.js, PostgreSQL" />
          </div>
          <div class="col-span-2 flex items-center gap-3">
            <input type="checkbox" id="featured" v-model="form.featured" class="w-4 h-4 accent-cyan-400" />
            <label for="featured" class="text-gray-300 text-sm font-exo cursor-pointer">Mark as featured project</label>
          </div>
        </div>
      </form>
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
const techInput = ref('')
const screenshotsInput = ref('')

const defaultForm = () => ({ title: '', description: '', live_url: '', github_url: '', image_url: '', featured: false, sort_order: 0, project_type: 'web-app' })
const form = ref(defaultForm())

const typeLabel = (type) => {
  const map = { 'web-app': 'Web App', 'mobile-app': 'Mobile App', 'website': 'Website' }
  return map[type] || type
}
const typeStyle = (type) => {
  const map = {
    'web-app': 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30',
    'mobile-app': 'bg-fuchsia-400/20 text-fuchsia-400 border border-fuchsia-400/30',
    'website': 'bg-amber-400/20 text-amber-400 border border-amber-400/30'
  }
  return map[type] || 'bg-gray-400/20 text-gray-400'
}

const openModal = (project = null) => {
  editing.value = project?.id || null
  form.value = project ? { ...project } : defaultForm()
  techInput.value = project?.tech_stack?.join(', ') || ''
  screenshotsInput.value = project?.screenshots?.join('\n') || ''
  showModal.value = true
}

const save = async () => {
  saving.value = true
  const payload = {
    ...form.value,
    tech_stack: techInput.value.split(',').map(t => t.trim()).filter(Boolean),
    screenshots: screenshotsInput.value.split('\n').map(s => s.trim()).filter(Boolean)
  }
  try {
    if (editing.value) await store.updateProject(editing.value, payload)
    else await store.createProject(payload)
    toast.success(editing.value ? 'Project updated!' : 'Project created!')
    showModal.value = false
  } catch { toast.error('Failed to save project') }
  finally { saving.value = false }
}

const deleteProject = async (id) => {
  const ok = await confirmRef.value?.open('Delete this project?', 'Delete')
  if (!ok) return
  await store.deleteProject(id)
  toast.success('Project deleted')
}

onMounted(() => store.fetchAll())
</script>

<style scoped>
.loading-spinner { width: 28px; height: 28px; border: 2px solid rgba(34,211,238,0.2); border-top-color: var(--cyan); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
