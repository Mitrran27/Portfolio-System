<template>
  <div class="min-h-screen bg-grid">
    <!-- Ambient background orbs -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden" style="z-index:0">
      <div class="orb" style="width:600px;height:600px;background:rgba(34,211,238,0.04);top:-200px;right:-200px;animation:float 10s ease-in-out infinite" />
      <div class="orb" style="width:500px;height:500px;background:rgba(217,70,239,0.04);bottom:-200px;left:-200px;animation:float 12s ease-in-out infinite reverse" />
    </div>

    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 card-glass border-b border-cyan-400/10">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#home" class="font-orbitron font-bold text-white text-sm tracking-wider">
          <span class="text-cyan-400 neon-text">{{ info?.name?.split(' ')[0] || 'DEV' }}</span>.io
        </a>
        <!-- Desktop nav -->
        <div class="hidden md:flex items-center gap-8">
          <a v-for="link in navLinks" :key="link.href" :href="link.href"
            class="nav-link text-gray-400 text-sm font-exo">{{ link.label }}</a>
        </div>
        <!-- Mobile burger -->
        <button @click="mobileMenu = !mobileMenu" class="md:hidden text-gray-400 hover:text-cyan-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              :d="mobileMenu ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"/>
          </svg>
        </button>
      </div>
      <!-- Mobile menu -->
      <Transition name="mobile-menu">
        <div v-if="mobileMenu" class="md:hidden border-t border-cyan-400/10 px-6 py-4 space-y-3">
          <a v-for="link in navLinks" :key="link.href" :href="link.href"
            @click="mobileMenu = false"
            class="block text-gray-400 hover:text-cyan-400 font-exo py-1">{{ link.label }}</a>
        </div>
      </Transition>
    </nav>

    <!-- Main content -->
    <main class="relative z-10">
      <HeroSection :info="info" :socials="socials" :loading="loading" />
      <AboutSection :info="info" />
      <SkillsSection :skills="skills" />
      <ProjectsSection :projects="projects" />
      <ContactSection :info="info" />
    </main>

    <!-- Footer -->
    <footer class="relative z-10 border-t border-cyan-400/10 py-8 text-center">
      <p class="text-gray-600 text-sm font-exo">
        Built with <span class="text-cyan-400">Vue.js</span> + <span class="text-fuchsia-400">Node.js</span> + <span class="text-cyan-400">Supabase</span>
        · © {{ new Date().getFullYear() }} {{ info?.name || '' }}
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import HeroSection from '@/components/HeroSection.vue'
import AboutSection from '@/components/AboutSection.vue'
import SkillsSection from '@/components/SkillsSection.vue'
import ProjectsSection from '@/components/ProjectsSection.vue'
import ContactSection from '@/components/ContactSection.vue'

const info = ref(null)
const projects = ref([])
const skills = ref([])
const socials = ref([])
const loading = ref(true)
const mobileMenu = ref(false)

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
]

onMounted(async () => {
  try {
    const [infoRes, projectsRes, skillsRes, socialsRes] = await Promise.all([
      axios.get('/api/portfolio'),
      axios.get('/api/portfolio/projects'),
      axios.get('/api/portfolio/skills'),
      axios.get('/api/portfolio/socials'),
    ])
    info.value = infoRes.data
    projects.value = projectsRes.data
    skills.value = skillsRes.data
    socials.value = socialsRes.data
    // Update page title
    if (info.value?.name) document.title = `${info.value.name} · Portfolio`
  } catch (e) {
    console.error('Failed to load portfolio data', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.orb { position: absolute; border-radius: 50%; filter: blur(80px); }
.mobile-menu-enter-active, .mobile-menu-leave-active { transition: all 0.25s ease; }
.mobile-menu-enter-from, .mobile-menu-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
