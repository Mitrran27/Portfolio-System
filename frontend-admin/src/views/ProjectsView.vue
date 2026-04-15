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

        <!-- Project Logo Preview (auto bg from logo color) -->
        <div class="logo-preview-box relative overflow-hidden"
          :style="project.image_url ? { backgroundColor: project.logo_bg_color || '#0d1117' } : {}">
          <img v-if="project.image_url" :src="project.image_url" :alt="project.title"
            class="w-full h-full object-contain p-4" />
          <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-400/5 to-fuchsia-500/5">
            <span class="text-4xl opacity-20">🚀</span>
          </div>
          <!-- Type badge overlay -->
          <div class="absolute top-2 left-2">
            <AppTooltip :text="typeLabel(project.project_type)">
              <span :class="typeIconBg(project.project_type)" class="flex items-center justify-center w-7 h-7 rounded-lg">
                <component :is="typeIconComponent(project.project_type)" class="w-4 h-4" />
              </span>
            </AppTooltip>
          </div>
        </div>

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
    <AppModal v-model="showModal" :title="editing ? 'Edit Project' : 'New Project'" width="720px">
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
              <option value="web-app">🌐 Web App</option>
              <option value="mobile-app">📱 Mobile App</option>
              <option value="website">🖥 Website</option>
              <option value="ui-ux">🎨 UI/UX Design</option>
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

          <!-- Logo / Thumbnail Upload -->
          <div class="col-span-2">
            <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">
              App Logo / Thumbnail
              <span class="text-gray-500 text-xs ml-1 normal-case">(stored in DB — background auto-detected)</span>
            </label>
            <div class="flex items-start gap-4">
              <!-- Preview box -->
              <div class="logo-upload-preview rounded-xl overflow-hidden flex-shrink-0 border border-cyan-400/20"
                :style="{ backgroundColor: form.logo_bg_color || '#0d1117' }">
                <img v-if="form.image_url" :src="form.image_url" class="w-full h-full object-contain p-2" />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-600">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
              </div>
              <div class="flex-1">
                <!-- File input -->
                <label class="upload-zone cursor-pointer block">
                  <input type="file" accept="image/*" class="hidden" @change="onLogoUpload" :disabled="uploadingLogo" />
                  <div class="border border-dashed border-cyan-400/30 hover:border-cyan-400/60 rounded-lg px-4 py-4 text-center transition-colors">
                    <div v-if="uploadingLogo" class="flex items-center justify-center gap-2 text-cyan-400 text-xs font-exo">
                      <div class="loading-spinner-sm" /> Uploading...
                    </div>
                    <div v-else class="text-gray-500 font-exo text-xs">
                      <span class="text-cyan-400">Click to upload</span> logo<br />
                      PNG, JPG, SVG, WebP · Stored in DB
                    </div>
                  </div>
                </label>
                <!-- Remove -->
                <button v-if="form.image_url" type="button" @click="form.image_url = ''; form.logo_bg_color = ''"
                  class="mt-2 text-xs text-red-400 hover:text-red-300 font-exo transition-colors">
                  ✕ Remove logo
                </button>
              </div>
            </div>
          </div>

          <!-- Screenshots Upload -->
          <div class="col-span-2">
            <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">
              Screenshots
              <span class="text-gray-500 text-xs ml-1 normal-case">(stored in DB · click image in portfolio to enlarge)</span>
            </label>

            <!-- Existing screenshots -->
            <div v-if="form.screenshots?.length" class="flex flex-wrap gap-2 mb-3">
              <div v-for="(shot, idx) in form.screenshots" :key="idx" class="relative group">
                <img :src="shot" class="screenshot-thumb rounded-lg border border-cyan-400/20 object-cover" />
                <button type="button" @click="removeScreenshot(idx)"
                  class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  ✕
                </button>
              </div>
            </div>

            <!-- Upload new screenshots -->
            <label class="upload-zone cursor-pointer block">
              <input type="file" accept="image/*" multiple class="hidden" @change="onScreenshotUpload" :disabled="uploadingScreenshot" />
              <div class="border border-dashed border-fuchsia-400/30 hover:border-fuchsia-400/60 rounded-lg px-4 py-4 text-center transition-colors">
                <div v-if="uploadingScreenshot" class="flex items-center justify-center gap-2 text-fuchsia-400 text-xs font-exo">
                  <div class="loading-spinner-sm loading-spinner-fuchsia" /> Uploading {{ uploadingCount }}...
                </div>
                <div v-else class="text-gray-500 font-exo text-xs">
                  <span class="text-fuchsia-400">Click to upload</span> screenshots (multiple)<br />
                  PNG, JPG, WebP · Stored in DB · Max 5MB each
                </div>
              </div>
            </label>
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
import { ref, onMounted, h, defineComponent } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { useToast } from '@/composables/useToast'
import AppModal from '@/components/ui/AppModal.vue'
import AppTooltip from '@/components/ui/AppTooltip.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import api from '@/composables/useApi'

const store = usePortfolioStore()
const toast = useToast()
const showModal = ref(false)
const saving = ref(false)
const editing = ref(null)
const confirmRef = ref(null)
const techInput = ref('')
const uploadingLogo = ref(false)
const uploadingScreenshot = ref(false)
const uploadingCount = ref(0)

// ── SVG icon components ──────────────────────────────────────────────────────
const IconMobile = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' })
]) })

