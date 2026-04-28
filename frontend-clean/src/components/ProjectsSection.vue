<template>
  <section id="projects" class="py-24 px-6 border-t border-white/[0.05]" ref="sectionRef">
    <div class="max-w-6xl mx-auto">

      <!-- Header -->
      <div class="mb-16">
        <p class="accent-line text-white/30 text-xs font-body tracking-[0.2em] uppercase mb-4">Portfolio</p>
        <h2 class="font-display text-white" style="font-size:clamp(2rem,4.5vw,3.5rem)">
          Selected <em>Projects</em>
        </h2>
      </div>

      <div v-if="!projects?.length" class="text-white/20 font-body py-12">No projects added yet.</div>

      <template v-else>
        <!-- Category filter tabs -->
        <div class="flex flex-wrap gap-2 mb-10">
          <button
            v-for="cat in availableCategories"
            :key="cat.value"
            @click="activeCategory = cat.value"
            class="px-4 py-1.5 text-xs font-body tracking-wide transition-all border rounded-sm"
            :class="activeCategory === cat.value
              ? 'border-red-700 bg-red-700/10 text-red-500'
              : 'border-white/[0.08] text-white/30 hover:border-white/20 hover:text-white/55'">
            {{ cat.label }}
            <span class="ml-1 opacity-50">({{ cat.count }})</span>
          </button>
        </div>

        <!-- Grid -->
        <Transition name="fade-grid" mode="out-in">
          <div :key="activeCategory" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <div v-for="(project, i) in filteredProjects" :key="project.id"
              :class="['group cursor-pointer section-fade border border-white/[0.07] hover:border-white/15 transition-all overflow-hidden', visible ? 'visible' : '']"
              :style="{ transitionDelay: (i * 0.07) + 's' }"
              @click="openModal(project)">

              <!-- Image -->
              <div class="project-img relative overflow-hidden"
                :style="{ backgroundColor: project.image_url ? (project.logo_bg_color || '#111111') : '#111111' }">
                <img v-if="project.image_url" :src="project.image_url" :alt="project.title"
                  class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <span class="text-white/10 text-4xl">▪</span>
                </div>

                <!-- Overlay -->
                <div class="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span class="text-white text-xs font-body tracking-widest uppercase border border-white/30 px-5 py-2">
                    View Details
                  </span>
                </div>

                <!-- Type badges -->
                <div class="absolute top-2 left-2 flex gap-1">
                  <div v-for="t in projectTypes(project)" :key="t"
                    class="type-tooltip-wrapper">
                    <span :class="typeIconBg(t)" class="flex items-center justify-center w-6 h-6 rounded-sm">
                      <component :is="typeIconComponent(t)" class="w-3.5 h-3.5" />
                    </span>
                    <span class="type-tooltip">{{ typeLabel(t) }}</span>
                  </div>
                </div>

                <div v-if="project.featured"
                  class="absolute top-2 right-2 text-[10px] border border-red-700/50 text-red-600 px-2 py-0.5 font-body tracking-widest uppercase backdrop-blur-sm">
                  Featured
                </div>
              </div>

              <!-- Info -->
              <div class="p-5">
                <h3 class="text-white font-body font-medium text-sm mb-1.5">{{ project.title }}</h3>
                <p class="text-white/35 text-xs font-body leading-relaxed line-clamp-2 mb-4">{{ project.description }}</p>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="tech in (project.tech_stack || []).slice(0, 4)" :key="tech" class="tech-tag">{{ tech }}</span>
                  <span v-if="(project.tech_stack || []).length > 4" class="tech-tag">+{{ project.tech_stack.length - 4 }}</span>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </template>
    </div>

    <!-- Project Modal -->
    <Transition name="modal">
      <div v-if="activeProject" class="modal-backdrop" @click.self="closeModal">
        <div class="modal-box overflow-hidden">
          <!-- Header -->
          <div class="flex items-start justify-between p-6 border-b border-white/[0.06]">
            <div>
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <h3 class="text-white font-body font-semibold">{{ activeProject.title }}</h3>
                <span v-for="t in projectTypes(activeProject)" :key="t"
                  :class="typeStyle(t)"
                  class="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 font-body tracking-wide uppercase">
                  <component :is="typeIconComponent(t)" class="w-3 h-3" />
                  {{ typeLabel(t) }}
                </span>
              </div>
              <div v-if="activeProject.featured" class="text-red-600 text-[10px] font-body tracking-widest uppercase">Featured Project</div>
            </div>
            <button @click="closeModal" class="text-white/25 hover:text-white transition-colors p-1 ml-4">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Gallery -->
          <div v-if="allImages.length" class="screenshot-area relative bg-black overflow-hidden">
            <img :src="allImages[activeSlide]" :alt="activeProject.title"
              class="w-full h-full object-contain cursor-zoom-in transition-opacity duration-300"
              @click.stop="openLightbox(activeSlide)" />
            <button v-if="allImages.length > 1" @click="prevSlide"
              class="absolute left-3 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white w-8 h-8 flex items-center justify-center border border-white/10 transition-all">‹</button>
            <button v-if="allImages.length > 1" @click="nextSlide"
              class="absolute right-3 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white w-8 h-8 flex items-center justify-center border border-white/10 transition-all">›</button>
            <div v-if="allImages.length > 1" class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              <button v-for="(_, idx) in allImages" :key="idx" @click="activeSlide = idx"
                :class="['h-px transition-all', idx === activeSlide ? 'w-6 bg-red-600' : 'w-3 bg-white/30']" />
            </div>
            <div v-if="allImages.length > 1" class="absolute top-3 right-3 text-white/40 text-xs font-body">
              {{ activeSlide + 1 }}/{{ allImages.length }}
            </div>
          </div>
          <div v-else class="screenshot-area flex items-center justify-center bg-[#0d0d0d]">
            <span class="text-white/10 text-6xl">▪</span>
          </div>

          <!-- Thumbnail strip -->
          <div v-if="allImages.length > 1" class="flex gap-2 px-4 py-2 overflow-x-auto bg-black/40 border-b border-white/[0.05]">
            <button v-for="(img, idx) in allImages" :key="idx" @click="activeSlide = idx"
              :class="['flex-shrink-0 w-12 h-9 overflow-hidden border transition-all',
                idx === activeSlide ? 'border-red-700' : 'border-transparent opacity-40 hover:opacity-70']">
              <img :src="img" class="w-full h-full object-cover" />
            </button>
          </div>

          <!-- Details -->
          <div class="p-6 space-y-5">
            <p class="text-white/50 font-body text-sm leading-relaxed">{{ activeProject.description }}</p>
            <div v-if="activeProject.tech_stack?.length">
              <p class="text-white/20 text-[10px] font-body tracking-[0.18em] uppercase mb-2">Tech Stack</p>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="tech in activeProject.tech_stack" :key="tech" class="tech-tag">{{ tech }}</span>
              </div>
            </div>
            <div class="flex gap-3 pt-1">
              <a v-if="activeProject.live_url" :href="activeProject.live_url" target="_blank"
                class="btn-solid flex-1 py-2.5 text-xs tracking-widest uppercase text-center" @click.stop>
                Live Demo ↗
              </a>
              <a v-if="activeProject.github_url" :href="activeProject.github_url" target="_blank"
                class="btn-neon flex-1 py-2.5 text-xs tracking-widest uppercase text-center" @click.stop>
                View Code
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Lightbox -->
    <Transition name="lightbox">
      <div v-if="lightboxSrc" class="lightbox-backdrop" @click="closeLightbox">
        <div class="lightbox-inner" @click.stop>
          <img :src="lightboxSrc" class="lightbox-img" />
          <button @click="closeLightbox"
            class="absolute top-4 right-4 w-9 h-9 bg-black/80 hover:bg-black text-white border border-white/10 flex items-center justify-center text-sm transition-all">
            ✕
          </button>
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/25 text-xs font-body tracking-wide">
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

