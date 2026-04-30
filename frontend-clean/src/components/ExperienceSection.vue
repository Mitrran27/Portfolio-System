<template>
  <section id="experience" class="py-20 px-4" ref="sectionRef">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="font-orbitron font-bold text-gray-900" style="font-size:clamp(1.6rem,4vw,2.8rem)">
          <span class="text-blue-700 neon-text">Work</span>
          <span class="text-gray-900"> Experience</span>
        </h2>
        <div class="flex items-center justify-center gap-3 mt-4">
          <div class="h-px w-16 bg-gradient-to-r from-transparent to-blue-500" />
          <div class="w-2 h-2 rounded-full bg-cyan-400" />
          <div class="h-px w-16 bg-gradient-to-l from-transparent to-blue-500" />
        </div>
      </div>

      <div v-if="!experiences?.length" class="text-center text-gray-400 font-exo py-12">No experience entries yet.</div>

      <div v-else class="relative">
        <!-- Timeline line -->
        <div class="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/60 via-red-400/40 to-transparent hidden md:block" />

        <div class="space-y-6">
          <div v-for="(exp, i) in experiences" :key="exp.id"
            :class="['relative md:pl-16 section-fade cursor-pointer', visible ? 'visible' : '']"
            :style="{ transitionDelay: (i * 0.1) + 's' }"
            @click="selected = exp">
            <!-- Dot -->
            <div class="absolute left-4 top-5 w-5 h-5 rounded-full border-4 border-white hidden md:flex items-center justify-center"
              :class="i % 2 === 0 ? 'bg-cyan-400' : 'bg-fuchsia-500'" />

            <div class="card-glass rounded-2xl p-5 hover:border-blue-500/40 transition-all group">
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                <div>
                  <h3 class="text-gray-900 font-orbitron font-bold text-sm">{{ exp.role }}</h3>
                  <p class="text-red-600 text-sm font-exo mt-0.5">{{ exp.company }}</p>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <span class="text-gray-400 text-xs font-exo">{{ exp.period }}</span>
                  <span class="text-xs text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity font-exo">
                    View details →
                  </span>
                </div>
              </div>
              <ul v-if="exp.bullets?.length" class="space-y-1 mt-3">
                <li v-for="bullet in exp.bullets.slice(0,2)" :key="bullet"
                  class="text-gray-400 text-xs font-exo flex gap-2">
                  <span class="text-blue-700 flex-shrink-0 mt-0.5">▹</span>{{ bullet }}
                </li>
                <li v-if="exp.bullets.length > 2" class="text-gray-400 text-xs font-exo pl-4">
                  +{{ exp.bullets.length - 2 }} more...
                </li>
              </ul>
              <div v-if="exp.tech_stack?.length" class="flex flex-wrap gap-1 mt-3">
                <span v-for="t in exp.tech_stack.slice(0,4)" :key="t" class="tech-tag">{{ t }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal (reusable AppModal pattern inline) -->
    <Transition name="modal">
      <div v-if="selected" class="modal-backdrop" @click.self="selected = null">
        <div class="modal-box card-glass rounded-2xl overflow-hidden">
          <div class="flex items-start justify-between p-5 border-b border-blue-500/20">
            <div>
              <h3 class="text-gray-900 font-orbitron font-bold">{{ selected.role }}</h3>
              <p class="text-red-600 text-sm font-exo mt-0.5">{{ selected.company }}</p>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-gray-400 text-xs font-exo">{{ selected.period }}</span>
              <button @click="selected = null" class="text-gray-400 hover:text-gray-900 transition-colors p-1">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="p-5 space-y-4 overflow-y-auto" style="max-height:65vh">
            <p v-if="selected.description" class="text-gray-400 font-exo text-sm leading-relaxed">{{ selected.description }}</p>
            <div v-if="selected.bullets?.length">
              <p class="text-gray-400 text-xs font-exo uppercase tracking-wider mb-3">Highlights</p>
              <ul class="space-y-2">
                <li v-for="b in selected.bullets" :key="b" class="text-gray-400 text-sm font-exo flex gap-3">
                  <span class="text-blue-700 flex-shrink-0 mt-0.5">▹</span>{{ b }}
                </li>
              </ul>
            </div>
            <div v-if="selected.tech_stack?.length">
              <p class="text-gray-400 text-xs font-exo uppercase tracking-wider mb-2">Technologies</p>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="t in selected.tech_stack" :key="t" class="tech-tag">{{ t }}</span>
              </div>
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

defineProps({ experiences: Array })

const sectionRef = ref(null)
const visible = ref(false)
const selected = ref(null)

useIntersectionObserver(sectionRef, ([{ isIntersecting }]) => {
  if (isIntersecting) visible.value = true
}, { threshold: 0.05 })
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0; z-index: 9000;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center; padding: 16px;
}
.modal-box { width: 100%; max-width: 600px; background: #ffffff; border: 1px solid #bfdbfe; }
.modal-enter-active, .modal-leave-active { transition: all 0.22s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.96) translateY(8px); }
</style>
