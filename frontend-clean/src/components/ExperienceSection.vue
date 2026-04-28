<template>
  <section id="experience" class="py-24 px-6 border-t border-white/[0.05]" ref="sectionRef">
    <div class="max-w-4xl mx-auto">

      <!-- Header -->
      <div class="mb-16">
        <p class="accent-line text-white/30 text-xs font-body tracking-[0.2em] uppercase mb-4">Career</p>
        <h2 class="font-display text-white" style="font-size:clamp(2rem,4.5vw,3.5rem)">
          Work <em>Experience</em>
        </h2>
      </div>

      <div v-if="!experiences?.length" class="text-white/20 font-body py-12">No experience entries yet.</div>

      <div v-else class="relative">
        <!-- Timeline line -->
        <div class="absolute left-0 top-0 bottom-0 w-px bg-white/[0.06] hidden md:block" />

        <div class="space-y-2">
          <div v-for="(exp, i) in experiences" :key="exp.id"
            :class="['relative md:pl-10 section-fade cursor-pointer group', visible ? 'visible' : '']"
            :style="{ transitionDelay: (i * 0.08) + 's' }"
            @click="selected = exp">

            <!-- Timeline dot -->
            <div class="absolute left-[-4.5px] top-6 w-2.5 h-2.5 rounded-full border border-white/20 bg-[#0a0a0a] hidden md:block group-hover:border-red-600 group-hover:bg-red-600 transition-all" />

            <div class="p-6 border border-white/[0.07] rounded hover:border-white/15 transition-all mb-3">
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                <div>
                  <h3 class="text-white font-body font-semibold text-sm">{{ exp.role }}</h3>
                  <p class="text-red-600 text-sm font-body mt-0.5">{{ exp.company }}</p>
                </div>
                <div class="flex items-center gap-3 flex-shrink-0">
                  <span class="text-white/25 text-xs font-body">{{ exp.period }}</span>
                  <span class="text-white/20 text-xs font-body opacity-0 group-hover:opacity-100 transition-opacity">
                    Details →
                  </span>
                </div>
              </div>
              <ul v-if="exp.bullets?.length" class="space-y-1.5">
                <li v-for="bullet in exp.bullets.slice(0,2)" :key="bullet"
                  class="text-white/35 text-xs font-body flex gap-2.5">
                  <span class="text-red-700 flex-shrink-0 mt-0.5">—</span>{{ bullet }}
                </li>
                <li v-if="exp.bullets.length > 2" class="text-white/20 text-xs font-body pl-5">
                  +{{ exp.bullets.length - 2 }} more
                </li>
              </ul>
              <div v-if="exp.tech_stack?.length" class="flex flex-wrap gap-1.5 mt-4">
                <span v-for="t in exp.tech_stack.slice(0,5)" :key="t" class="tech-tag">{{ t }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <Transition name="modal">
      <div v-if="selected" class="modal-backdrop" @click.self="selected = null">
        <div class="modal-box border border-white/10 rounded overflow-hidden">
          <div class="flex items-start justify-between p-6 border-b border-white/[0.06]">
            <div>
              <h3 class="text-white font-body font-semibold">{{ selected.role }}</h3>
              <p class="text-red-600 text-sm font-body mt-0.5">{{ selected.company }}</p>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-white/25 text-xs font-body">{{ selected.period }}</span>
              <button @click="selected = null" class="text-white/30 hover:text-white transition-colors p-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="p-6 space-y-5 overflow-y-auto" style="max-height:65vh">
            <p v-if="selected.description" class="text-white/50 font-body text-sm leading-relaxed">{{ selected.description }}</p>
            <div v-if="selected.bullets?.length">
              <p class="text-white/20 text-[10px] font-body tracking-[0.18em] uppercase mb-3">Highlights</p>
              <ul class="space-y-2.5">
                <li v-for="b in selected.bullets" :key="b" class="text-white/55 text-sm font-body flex gap-3">
                  <span class="text-red-700 flex-shrink-0 mt-0.5">—</span>{{ b }}
                </li>
              </ul>
            </div>
            <div v-if="selected.tech_stack?.length">
              <p class="text-white/20 text-[10px] font-body tracking-[0.18em] uppercase mb-2">Technologies</p>
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
  background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; padding: 16px;
}
.modal-box { width: 100%; max-width: 600px; background: #111111; }
.modal-enter-active, .modal-leave-active { transition: all 0.22s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.97) translateY(8px); }
</style>