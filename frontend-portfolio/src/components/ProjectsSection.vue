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

          <!-- Logo / Thumbnail with auto bg color -->
          <div class="project-img relative overflow-hidden"
            :style="{ backgroundColor: project.image_url ? (project.logo_bg_color || '#0d1117') : undefined }">
            <img v-if="project.image_url" :src="project.image_url" :alt="project.title"
              class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
            <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-400/5 to-fuchsia-500/5">
              <span class="text-4xl opacity-20">🚀</span>
            </div>

            <!-- Hover overlay -->
            <div class="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <span class="text-cyan-400 font-exo text-sm border border-cyan-400/50 px-4 py-2 rounded-lg">View Details</span>
            </div>

            <!-- Project type icon badge (bottom-left) with tooltip -->
            <div class="absolute top-2 left-2">
              <div class="type-tooltip-wrapper" :data-tooltip="typeLabel(project.project_type)">
                <span :class="typeIconBg(project.project_type)" class="flex items-center justify-center w-7 h-7 rounded-lg backdrop-blur-sm">
                  <component :is="typeIconComponent(project.project_type)" class="w-4 h-4" />
                </span>
                <span class="type-tooltip">{{ typeLabel(project.project_type) }}</span>
              </div>
            </div>

            <div v-if="project.featured" class="absolute top-2 right-2 text-xs bg-cyan-400/20 border border-cyan-400/40 text-cyan-400 px-2 py-0.5 rounded font-exo backdrop-blur-sm">
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
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-white font-orbitron font-bold text-base">{{ activeProject.title }}</h3>
                <!-- Type badge with icon -->
                <span v-if="activeProject.project_type" :class="typeStyle(activeProject.project_type)"
                  class="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded font-exo">
                  <component :is="typeIconComponent(activeProject.project_type)" class="w-3.5 h-3.5" />
                  {{ typeLabel(activeProject.project_type) }}
                </span>
              </div>
              <div v-if="activeProject.featured" class="text-xs text-cyan-400 font-exo mt-0.5">Featured Project</div>
            </div>
            <button @click="closeModal" class="text-gray-500 hover:text-white transition-colors p-1 rounded ml-4">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Screenshot gallery -->
          <div v-if="allImages.length" class="screenshot-area relative bg-black/50 overflow-hidden">
            <img :src="allImages[activeSlide]" :alt="activeProject.title"
              class="w-full h-full object-contain transition-opacity duration-300 cursor-zoom-in"
              @click.stop="openLightbox(activeSlide)" />
            <button v-if="allImages.length > 1" @click="prevSlide"
              class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all">‹</button>
            <button v-if="allImages.length > 1" @click="nextSlide"
              class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all">›</button>
            <div v-if="allImages.length > 1" class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              <button v-for="(_, idx) in allImages" :key="idx" @click="activeSlide = idx"
                :class="['w-1.5 h-1.5 rounded-full transition-all', idx === activeSlide ? 'bg-cyan-400 w-4' : 'bg-white/40']" />
            </div>
            <div v-if="allImages.length > 1" class="absolute top-2 right-2 bg-black/60 text-white text-xs font-exo px-2 py-0.5 rounded">
              {{ activeSlide + 1 }} / {{ allImages.length }}
            </div>
            <!-- Zoom hint -->
            <div class="absolute bottom-2 right-2 bg-black/60 text-gray-400 text-xs font-exo px-2 py-0.5 rounded flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
              Click to enlarge
            </div>
          </div>
          <div v-else class="screenshot-area flex items-center justify-center bg-gradient-to-br from-cyan-400/5 to-fuchsia-500/5">
            <span class="text-6xl opacity-20">🚀</span>
          </div>

          <!-- Thumbnail strip -->
          <div v-if="allImages.length > 1" class="flex gap-2 px-4 py-2 overflow-x-auto bg-black/30 border-b border-cyan-400/10">
            <button v-for="(img, idx) in allImages" :key="idx" @click="activeSlide = idx"
              :class="['flex-shrink-0 w-14 h-10 rounded overflow-hidden border-2 transition-all',
                idx === activeSlide ? 'border-cyan-400' : 'border-transparent opacity-50 hover:opacity-80']">
              <img :src="img" class="w-full h-full object-cover" />
            </button>
          </div>

          <!-- Details -->
          <div class="p-5 space-y-4">
            <p class="text-gray-300 font-exo text-sm leading-relaxed">{{ activeProject.description }}</p>
            <div v-if="activeProject.tech_stack?.length">
              <p class="text-gray-500 text-xs font-exo uppercase tracking-wider mb-2">Tech Stack</p>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="tech in activeProject.tech_stack" :key="tech" class="tech-tag">{{ tech }}</span>
              </div>
            </div>
            <div class="flex gap-3 pt-2">
              <a v-if="activeProject.live_url" :href="activeProject.live_url" target="_blank"
                class="btn-neon flex-1 py-2.5 rounded-xl text-xs font-orbitron text-center" @click.stop>Live Demo ↗</a>
              <a v-if="activeProject.github_url" :href="activeProject.github_url" target="_blank"
                class="flex-1 py-2.5 rounded-xl text-xs font-orbitron text-center border border-fuchsia-400/40 text-fuchsia-400 hover:bg-fuchsia-400/10 transition-all"
                @click.stop>View Code</a>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Lightbox (enlarge image inline, not new tab) -->
    <Transition name="lightbox">
      <div v-if="lightboxSrc" class="lightbox-backdrop" @click="closeLightbox">
        <div class="lightbox-inner" @click.stop>
          <img :src="lightboxSrc" class="lightbox-img" />
          <button @click="closeLightbox"
            class="absolute top-4 right-4 w-10 h-10 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center text-xl transition-all">
            ✕
          </button>
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-400 text-xs font-exo">
            Click anywhere to close
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import { ref, computed, h, defineComponent } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

