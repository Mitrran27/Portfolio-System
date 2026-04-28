<template>
  <div class="min-h-screen bg-grid">
    <div class="fixed inset-0 pointer-events-none overflow-hidden" style="z-index:0">
      <div class="orb" style="width:600px;height:600px;background:rgba(34,211,238,0.04);top:-200px;right:-200px;animation:float 10s ease-in-out infinite" />
      <div class="orb" style="width:500px;height:500px;background:rgba(217,70,239,0.04);bottom:-200px;left:-200px;animation:float 12s ease-in-out infinite reverse" />
    </div>

    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 card-glass border-b border-cyan-400/10">
      <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <!-- Logo + name -->
        <a href="#home" class="flex items-center gap-2.5 group">
          <img src="@/assets/logo.png" alt="Logo"
            class="h-9 w-auto object-contain transition-all group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
            style="filter: drop-shadow(0 0 4px rgba(34,211,238,0.4))" />
          <span class="font-orbitron font-bold text-white text-sm tracking-wider">
            <span class="text-cyan-400 neon-text">{{ firstName }}</span>.io
          </span>
        </a>

        <!-- Desktop nav -->
        <div class="hidden md:flex items-center gap-6">
          <a v-for="link in navLinks" :key="link.href" :href="link.href"
            class="nav-link text-gray-400 text-sm font-exo hover:text-cyan-400 transition-colors">
            {{ link.label }}
          </a>
        </div>

        <!-- Mobile burger -->
        <button @click="mobileMenu = !mobileMenu" class="md:hidden text-gray-400 hover:text-cyan-400 p-1">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              :d="mobileMenu ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"/>
          </svg>
        </button>
      </div>

      <!-- Mobile menu -->
      <Transition name="mobile-menu">
        <div v-if="mobileMenu" class="md:hidden border-t border-cyan-400/10 px-6 py-4 space-y-2">
          <a v-for="link in navLinks" :key="link.href" :href="link.href"
            @click="mobileMenu = false"
            class="block text-gray-400 hover:text-cyan-400 font-exo py-2 text-sm">
            {{ link.label }}
          </a>
        </div>
      </Transition>
    </nav>

    <!-- Main content -->
    <main class="relative z-10">
      <HeroSection :info="info" :socials="socials" :loading="loading" />
      <AboutSection :info="info" />
      <SkillsSection :skills="skills" />
      <ExperienceSection :experiences="experiences" />
      <EducationSection :education="education" />
      <ProjectsSection :projects="projects" />
      <ResumeSection :info="info" />
      <ContactSection :info="info" :socials="socials" />
    </main>

    <footer class="relative z-10 border-t border-cyan-400/10 py-8 text-center">
      <p class="text-gray-600 text-sm font-exo">
        Built with <span class="text-cyan-400">Vue.js</span> + <span class="text-fuchsia-400">Node.js</span> + <span class="text-cyan-400">Supabase</span>
        · © {{ new Date().getFullYear() }} {{ info?.name || '' }} · All rights reserved
      </p>
      <p class="text-white/20 text-xs font-body">
        Built with Vue.js · Node.js · Supabase
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import HeroSection from '@/components/HeroSection.vue'
import AboutSection from '@/components/AboutSection.vue'
import SkillsSection from '@/components/SkillsSection.vue'
import ExperienceSection from '@/components/ExperienceSection.vue'
import EducationSection from '@/components/EducationSection.vue'
import ProjectsSection from '@/components/ProjectsSection.vue'
import ResumeSection from '@/components/ResumeSection.vue'
import ContactSection from '@/components/ContactSection.vue'

const info = ref(null)
const projects = ref([])
const skills = ref([])
const socials = ref([])
const experiences = ref([])
const education = ref([])
const loading = ref(true)
const mobileMenu = ref(false)

const firstName = computed(() => info.value?.name?.split(' ')[0] || 'DEV')

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#education', label: 'Education' },
  { href: '#projects', label: 'Projects' },
  { href: '#resume', label: 'Resume' },
  { href: '#contact', label: 'Contact' },
]

onMounted(async () => {
  try {
    const [infoRes, projectsRes, skillsRes, socialsRes, expRes, eduRes] = await Promise.all([
      axios.get('/api/portfolio'),
      axios.get('/api/portfolio/projects'),
      axios.get('/api/portfolio/skills'),
      axios.get('/api/portfolio/socials'),
      axios.get('/api/portfolio/experiences'),
      axios.get('/api/portfolio/education'),
    ])
    info.value = infoRes.data
    projects.value = (projectsRes.data || []).slice().sort((a, b) => (a.sort_order ?? 9999) - (b.sort_order ?? 9999))
    skills.value = skillsRes.data
    socials.value = socialsRes.data
    experiences.value = expRes.data
    education.value = eduRes.data
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