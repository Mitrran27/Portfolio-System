<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold font-orbitron text-white"><span class="text-cyan-400 neon-text">PRO</span>FILE</h2>
      <p class="text-gray-500 font-exo text-sm mt-1">Update your personal info displayed on the portfolio</p>
    </div>

    <div v-if="loading" class="flex justify-center py-20"><div class="loading-spinner" /></div>
    <div v-else-if="error" class="card-glass rounded-2xl p-8 text-center">
      <p class="text-red-400 font-exo mb-4">{{ error }}</p>
      <button @click="loadData" class="btn-neon px-6 py-2 rounded-lg text-sm font-exo">Retry</button>
    </div>

    <form v-else-if="form" @submit.prevent="save" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left -->
      <div class="space-y-5">
        <div class="card-glass rounded-2xl p-6 space-y-4">
          <h3 class="text-white font-orbitron text-sm border-b border-cyan-400/20 pb-3">BASIC INFO</h3>
          <F label="Full Name" v-model="form.name" placeholder="John Doe" />
          <F label="Title / Role" v-model="form.title" placeholder="Full Stack Developer" />
          <F label="Location" v-model="form.location" placeholder="Kuala Lumpur, Malaysia" />
          <F label="Email (public)" v-model="form.email" type="email" placeholder="hello@example.com" />
          <div>
            <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Bio</label>
            <textarea v-model="form.bio" rows="4" class="input-neon w-full px-4 py-3 rounded-lg font-exo text-sm resize-none" placeholder="Tell visitors about yourself..." />
          </div>
        </div>

        <!-- Contact info card -->
        <div class="card-glass rounded-2xl p-6 space-y-4">
          <h3 class="text-white font-orbitron text-sm border-b border-cyan-400/20 pb-3">CONTACT INFO</h3>
          <F label="Available For" v-model="form.available_for" placeholder="Freelance, Full-time, Consulting" />
          <F label="Response Time" v-model="form.response_time" placeholder="Within 24 hours" />
        </div>
      </div>

      <!-- Right -->
      <div class="space-y-5">
        <div class="card-glass rounded-2xl p-6 space-y-4">
          <h3 class="text-white font-orbitron text-sm border-b border-cyan-400/20 pb-3">LINKS & STATUS</h3>
          <F label="Avatar URL" v-model="form.avatar_url" placeholder="https://..." />
          <F label="Resume/CV URL" v-model="form.resume_url" placeholder="https://..." />
          <div class="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-cyan-400/10">
            <div>
              <p class="text-white text-sm font-exo">Available for Work</p>
              <p class="text-gray-500 text-xs font-exo">Show availability badge</p>
            </div>
            <button type="button" @click="form.available_for_work = !form.available_for_work"
              :class="['toggle', form.available_for_work ? 'toggle-on' : 'toggle-off']">
              <span class="toggle-thumb" />
            </button>
          </div>
        </div>

        <!-- Preview -->
        <div class="card-glass rounded-2xl p-6">
          <h3 class="text-white font-orbitron text-sm border-b border-cyan-400/20 pb-3 mb-4">PREVIEW</h3>
          <div class="text-center">
            <div class="w-16 h-16 rounded-full mx-auto mb-3 bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center text-black font-bold text-xl overflow-hidden">
              <img v-if="form.avatar_url" :src="form.avatar_url" class="w-full h-full object-cover" @error="e => e.target.style.display='none'" />
              <span v-else>{{ form.name?.[0]?.toUpperCase() || '?' }}</span>
            </div>
            <p class="text-white font-orbitron text-sm">{{ form.name || 'Your Name' }}</p>
            <p class="text-cyan-400 text-xs font-exo mt-1">{{ form.title }}</p>
            <p class="text-gray-500 text-xs font-exo mt-0.5">{{ form.location }}</p>
            <span v-if="form.available_for_work" class="inline-block mt-2 text-xs bg-green-900/50 border border-green-500/50 text-green-400 px-3 py-0.5 rounded-full font-exo">● Open to work</span>
            <div v-if="form.available_for" class="mt-2 text-xs text-gray-500 font-exo">{{ form.available_for }}</div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2">
        <button type="submit" :disabled="saving" class="btn-solid w-full py-4 rounded-xl font-orbitron text-sm tracking-wider disabled:opacity-50">
          {{ saving ? 'SAVING...' : 'SAVE CHANGES' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, defineComponent, h } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { useToast } from '@/composables/useToast'

const store = usePortfolioStore()
const toast = useToast()
const form = ref(null)
const saving = ref(false)
const loading = ref(true)
const error = ref(null)

const F = defineComponent({
  props: ['label', 'modelValue', 'placeholder', 'type'],
  emits: ['update:modelValue'],
  template: `<div>
    <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">{{ label }}</label>
    <input :type="type||'text'" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
      class="input-neon w-full px-4 py-3 rounded-lg font-exo text-sm" :placeholder="placeholder" />
  </div>`
})

const loadData = async () => {
  loading.value = true; error.value = null
  try {
    await store.fetchAll()
    form.value = {
      name: store.info?.name || '', title: store.info?.title || '',
      bio: store.info?.bio || '', email: store.info?.email || '',
      location: store.info?.location || '', avatar_url: store.info?.avatar_url || '',
      resume_url: store.info?.resume_url || '',
      available_for_work: store.info?.available_for_work ?? true,
      available_for: store.info?.available_for || 'Freelance, Full-time, Consulting',
      response_time: store.info?.response_time || 'Within 24 hours',
    }
  } catch { error.value = 'Failed to load. Check backend is running.' }
  finally { loading.value = false }
}

const save = async () => {
  if (!form.value.name?.trim()) { toast.error('Name is required'); return }
  saving.value = true
  try {
    await store.updateInfo(form.value)
    toast.success('Profile updated!')
  } catch { toast.error('Failed to save') }
  finally { saving.value = false }
}

onMounted(loadData)
</script>

<style scoped>
.toggle { width: 46px; height: 24px; border-radius: 12px; padding: 2px; transition: background 0.3s; cursor: pointer; border: none; display: flex; align-items: center; }
.toggle-on { background: var(--cyan); justify-content: flex-end; }
.toggle-off { background: #374151; justify-content: flex-start; }
.toggle-thumb { width: 18px; height: 18px; background: white; border-radius: 50%; transition: all 0.3s; }
.loading-spinner { width: 28px; height: 28px; border: 2px solid rgba(34,211,238,0.2); border-top-color: var(--cyan); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
