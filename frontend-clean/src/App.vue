<template>
  <div class="min-h-screen bg-grid">
    <!-- Subtle background orbs — muted red/neutral -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden" style="z-index:0">
      <div class="orb" style="width:500px;height:500px;background:rgba(200,16,46,0.04);top:-150px;right:-150px;animation:float 12s ease-in-out infinite" />
      <div class="orb" style="width:400px;height:400px;background:rgba(255,255,255,0.015);bottom:-150px;left:-150px;animation:float 14s ease-in-out infinite reverse" />
    </div>

    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06]" style="background:rgba(10,10,10,0.9);backdrop-filter:blur(16px)">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <!-- Logo -->
        <a href="#home" class="flex items-center gap-3 group">
          <img src="@/assets/logo.png" alt="Logo" class="h-8 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
          <span class="font-display text-white text-base tracking-tight">
            {{ firstName }}<span class="text-red-600">.</span>
          </span>
        </a>

        <!-- Desktop nav -->
        <div class="hidden md:flex items-center gap-8">
          <a v-for="link in navLinks" :key="link.href" :href="link.href"
            class="nav-link text-sm font-body tracking-wide">
            {{ link.label }}
          </a>
          <a href="#contact" class="btn-neon px-5 py-2 rounded text-xs tracking-widest uppercase">Hire Me</a>
        </div>

        <!-- Mobile burger -->
        <button @click="mobileMenu = !mobileMenu" class="md:hidden text-white/50 hover:text-white p-1 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              :d="mobileMenu ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"/>
          </svg>
        </button>
      </div>

      <!-- Mobile menu -->
      <Transition name="mobile-menu">
        <div v-if="mobileMenu" class="md:hidden border-t border-white/[0.06] px-6 py-5 space-y-4">
          <a v-for="link in navLinks" :key="link.href" :href="link.href"
            @click="mobileMenu = false"
            class="block text-white/50 hover:text-white font-body py-1 text-sm tracking-wide transition-colors">
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

    <footer class="relative z-10 border-t border-white/[0.06] py-10">
      <div class="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-white/30 text-xs font-body tracking-wide">
          © {{ new Date().getFullYear() }} {{ info?.name || '' }} · All rights reserved
        </p>
        <p class="text-white/20 text-xs font-body">
          Built with Vue.js · Node.js · Supabase
        </p>
      </div>
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

const firstName = computed(() => info.value?.name?.split(' ')[0] || 'Portfolio')

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
  } catch (e) {
    console.error('Failed to load portfolio data', e)
  } finally {
    loading.value = false
  }
})
</script>

<style>
.mobile-menu-enter-active, .mobile-menu-leave-active { transition: all 0.2s ease; }
.mobile-menu-enter-from, .mobile-menu-leave-to { opacity: 0; transform: translateY(-6px); }
</style>