defineProps({ projects: Array })

const sectionRef = ref(null)
const visible = ref(false)
const activeProject = ref(null)
const activeSlide = ref(0)
const lightboxSrc = ref(null)

useIntersectionObserver(sectionRef, ([{ isIntersecting }]) => {
  if (isIntersecting) visible.value = true
}, { threshold: 0.05 })

const allImages = computed(() => {
  if (!activeProject.value) return []
  const imgs = []
  if (activeProject.value.image_url) imgs.push(activeProject.value.image_url)
  if (activeProject.value.screenshots?.length) {
    activeProject.value.screenshots.forEach(s => { if (s && !imgs.includes(s)) imgs.push(s) })
  }
  return imgs
})

// ── Type icons ────────────────────────────────────────────────────────────────
const IconMobile = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' })
]) })
const IconGlobe = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' })
]) })
const IconMonitor = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' })
]) })
const IconPencil = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' })
]) })

const typeIconComponent = (type) => {
  const map = { 'mobile-app': IconMobile, 'web-app': IconGlobe, 'website': IconMonitor, 'ui-ux': IconPencil }
  return map[type] || IconGlobe
}
const typeIconBg = (type) => {
  const map = { 'web-app': 'bg-cyan-400/25 text-cyan-400', 'mobile-app': 'bg-fuchsia-400/25 text-fuchsia-400', 'website': 'bg-amber-400/25 text-amber-400', 'ui-ux': 'bg-pink-400/25 text-pink-400' }
  return map[type] || 'bg-gray-400/25 text-gray-400'
}
const typeLabel = (type) => {
  const map = { 'web-app': 'Web App', 'mobile-app': 'Mobile App', 'website': 'Website', 'ui-ux': 'UI/UX Design' }
  return map[type] || type
}
const typeStyle = (type) => {
  const map = { 'web-app': 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30', 'mobile-app': 'bg-fuchsia-400/20 text-fuchsia-400 border border-fuchsia-400/30', 'website': 'bg-amber-400/20 text-amber-400 border border-amber-400/30', 'ui-ux': 'bg-pink-400/20 text-pink-400 border border-pink-400/30' }
  return map[type] || 'bg-gray-400/20 text-gray-400'
}

// ── Modal ─────────────────────────────────────────────────────────────────────
const openModal = (project) => { activeProject.value = project; activeSlide.value = 0; document.body.style.overflow = 'hidden' }
const closeModal = () => { activeProject.value = null; activeSlide.value = 0; document.body.style.overflow = '' }
const nextSlide = () => { activeSlide.value = (activeSlide.value + 1) % allImages.value.length }
const prevSlide = () => { activeSlide.value = (activeSlide.value - 1 + allImages.value.length) % allImages.value.length }

// ── Lightbox ──────────────────────────────────────────────────────────────────
const openLightbox = (idx) => { lightboxSrc.value = allImages.value[idx] }
const closeLightbox = () => { lightboxSrc.value = null }
</script>

<style scoped>
.project-img { height: 180px; background: #0d1117; }

/* Type tooltip */
.type-tooltip-wrapper { position: relative; display: inline-block; }
.type-tooltip {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(13,17,23,0.95);
  border: 1px solid rgba(34,211,238,0.3);
  color: #e2e8f0;
  font-size: 11px;
  font-family: 'Exo 2', sans-serif;
  white-space: nowrap;
  padding: 4px 8px;
  border-radius: 6px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease;
  z-index: 100;
}
.type-tooltip-wrapper:hover .type-tooltip { opacity: 1; }

/* Modal */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 9000;
  background: rgba(3,7,18,0.9);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
}
.modal-box {
  width: 100%; max-width: 680px; max-height: 90vh;
  overflow-y: auto;
  background: rgba(13,17,23,0.98);
  border: 1px solid rgba(34,211,238,0.25);
}
.screenshot-area { height: 280px; }
@media (min-width: 640px) { .screenshot-area { height: 360px; } }

/* Lightbox */
.lightbox-backdrop {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,0.93);
  backdrop-filter: blur(12px);
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
  cursor: zoom-out;
}
.lightbox-inner {
  position: relative;
  max-width: 95vw;
  max-height: 95vh;
  cursor: default;
}
.lightbox-img {
  max-width: 95vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 12px;
  border: 1px solid rgba(34,211,238,0.2);
  box-shadow: 0 0 60px rgba(34,211,238,0.1);
}

.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }

.lightbox-enter-active, .lightbox-leave-active { transition: all 0.2s ease; }
.lightbox-enter-from, .lightbox-leave-to { opacity: 0; transform: scale(0.97); }
</style>
