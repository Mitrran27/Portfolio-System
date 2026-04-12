<template>
  <div class="login-bg min-h-screen flex items-center justify-center px-4">
    <!-- Ambient orbs -->
    <div class="orb orb-cyan" />
    <div class="orb orb-fuchsia" />

    <div class="login-card card-glass rounded-2xl p-10 w-full max-w-md gradient-border fade-up">
      <!-- Logo -->
      <div class="text-center mb-10">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center mx-auto mb-4">
          <span class="text-black font-orbitron font-black text-2xl">P</span>
        </div>
        <h1 class="text-white font-orbitron text-xl font-bold">
          <span class="text-cyan-400 neon-text">ADMIN</span> ACCESS
        </h1>
        <p class="text-gray-500 text-sm font-exo mt-1">Portfolio Control Panel</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Email</label>
          <input
            v-model="form.email"
            type="email" required
            class="input-neon w-full px-4 py-3 rounded-lg font-exo"
            placeholder="admin@yourdomain.com"
          />
        </div>
        <div>
          <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Password</label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPass ? 'text' : 'password'" required
              class="input-neon w-full px-4 py-3 pr-12 rounded-lg font-exo"
              placeholder="••••••••"
            />
            <button type="button" @click="showPass = !showPass"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition-colors text-xs">
              {{ showPass ? 'hide' : 'show' }}
            </button>
          </div>
        </div>

        <div v-if="error" class="p-3 rounded-lg bg-red-900/50 border border-red-500/50 text-red-400 text-sm font-exo">
          {{ error }}
        </div>

        <button type="submit" :disabled="loading"
          class="btn-solid w-full py-3.5 rounded-lg font-orbitron text-sm tracking-wider mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ loading ? 'AUTHENTICATING...' : 'LOGIN' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const form = ref({ email: '', password: '' })
const error = ref('')
const loading = ref(false)
const showPass = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  const result = await auth.login(form.value.email, form.value.password)
  loading.value = false
  if (result.success) router.push('/dashboard')
  else error.value = result.error
}
</script>

<style scoped>
.login-bg { background: var(--bg); position: relative; overflow: hidden; }
.orb {
  position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none;
  animation: float 8s ease-in-out infinite;
}
.orb-cyan { width: 400px; height: 400px; background: rgba(34,211,238,0.06); top: -100px; right: -100px; }
.orb-fuchsia { width: 350px; height: 350px; background: rgba(217,70,239,0.06); bottom: -100px; left: -100px; animation-delay: -4s; }
@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
</style>