const props = defineProps({ projects: Array })

const sectionRef = ref(null)
const visible = ref(false)
const activeProject = ref(null)
const activeSlide = ref(0)
const lightboxSrc = ref(null)
const activeCategory = ref('all')

useIntersectionObserver(sectionRef, ([{ isIntersecting }]) => {
  if (isIntersecting) visible.value = true
}, { threshold: 0.05 })

const ALL_TYPES = [
  { value: 'all',        label: 'All' },
  { value: 'web-app',    label: 'Web App' },
  { value: 'website',    label: 'Website' },
  { value: 'mobile-app', label: 'Mobile App' },
  { value: 'ui-ux',      label: 'UI/UX' },
  { value: 'ai',         label: 'AI' },
]

const projectTypes = (project) => {
  if (project.project_types?.length) return project.project_types
  if (project.project_type) return [project.project_type]
  return []
}

const availableCategories = computed(() => {
  if (!props.projects?.length) return []
  const counts = {}
  let total = 0
  for (const p of props.projects) {
    total++
    for (const t of projectTypes(p)) { counts[t] = (counts[t] || 0) + 1 }
  }
  const tabs = [{ value: 'all', label: 'All', count: total }]
  for (const opt of ALL_TYPES.slice(1)) {
    if (counts[opt.value]) tabs.push({ ...opt, count: counts[opt.value] })
  }
  return tabs
})

