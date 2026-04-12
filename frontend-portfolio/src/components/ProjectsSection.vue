<template>
  <section id="projects" class="py-24 px-6 bg-black/20" ref="sectionRef">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-14">
        <h2 class="font-orbitron font-bold text-white" style="font-size:clamp(1.8rem,4vw,2.8rem)">
          <span class="text-cyan-400 neon-text">Featured</span>
          <span class="text-white"> Projects</span>
        </h2>
        <div class="flex items-center justify-center gap-3 mt-4">
          <div class="h-px w-16 bg-gradient-to-r from-transparent to-cyan-400" />
          <div class="w-2 h-2 rounded-full bg-cyan-400" />
          <div class="h-px w-16 bg-gradient-to-l from-transparent to-cyan-400" />
        </div>
      </div>

      <div v-if="!projects?.length" class="text-center text-gray-600 font-exo py-12">No projects added yet.</div>

      <div v-else class="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="(project, i) in projects" :key="project.id"
          :class="['project-card card-glass rounded-2xl overflow-hidden group hover:border-cyan-400/40 transition-all section-fade', visible ? 'visible' : '']"
          :style="{ transitionDelay: (i * 0.08) + 's' }">

          <!-- Image / placeholder -->
          <div class="project-img relative overflow-hidden">
            <img v-if="project.image_url" :src="project.image_url" :alt="project.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-5xl opacity-30">🚀</span>
            </div>
            <!-- Overlay links -->
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <a v-if="project.live_url" :href="project.live_url" target="_blank"
                class="btn-neon px-4 py-2 rounded-lg text-xs">Live ↗</a>
              <a v-if="project.github_url" :href="project.github_url" target="_blank"
                class="px-4 py-2 rounded-lg text-xs border border-fuchsia-400/50 text-fuchsia-400 hover:bg-fuchsia-400/10 font-orbitron transition-all">
                GitHub
              </a>
            </div>
            <!-- Featured badge -->
            <div v-if="project.featured" class="absolute top-3 right-3 text-xs bg-cyan-400/20 border border-cyan-400/40 text-cyan-400 px-2 py-0.5 rounded font-exo">
              Featured
            </div>
          </div>

          <!-- Content -->
          <div class="p-5">
            <h3 class="text-white font-exo font-semibold text-base mb-2">{{ project.title }}</h3>
            <p class="text-gray-400 text-sm font-exo leading-relaxed line-clamp-3 mb-4">{{ project.description }}</p>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="tech in project.tech_stack" :key="tech" class="tech-tag">{{ tech }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

defineProps({ projects: Array })

const sectionRef = ref(null)
const visible = ref(false)
useIntersectionObserver(sectionRef, ([{ isIntersecting }]) => { if (isIntersecting) visible.value = true }, { threshold: 0.1 })
</script>

<style scoped>
.project-img { height: 200px; background: rgba(13,17,23,0.8); }
</style>
