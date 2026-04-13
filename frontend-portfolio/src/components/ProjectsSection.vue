<template>
  <section id="projects" class="py-20 px-4 bg-black/20" ref="sectionRef">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="font-orbitron font-bold text-white" style="font-size:clamp(1.6rem,4vw,2.8rem)">
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

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <div v-for="(project, i) in projects" :key="project.id"
          :class="['project-card card-glass rounded-2xl overflow-hidden group cursor-pointer section-fade', visible ? 'visible' : '']"
          :style="{ transitionDelay: (i * 0.08) + 's' }"
          @click="openModal(project)">

          <!-- Thumbnail -->
          <div class="project-img relative overflow-hidden">
            <img v-if="project.image_url" :src="project.image_url" :alt="project.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-400/5 to-fuchsia-500/5">
              <span class="text-4xl opacity-20">🚀</span>
            </div>
            <!-- Hover overlay -->
            <div class="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <span class="text-cyan-400 font-exo text-sm border border-cyan-400/50 px-4 py-2 rounded-lg">
                View Details
              </span>
            </div>
            <div v-if="project.featured" class="absolute top-2 right-2 text-xs bg-cyan-400/20 border border-cyan-400/40 text-cyan-400 px-2 py-0.5 rounded font-exo">
              Featured
            </div>
          </div>

          <!-- Info -->
          <div class="p-4">
            <h3 class="text-white font-exo font-semibold text-sm mb-1">{{ project.title }}</h3>
            <p class="text-gray-400 text-xs font-exo leading-relaxed line-clamp-2 mb-3">{{ project.description }}</p>
            <div class="flex flex-wrap gap-1">
              <span v-for="tech in (project.tech_stack || []).slice(0, 4)" :key="tech" class="tech-tag">{{ tech }}</span>
              <span v-if="(project.tech_stack || []).length > 4" class="tech-tag">+{{ project.tech_stack.length - 4 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Project Modal -->
    <Transition name="modal">
      <div v-if="activeProject" class="modal-backdrop" @click.self="closeModal">
        <div class="modal-box card-glass rounded-2xl overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between p-5 border-b border-cyan-400/20">
            <div>
              <h3 class="text-white font-orbitron font-bold text-base">{{ activeProject.title }}</h3>
              <div v-if="activeProject.featured" class="text-xs text-cyan-400 font-exo mt-0.5">Featured Project</div>
            </div>
            <button @click="closeModal" class="text-gray-500 hover:text-white transition-colors p-1 rounded ml-4">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Screenshot carousel -->
          <div v-if="activeProject.image_url" class="screenshot-area relative overflow-hidden bg-black/50">
            <img :src="activeProject.image_url" :alt="activeProject.title"
              class="w-full h-full object-contain" />
          </div>
          <div v-else class="screenshot-area flex items-center justify-center bg-gradient-to-br from-cyan-400/5 to-fuchsia-500/5">
            <span class="text-6xl opacity-20">🚀</span>
          </div>

          <!-- Details -->
          <div class="p-5 space-y-4">
            <p class="text-gray-300 font-exo text-sm leading-relaxed">{{ activeProject.description }}</p>

            <!-- Tech stack -->
            <div v-if="activeProject.tech_stack?.length">
              <p class="text-gray-500 text-xs font-exo uppercase tracking-wider mb-2">Tech Stack</p>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="tech in activeProject.tech_stack" :key="tech" class="tech-tag">{{ tech }}</span>
              </div>
            </div>

            <!-- Links -->
            <div class="flex gap-3 pt-2">
              <a v-if="activeProject.live_url" :href="activeProject.live_url" target="_blank"
                class="btn-neon flex-1 py-2.5 rounded-xl text-xs font-orbitron text-center" @click.stop>
                Live Demo ↗
              </a>
              <a v-if="activeProject.github_url" :href="activeProject.github_url" target="_blank"
                class="flex-1 py-2.5 rounded-xl text-xs font-orbitron text-center border border-fuchsia-400/40 text-fuchsia-400 hover:bg-fuchsia-400/10 transition-all"
                @click.stop>
                View Code
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

defineProps({ projects: Array })

const sectionRef = ref(null)
const visible = ref(false)
const activeProject = ref(null)

useIntersectionObserver(sectionRef, ([{ isIntersecting }]) => {
  if (isIntersecting) visible.value = true
}, { threshold: 0.05 })

const openModal = (project) => {
  activeProject.value = project
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  activeProject.value = null
  document.body.style.overflow = ''
}
</script>

<style scoped>
.project-img { height: 180px; background: rgba(13,17,23,0.8); }

/* Modal */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 9000;
  background: rgba(3, 7, 18, 0.9);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
}
.modal-box {
  width: 100%;
  max-width: 680px;
  max-height: 90vh;
  overflow-y: auto;
  background: rgba(13,17,23,0.98);
  border: 1px solid rgba(34,211,238,0.25);
}
.screenshot-area {
  height: 280px;
}
@media (min-width: 640px) {
  .screenshot-area { height: 360px; }
}

.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }
</style>