const filteredProjects = computed(() => {
  if (!props.projects) return []
  if (activeCategory.value === 'all') return props.projects
  return props.projects.filter(p => projectTypes(p).includes(activeCategory.value))
})

const allImages = computed(() => {
  if (!activeProject.value) return []
  const imgs = []
  if (activeProject.value.image_url) imgs.push(activeProject.value.image_url)
  if (activeProject.value.screenshots?.length) {
    activeProject.value.screenshots.forEach(s => { if (s && !imgs.includes(s)) imgs.push(s) })
  }
  return imgs
})

// Type icons (unchanged logic)
const IconMobile = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' })]) })
const IconGlobe = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' })]) })
const IconMonitor = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' })]) })
const IconPencil = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' })]) })
const IconAI = defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1-.28 2.28-1.28 1.28L19.8 15.3M5 14.5l-1.402 1.402c-1 1 .28 2.28 1.28 1.28L5 14.5' })]) })

const typeIconComponent = (type) => {
  const map = { 'mobile-app': IconMobile, 'web-app': IconGlobe, 'website': IconMonitor, 'ui-ux': IconPencil, 'ai': IconAI }
  return map[type] || IconGlobe
}
// Unified muted-monochrome badges (red tint for all, no rainbow)
const typeIconBg = () => 'bg-black/50 text-white/50 border border-white/10 backdrop-blur-sm'
const typeLabel = (type) => {
  const map = { 'web-app': 'Web App', 'mobile-app': 'Mobile App', 'website': 'Website', 'ui-ux': 'UI/UX', 'ai': 'AI' }
  return map[type] || type
}
const typeStyle = () => 'border border-white/10 text-white/40'

const openModal = (project) => { activeProject.value = project; activeSlide.value = 0; document.body.style.overflow = 'hidden' }
const closeModal = () => { activeProject.value = null; activeSlide.value = 0; document.body.style.overflow = '' }
const nextSlide = () => { activeSlide.value = (activeSlide.value + 1) % allImages.value.length }
const prevSlide = () => { activeSlide.value = (activeSlide.value - 1 + allImages.value.length) % allImages.value.length }
const openLightbox = (idx) => { lightboxSrc.value = allImages.value[idx] }
const closeLightbox = () => { lightboxSrc.value = null }
</script>

<style scoped>
.project-img { height: 200px; background: #111111; }

.type-tooltip-wrapper { position: relative; display: inline-block; }
.type-tooltip {
  position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%);
  background: #0a0a0a; border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.6); font-size: 10px; font-family: 'DM Sans', sans-serif;
  white-space: nowrap; padding: 4px 8px; pointer-events: none;
  opacity: 0; transition: opacity 0.15s ease; z-index: 100;
}
.type-tooltip-wrapper:hover .type-tooltip { opacity: 1; }

.fade-grid-enter-active, .fade-grid-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.fade-grid-enter-from, .fade-grid-leave-to { opacity: 0; transform: translateY(4px); }

.modal-backdrop {
  position: fixed; inset: 0; z-index: 9000;
  background: rgba(0,0,0,0.88); backdrop-filter: blur(10px);
  display: flex; align-items: center; justify-content: center; padding: 16px;
}
.modal-box {
  width: 100%; max-width: 680px; max-height: 90vh;
  overflow-y: auto; background: #111111;
  border: 1px solid rgba(255,255,255,0.08);
}
.screenshot-area { height: 280px; }
@media (min-width: 640px) { .screenshot-area { height: 360px; } }

.lightbox-backdrop {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,0.95); backdrop-filter: blur(16px);
  display: flex; align-items: center; justify-content: center; padding: 16px; cursor: zoom-out;
}
.lightbox-inner { position: relative; max-width: 95vw; max-height: 95vh; cursor: default; }
.lightbox-img {
  max-width: 95vw; max-height: 90vh; object-fit: contain;
  border: 1px solid rgba(255,255,255,0.06);
}

.modal-enter-active, .modal-leave-active { transition: all 0.22s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.96); }

.lightbox-enter-active, .lightbox-leave-active { transition: all 0.18s ease; }
.lightbox-enter-from, .lightbox-leave-to { opacity: 0; transform: scale(0.98); }
</style>