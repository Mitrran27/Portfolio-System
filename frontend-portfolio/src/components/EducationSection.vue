<template>
  <section id="education" class="py-20 px-4 bg-black/10" ref="sectionRef">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="font-orbitron font-bold text-white" style="font-size:clamp(1.6rem,4vw,2.8rem)">
          <span class="text-fuchsia-400 neon-text-fuchsia">Edu</span>
          <span class="text-white">cation</span>
        </h2>
        <div class="flex items-center justify-center gap-3 mt-4">
          <div class="h-px w-16 bg-gradient-to-r from-transparent to-fuchsia-400" />
          <div class="w-2 h-2 rounded-full bg-fuchsia-400" />
          <div class="h-px w-16 bg-gradient-to-l from-transparent to-fuchsia-400" />
        </div>
      </div>

      <div v-if="!education?.length" class="text-center text-gray-600 font-exo py-12">No education entries yet.</div>

      <div v-else class="relative">
        <!-- Timeline line -->
        <div class="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-fuchsia-400/60 via-cyan-500/40 to-transparent hidden md:block" />

        <div class="space-y-6">
          <div v-for="(edu, i) in education" :key="edu.id"
            :class="['relative md:pl-16 section-fade cursor-pointer', visible ? 'visible' : '']"
            :style="{ transitionDelay: (i * 0.1) + 's' }"
            @click="selected = edu">
            <!-- Dot -->
            <div class="absolute left-4 top-5 w-5 h-5 rounded-full border-4 border-gray-900 hidden md:flex items-center justify-center"
              :class="i % 2 === 0 ? 'bg-fuchsia-500' : 'bg-cyan-400'" />

            <div class="card-glass rounded-2xl p-5 hover:border-fuchsia-400/40 transition-all group">
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                <div>
                  <h3 class="text-white font-orbitron font-bold text-sm">{{ edu.degree }}</h3>
                  <p class="text-fuchsia-400 text-sm font-exo mt-0.5">{{ edu.institution }}</p>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <span v-if="edu.grade" class="text-cyan-400 text-xs font-exo border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 rounded">
                    {{ edu.grade }}
                  </span>
                  <span class="text-gray-500 text-xs font-exo">{{ edu.period }}</span>
                  <span class="text-xs text-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity font-exo">
                    View details →
                  </span>
                </div>
              </div>
              <ul v-if="edu.bullets?.length" class="space-y-1 mt-3">
                <li v-for="bullet in edu.bullets.slice(0, 2)" :key="bullet"
                  class="text-gray-400 text-xs font-exo flex gap-2">
                  <span class="text-fuchsia-400 flex-shrink-0 mt-0.5">▹</span>{{ bullet }}
                </li>
                <li v-if="edu.bullets.length > 2" class="text-gray-600 text-xs font-exo pl-4">
                  +{{ edu.bullets.length - 2 }} more...
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <Transition name="modal">
      <div v-if="selected" class="modal-backdrop" @click.self="selected = null">
        <div class="modal-box card-glass rounded-2xl overflow-hidden">
          <div class="flex items-start justify-between p-5 border-b border-fuchsia-400/20">
            <div>
              <h3 class="text-white font-orbitron font-bold">{{ selected.degree }}</h3>
              <p class="text-fuchsia-400 text-sm font-exo mt-0.5">{{ selected.institution }}</p>
            </div>
            <div class="flex items-center gap-3">
              <span v-if="selected.grade" class="text-cyan-400 text-xs font-exo border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 rounded">
                {{ selected.grade }}
              </span>
              <span class="text-gray-500 text-xs font-exo">{{ selected.period }}</span>
              <button @click="selected = null" class="text-gray-500 hover:text-white transition-colors p-1">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="p-5 space-y-4 overflow-y-auto" style="max-height:65vh">
            <p v-if="selected.description" class="text-gray-300 font-exo text-sm leading-relaxed">{{ selected.description }}</p>
            <div v-if="selected.bullets?.length">
              <p class="text-gray-500 text-xs font-exo uppercase tracking-wider mb-3">Highlights</p>
              <ul class="space-y-2">
                <li v-for="b in selected.bullets" :key="b" class="text-gray-300 text-sm font-exo flex gap-3">
                  <span class="text-fuchsia-400 flex-shrink-0 mt-0.5">▹</span>{{ b }}
                </li>
              </ul>
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

defineProps({ education: Array })

const sectionRef = ref(null)
const visible = ref(false)
const selected = ref(null)

useIntersectionObserver(sectionRef, ([{ isIntersecting }]) => {
  if (isIntersecting) visible.value = true
}, { threshold: 0.05 })
</script>

<style scoped>
.neon-text-fuchsia { text-shadow: 0 0 20px rgba(217,70,239,0.5); }
.modal-backdrop {
  position: fixed; inset: 0; z-index: 9000;
  background: rgba(3,7,18,0.88); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center; padding: 16px;
}
.modal-box { width: 100%; max-width: 600px; background: rgba(13,17,23,0.98); border: 1px solid rgba(217,70,239,0.2); }
.modal-enter-active, .modal-leave-active { transition: all 0.22s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.96) translateY(8px); }
</style>