const IconGlobe = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' })
]) })

const IconMonitor = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' })
]) })

const IconPencil = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' })
]) })

const typeIconComponent = (type) => {
  const map = { 'mobile-app': IconMobile, 'web-app': IconGlobe, 'website': IconMonitor, 'ui-ux': IconPencil }
  return map[type] || IconGlobe
}

const typeIconBg = (type) => {
  const map = {
    'web-app': 'bg-cyan-400/20 text-cyan-400',
    'mobile-app': 'bg-fuchsia-400/20 text-fuchsia-400',
    'website': 'bg-amber-400/20 text-amber-400',
    'ui-ux': 'bg-pink-400/20 text-pink-400'
  }
  return map[type] || 'bg-gray-400/20 text-gray-400'
}

const typeLabel = (type) => {
  const map = { 'web-app': 'Web App', 'mobile-app': 'Mobile App', 'website': 'Website', 'ui-ux': 'UI/UX Design' }
  return map[type] || type
}
const typeStyle = (type) => {
  const map = {
    'web-app': 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30',
    'mobile-app': 'bg-fuchsia-400/20 text-fuchsia-400 border border-fuchsia-400/30',
    'website': 'bg-amber-400/20 text-amber-400 border border-amber-400/30',
    'ui-ux': 'bg-pink-400/20 text-pink-400 border border-pink-400/30'
  }
  return map[type] || 'bg-gray-400/20 text-gray-400'
}

// ── Auto extract dominant color from image ──────────────────────────────────
function extractDominantColor(base64) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 50; canvas.height = 50
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, 50, 50)
      const data = ctx.getImageData(0, 0, 50, 50).data
      let r = 0, g = 0, b = 0, count = 0
      for (let i = 0; i < data.length; i += 16) {
        // Skip near-white and near-transparent pixels
        const alpha = data[i + 3]
        const brightness = (data[i] + data[i+1] + data[i+2]) / 3
        if (alpha > 50 && brightness < 240) {
          r += data[i]; g += data[i+1]; b += data[i+2]; count++
        }
      }
      if (count === 0) return resolve('#0d1117')
      r = Math.round(r / count); g = Math.round(g / count); b = Math.round(b / count)
      // Darken significantly so it's a bg, not competing with the logo
      r = Math.round(r * 0.15); g = Math.round(g * 0.15); b = Math.round(b * 0.15)
      resolve(`rgb(${r},${g},${b})`)
    }
    img.onerror = () => resolve('#0d1117')
    img.src = base64
  })
}

// ── Logo upload ──────────────────────────────────────────────────────────────
const onLogoUpload = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) { toast.error('File too large (max 5MB)'); return }
  uploadingLogo.value = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    const { data } = await api.post('/upload/project-image', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    form.value.image_url = data.url
    // Auto extract bg color
    form.value.logo_bg_color = await extractDominantColor(data.url)
  } catch { toast.error('Failed to upload logo') }
  finally { uploadingLogo.value = false; e.target.value = '' }
}

// ── Screenshot upload ────────────────────────────────────────────────────────
const onScreenshotUpload = async (e) => {
  const files = Array.from(e.target.files || [])
  if (!files.length) return
  uploadingScreenshot.value = true
  uploadingCount.value = files.length
  const results = []
  for (const file of files) {
    if (file.size > 5 * 1024 * 1024) { toast.error(`${file.name} too large (max 5MB)`); continue }
    try {
      const fd = new FormData()
      fd.append('file', file)
      const { data } = await api.post('/upload/screenshot', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      results.push(data.url)
    } catch { toast.error(`Failed to upload ${file.name}`) }
    uploadingCount.value--
  }
  if (!form.value.screenshots) form.value.screenshots = []
  form.value.screenshots = [...form.value.screenshots, ...results]
  uploadingScreenshot.value = false
  e.target.value = ''
}

const removeScreenshot = (idx) => {
  form.value.screenshots = form.value.screenshots.filter((_, i) => i !== idx)
}

// ── Modal / CRUD ─────────────────────────────────────────────────────────────
const defaultForm = () => ({ title: '', description: '', live_url: '', github_url: '', image_url: '', logo_bg_color: '', featured: false, sort_order: 0, project_type: 'web-app', screenshots: [] })
const form = ref(defaultForm())

const openModal = (project = null) => {
  editing.value = project?.id || null
  form.value = project ? { ...project, screenshots: project.screenshots ? [...project.screenshots] : [] } : defaultForm()
  techInput.value = project?.tech_stack?.join(', ') || ''
  showModal.value = true
}

const save = async () => {
  saving.value = true
  const payload = {
    ...form.value,
    tech_stack: techInput.value.split(',').map(t => t.trim()).filter(Boolean),
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
.logo-preview-box { height: 120px; }
.logo-upload-preview { width: 80px; height: 80px; }
.screenshot-thumb { width: 72px; height: 52px; }

.loading-spinner {
  width: 28px; height: 28px;
  border: 2px solid rgba(34,211,238,0.2);
  border-top-color: var(--cyan);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.loading-spinner-sm {
  width: 14px; height: 14px;
  border: 2px solid rgba(34,211,238,0.2);
  border-top-color: #22d3ee;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}
.loading-spinner-fuchsia {
  border-color: rgba(232,121,249,0.2);
  border-top-color: #e879f9;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
