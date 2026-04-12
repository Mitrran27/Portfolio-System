<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold font-orbitron text-white"><span class="text-cyan-400 neon-text">SOCI</span>ALS</h2>
      <p class="text-gray-500 font-exo text-sm mt-1">Manage your social links shown on the portfolio</p>
    </div>

    <div class="card-glass rounded-2xl p-6 space-y-4">
      <div v-for="(link, i) in links" :key="i" class="flex items-center gap-3">
        <select v-model="link.platform" class="input-neon px-3 py-2.5 rounded-lg font-exo text-sm w-36">
          <option v-for="p in platforms" :key="p" :value="p">{{ p }}</option>
        </select>
        <input v-model="link.url" class="input-neon flex-1 px-4 py-2.5 rounded-lg font-exo text-sm" :placeholder="`https://${link.platform?.toLowerCase()}.com/...`" />
        <button @click="links.splice(i,1)" class="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-400/10 transition-colors">✕</button>
      </div>

      <button @click="links.push({ platform: 'GitHub', url: '' })"
        class="btn-neon w-full py-3 rounded-xl text-sm font-exo mt-2">
        + Add Social Link
      </button>
    </div>

    <button @click="save" :disabled="saving" class="btn-solid w-full py-4 rounded-xl font-orbitron text-sm tracking-wider disabled:opacity-50">
      {{ saving ? 'SAVING...' : 'SAVE SOCIAL LINKS' }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { useToast } from '@/composables/useToast'

const store = usePortfolioStore()
const toast = useToast()
const links = ref([])
const saving = ref(false)

const platforms = ['GitHub', 'LinkedIn', 'Twitter', 'Instagram', 'YouTube', 'TikTok', 'Dribbble', 'Behance', 'Dev.to', 'Medium', 'Website']

const save = async () => {
  saving.value = true
  try {
    await store.updateSocials(links.value.filter(l => l.url))
    toast.success('Social links saved!')
  } catch { toast.error('Failed to save social links') }
  finally { saving.value = false }
}

onMounted(async () => {
  await store.fetchAll()
  links.value = store.socials.length ? [...store.socials] : [{ platform: 'GitHub', url: '' }]
})
</script>
