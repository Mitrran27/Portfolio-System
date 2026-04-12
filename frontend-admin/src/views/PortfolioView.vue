<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold font-orbitron text-white">
        <span class="text-cyan-400 neon-text">PRO</span>FILE
      </h2>
      <p class="text-gray-500 font-exo text-sm mt-1">Update your personal info displayed on the portfolio</p>
    </div>

    <div v-if="store.loading" class="flex justify-center py-20"><div class="loading-spinner" /></div>

    <form v-else-if="form" @submit.prevent="save" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left column -->
      <div class="space-y-5">
        <div class="card-glass rounded-2xl p-6 space-y-5">
          <h3 class="text-white font-orbitron text-sm border-b border-cyan-400/20 pb-3">BASIC INFO</h3>
          <Field label="Full Name" v-model="form.name" placeholder="John Doe" />
          <Field label="Title / Role" v-model="form.title" placeholder="Full Stack Developer" />
          <Field label="Location" v-model="form.location" placeholder="Kuala Lumpur, Malaysia" />
          <Field label="Email (public)" v-model="form.email" type="email" placeholder="hello@example.com" />
          <div>
            <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Bio</label>
            <textarea v-model="form.bio" rows="4"
              class="input-neon w-full px-4 py-3 rounded-lg font-exo text-sm resize-none"
              placeholder="Tell visitors about yourself..." />
          </div>
        </div>
      </div>

      <!-- Right column -->
      <div class="space-y-5">
        <div class="card-glass rounded-2xl p-6 space-y-5">
          <h3 class="text-white font-orbitron text-sm border-b border-cyan-400/20 pb-3">LINKS & STATUS</h3>
          <Field label="Avatar URL" v-model="form.avatar_url" placeholder="https://..." />
          <Field label="Resume/CV URL" v-model="form.resume_url" placeholder="https://..." />
          <div class="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-cyan-400/10">
            <div>
              <p class="text-white text-sm font-exo">Available for Work</p>
              <p class="text-gray-500 text-xs font-exo">Show availability badge on portfolio</p>
            </div>
            <button type="button" @click="form.available_for_work = !form.available_for_work"
              :class="['toggle', form.available_for_work ? 'toggle-on' : 'toggle-off']">
              <span class="toggle-thumb" />
            </button>
          </div>
        </div>

        <!-- Preview card -->
        <div class="card-glass rounded-2xl p-6">
          <h3 class="text-white font-orbitron text-sm border-b border-cyan-400/20 pb-3 mb-4">PREVIEW</h3>
          <div class="text-center">
            <div class="w-20 h-20 rounded-full mx-auto mb-3 bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center text-black font-bold text-2xl overflow-hidden">
              <img v-if="form.avatar_url" :src="form.avatar_url" class="w-full h-full object-cover" @error="e => e.target.style.display='none'" />
              <span v-else>{{ form.name?.[0] || '?' }}</span>
            </div>
            <p class="text-white font-orbitron text-sm">{{ form.name || 'Your Name' }}</p>
            <p class="text-cyan-400 text-xs font-exo mt-1">{{ form.title || 'Your Title' }}</p>
            <p class="text-gray-500 text-xs font-exo mt-1">{{ form.location }}</p>
            <span v-if="form.available_for_work" class="inline-block mt-2 text-xs bg-green-900/50 border border-green-500/50 text-green-400 px-3 py-1 rounded-full font-exo">
              ● Available for work
            </span>
          </div>
        </div>
      </div>

      <!-- Save button full width -->
      <div class="lg:col-span-2">
        <button type="submit" :disabled="saving" class="btn-solid w-full py-4 rounded-xl font-orbitron text-sm tracking-wider disabled:opacity-50">
          {{ saving ? 'SAVING...' : 'SAVE CHANGES' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { useToast } from '@/composables/useToast'

const store = usePortfolioStore()
const toast = useToast()
const form = ref(null)
const saving = ref(false)

const Field = {
  props: ['label', 'modelValue', 'placeholder', 'type'],
  emits: ['update:modelValue'],
  template: `
    <div>
      <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">{{ label }}</label>
      <input :type="type || 'text'" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
        class="input-neon w-full px-4 py-3 rounded-lg font-exo text-sm" :placeholder="placeholder" />
    </div>
  `
}

const save = async () => {
  saving.value = true
  try {
    await store.updateInfo(form.value)
    toast.success('Profile updated successfully!')
  } catch {
    toast.error('Failed to save profile')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await store.fetchAll()
  form.value = { ...store.info }
})
watch(() => store.info, (v) => { if (v) form.value = { ...v } })
</script>

<style scoped>
.toggle { width: 48px; height: 26px; border-radius: 13px; padding: 3px; transition: background 0.3s; cursor: pointer; border: none; display: flex; align-items: center; }
.toggle-on { background: var(--cyan); justify-content: flex-end; }
.toggle-off { background: #374151; justify-content: flex-start; }
.toggle-thumb { width: 20px; height: 20px; background: white; border-radius: 50%; transition: all 0.3s; }
.loading-spinner { width: 28px; height: 28px; border: 2px solid rgba(34,211,238,0.2); border-top-color: var(--cyan); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
