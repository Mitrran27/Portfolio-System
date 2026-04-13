<template>
  <section id="resume" class="py-20 px-4" ref="sectionRef" v-if="info?.resume_url">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="font-orbitron font-bold text-white" style="font-size:clamp(1.6rem,4vw,2.8rem)">
          <span class="text-cyan-400 neon-text">My</span>
          <span class="text-white"> Resume</span>
        </h2>
        <div class="flex items-center justify-center gap-3 mt-4">
          <div class="h-px w-16 bg-gradient-to-r from-transparent to-cyan-400" />
          <div class="w-2 h-2 rounded-full bg-cyan-400" />
          <div class="h-px w-16 bg-gradient-to-l from-transparent to-cyan-400" />
        </div>
      </div>

      <div :class="['card-glass rounded-2xl p-6 gradient-border section-fade', visible ? 'visible' : '']">
        <div class="flex flex-col md:flex-row gap-6">
          <!-- PDF iframe -->
          <div class="flex-1 bg-gray-900 rounded-xl overflow-hidden border border-gray-700/50 h-80 md:h-96 flex items-center justify-center relative">
            <iframe v-if="info.resume_url" :src="info.resume_url"
              class="w-full h-full border-0" title="Resume PDF" />
            <div v-else class="text-center text-gray-600">
              <svg class="w-12 h-12 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <p class="font-exo text-sm">No resume URL set</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col gap-4 md:w-48">
            <div>
              <p class="text-cyan-400 text-sm font-exo font-medium mb-3">Quick Actions</p>
              <a :href="info.resume_url" target="_blank" rel="noopener noreferrer"
                class="btn-neon w-full px-4 py-3 rounded-xl text-sm font-exo flex items-center justify-center gap-2 mb-3">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
                Open in New Tab
              </a>
              <a :href="info.resume_url" download
                class="w-full px-4 py-3 rounded-xl text-sm font-exo flex items-center justify-center gap-2 border border-fuchsia-400/50 text-fuchsia-400 hover:bg-fuchsia-400/10 transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Download PDF
              </a>
            </div>

            <div class="bg-black/30 rounded-xl p-4 border border-cyan-400/10 mt-auto">
              <p class="text-gray-400 text-xs font-exo leading-relaxed">
                <span class="text-cyan-400 font-medium">💡 Tip:</span>
                Use the buttons above to view or download my complete resume.
              </p>
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

defineProps({ info: Object })

const sectionRef = ref(null)
const visible = ref(false)
useIntersectionObserver(sectionRef, ([{ isIntersecting }]) => {
  if (isIntersecting) visible.value = true
}, { threshold: 0.05 })
</script>
