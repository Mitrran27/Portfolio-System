<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold font-orbitron text-white"><span class="text-cyan-400 neon-text">PRO</span>FILE</h2>
      <p class="text-gray-500 font-exo text-sm mt-1">Update your personal info displayed on the portfolio</p>
    </div>

    <div v-if="loading" class="flex justify-center py-20"><div class="loading-spinner" /></div>
    <div v-else-if="loadError" class="card-glass rounded-2xl p-8 text-center">
      <p class="text-red-400 font-exo mb-4">{{ loadError }}</p>
      <button @click="loadData" class="btn-neon px-6 py-2 rounded-lg text-sm font-exo">Retry</button>
    </div>

    <form v-else-if="form" @submit.prevent="save" class="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <!-- LEFT: Basic Info -->
      <div class="space-y-5">
        <div class="card-glass rounded-2xl p-6 space-y-4">
          <h3 class="text-white font-orbitron text-sm border-b border-cyan-400/20 pb-3">BASIC INFO</h3>
          <F label="Full Name" v-model="form.name" placeholder="Mitrran" required />
          <F label="Title / Role" v-model="form.title" placeholder="Full Stack Developer" />
          <F label="Location" v-model="form.location" placeholder="Bukit Mertajam, Penang, MY" />
          <F label="Email (public)" v-model="form.email" type="email" placeholder="hello@example.com" />
          <div>
            <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Bio</label>
            <textarea v-model="form.bio" rows="4"
              class="input-neon w-full px-4 py-3 rounded-lg font-exo text-sm resize-none"
              placeholder="Tell visitors about yourself..." />
          </div>
        </div>

        <!-- Contact Info -->
        <div class="card-glass rounded-2xl p-6 space-y-4">
          <h3 class="text-white font-orbitron text-sm border-b border-cyan-400/20 pb-3">CONTACT INFO</h3>
          <F label="Available For" v-model="form.available_for" placeholder="Freelance, Full-time, Consulting" />
          <F label="Response Time" v-model="form.response_time" placeholder="Within 24 hours" />
          <div class="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-cyan-400/10">
            <div>
              <p class="text-white text-sm font-exo">Available for Work</p>
              <p class="text-gray-500 text-xs font-exo">Shows green badge on portfolio</p>
            </div>
            <button type="button" @click="form.available_for_work = !form.available_for_work"
              :class="['toggle', form.available_for_work ? 'toggle-on' : 'toggle-off']">
              <span class="toggle-thumb" />
            </button>
          </div>
        </div>
      </div>

      <!-- RIGHT: Media + Preview -->
      <div class="space-y-5">

        <!-- Avatar Upload -->
        <div class="card-glass rounded-2xl p-6 space-y-4">
          <h3 class="text-white font-orbitron text-sm border-b border-cyan-400/20 pb-3">PROFILE PICTURE</h3>
          <div class="flex items-center gap-5">
            <!-- Preview -->
            <div class="w-20 h-20 rounded-full flex-shrink-0 bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center text-black font-bold text-2xl overflow-hidden border-2 border-cyan-400/30">
              <img v-if="form.avatar_url" :src="form.avatar_url" class="w-full h-full object-cover"
                @error="e => e.target.style.display='none'" />
              <span v-else>{{ form.name?.[0]?.toUpperCase() || '?' }}</span>
            </div>
            <div class="flex-1 space-y-2">
              <!-- File upload -->
              <label class="block">
                <span class="btn-neon px-4 py-2 rounded-lg text-xs font-exo cursor-pointer inline-block">
                  {{ avatarUploading ? 'Uploading...' : 'Upload Image' }}
                </span>
                <input type="file" accept="image/*" class="hidden" @change="uploadAvatar" :disabled="avatarUploading" />
              </label>
              <p class="text-gray-600 text-xs font-exo">JPG, PNG, WEBP — max 10MB</p>
              <!-- Or paste URL -->
              <input v-model="form.avatar_url"
                class="input-neon w-full px-3 py-2 rounded-lg font-exo text-xs"
                placeholder="Or paste image URL..." />
            </div>
          </div>
        </div>

        <!-- Resume Upload -->
        <div class="card-glass rounded-2xl p-6 space-y-4">
          <h3 class="text-white font-orbitron text-sm border-b border-cyan-400/20 pb-3">RESUME / CV</h3>

          <!-- Current resume preview -->
          <div v-if="form.resume_url" class="flex items-center gap-3 p-3 bg-black/30 rounded-xl border border-cyan-400/10">
            <svg class="w-8 h-8 text-fuchsia-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <div class="flex-1 min-w-0">
              <p class="text-white text-xs font-exo truncate">Resume uploaded</p>
              <a :href="form.resume_url" target="_blank" class="text-cyan-400 text-xs font-exo hover:underline">View current ↗</a>
            </div>
            <button type="button" @click="form.resume_url = ''" class="text-red-400 hover:text-red-300 text-xs font-exo">Remove</button>
          </div>

          <div class="space-y-3">
            <!-- Upload button -->
            <label class="block">
              <div :class="['upload-drop-zone', resumeDragging ? 'dragging' : '']"
                @dragover.prevent="resumeDragging = true"
                @dragleave="resumeDragging = false"
                @drop.prevent="onResumeDrop">
                <svg class="w-8 h-8 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                <p class="text-gray-500 text-sm font-exo text-center">
                  {{ resumeUploading ? 'Uploading...' : 'Drop PDF here or click to upload' }}
                </p>
                <p class="text-gray-700 text-xs font-exo text-center mt-1">PDF only — max 10MB</p>
                <input type="file" accept=".pdf" class="hidden" ref="resumeInput" @change="uploadResume" :disabled="resumeUploading" />
              </div>
            </label>
            <p class="text-gray-600 text-xs font-exo text-center">— or paste URL directly —</p>
            <input v-model="form.resume_url"
              class="input-neon w-full px-4 py-2.5 rounded-lg font-exo text-sm"
              placeholder="https://..." />
          </div>

          <div v-if="uploadError" class="text-red-400 text-xs font-exo p-2 bg-red-900/20 rounded-lg border border-red-500/30">
            {{ uploadError }}
          </div>
        </div>

        <!-- Live Preview Card -->
        <div class="card-glass rounded-2xl p-5">
          <h3 class="text-white font-orbitron text-xs border-b border-cyan-400/20 pb-3 mb-4">PREVIEW</h3>
          <div class="text-center">
            <div class="w-14 h-14 rounded-full mx-auto mb-2 bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center text-black font-bold text-lg overflow-hidden">
              <img v-if="form.avatar_url" :src="form.avatar_url" class="w-full h-full object-cover" @error="e => e.target.style.display='none'" />
              <span v-else>{{ form.name?.[0]?.toUpperCase() || '?' }}</span>
            </div>
            <p class="text-white font-orbitron text-xs">{{ form.name || 'Your Name' }}</p>
            <p class="text-cyan-400 text-xs font-exo mt-0.5">{{ form.title }}</p>
            <p class="text-gray-500 text-xs font-exo">{{ form.location }}</p>
            <span v-if="form.available_for_work" class="inline-block mt-1.5 text-xs bg-green-900/40 border border-green-500/40 text-green-400 px-2 py-0.5 rounded-full font-exo">● Open to work</span>
          </div>
        </div>
      </div>

      <!-- Save -->
      <div class="lg:col-span-2">
        <button type="submit" :disabled="saving"
          class="btn-solid w-full py-4 rounded-xl font-orbitron text-sm tracking-wider disabled:opacity-50">
          {{ saving ? 'SAVING...' : 'SAVE ALL CHANGES' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, defineComponent } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { useToast } from '@/composables/useToast'
import api from '@/composables/useApi'

const store = usePortfolioStore()
const toast = useToast()
const form = ref(null)
const saving = ref(false)
const loading = ref(true)
const loadError = ref(null)
const avatarUploading = ref(false)
const resumeUploading = ref(false)
const resumeDragging = ref(false)
const resumeInput = ref(null)
const uploadError = ref('')

const F = defineComponent({
  props: ['label', 'modelValue', 'placeholder', 'type', 'required'],
  emits: ['update:modelValue'],
  template: `<div>
    <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">{{ label }}</label>
    <input :type="type||'text'" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
      :required="required" class="input-neon w-full px-4 py-3 rounded-lg font-exo text-sm" :placeholder="placeholder" />
  </div>`
})

const loadData = async () => {
  loading.value = true; loadError.value = null
  try {
    await store.fetchAll()
    form.value = {
      name: store.info?.name || '',
      title: store.info?.title || '',
      bio: store.info?.bio || '',
      email: store.info?.email || '',
      location: store.info?.location || '',
      avatar_url: store.info?.avatar_url || '',
      resume_url: store.info?.resume_url || '',
      available_for_work: store.info?.available_for_work ?? true,
      available_for: store.info?.available_for || 'Freelance, Full-time, Consulting',
      response_time: store.info?.response_time || 'Within 24 hours',
    }
  } catch { loadError.value = 'Failed to load. Check backend is running.' }
  finally { loading.value = false }
}

const uploadAvatar = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  avatarUploading.value = true
  uploadError.value = ''
  try {
    const fd = new FormData()
    fd.append('file', file)
    const { data } = await api.post('/upload/avatar', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    form.value.avatar_url = data.url
    toast.success('Avatar uploaded!')
  } catch (err) {
    uploadError.value = err.response?.data?.error || 'Upload failed'
    toast.error('Avatar upload failed')
  } finally { avatarUploading.value = false }
}

const uploadResume = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  await doResumeUpload(file)
}

const onResumeDrop = async (e) => {
  resumeDragging.value = false
  const file = e.dataTransfer.files?.[0]
  if (!file) return
  await doResumeUpload(file)
}

const doResumeUpload = async (file) => {
  if (file.type !== 'application/pdf') {
    uploadError.value = 'Only PDF files are allowed'
    return
  }
  resumeUploading.value = true
  uploadError.value = ''
  try {
    const fd = new FormData()
    fd.append('file', file)
    const { data } = await api.post('/upload/resume', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    form.value.resume_url = data.url
    toast.success('Resume uploaded!')
  } catch (err) {
    uploadError.value = err.response?.data?.error || 'Upload failed'
    toast.error('Resume upload failed')
  } finally { resumeUploading.value = false }
}

const save = async () => {
  if (!form.value.name?.trim()) { toast.error('Name is required'); return }
  saving.value = true
  try {
    await store.updateInfo(form.value)
    toast.success('Profile saved successfully!')
  } catch { toast.error('Failed to save') }
  finally { saving.value = false }
}

onMounted(loadData)
</script>

<style scoped>
.toggle { width: 46px; height: 24px; border-radius: 12px; padding: 2px; transition: background 0.3s; cursor: pointer; border: none; display: flex; align-items: center; }
.toggle-on { background: var(--cyan); justify-content: flex-end; }
.toggle-off { background: #374151; justify-content: flex-start; }
.toggle-thumb { width: 18px; height: 18px; background: white; border-radius: 50%; }

.upload-drop-zone {
  border: 2px dashed rgba(34,211,238,0.2);
  border-radius: 12px;
  padding: 24px 16px;
  cursor: pointer;
  transition: all 0.2s;
}
.upload-drop-zone:hover, .upload-drop-zone.dragging {
  border-color: var(--cyan);
  background: rgba(34,211,238,0.04);
}

.loading-spinner { width: 28px; height: 28px; border: 2px solid rgba(34,211,238,0.2); border-top-color: var(--cyan); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
