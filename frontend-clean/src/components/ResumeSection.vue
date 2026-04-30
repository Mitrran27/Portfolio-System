<template>
  <section id="resume" class="py-20 px-4" ref="sectionRef" v-if="info?.resume_url">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="font-orbitron font-bold" style="font-size:clamp(1.6rem,4vw,2.8rem)">
          <span class="text-blue-700 neon-text">My</span>
          <span class="text-gray-900"> Resume</span>
        </h2>
        <div class="flex items-center justify-center gap-3 mt-4">
          <div class="h-px w-16 bg-gradient-to-r from-transparent to-blue-500" />
          <div class="w-2 h-2 rounded-full bg-cyan-400" />
          <div class="h-px w-16 bg-gradient-to-l from-transparent to-blue-500" />
        </div>
      </div>

      <!-- Main card — v4 layout: iframe left, actions right -->
      <div :class="['card-glass rounded-2xl p-6 md:p-8 gradient-border section-fade', visible ? 'visible' : '']">
        <div class="flex flex-col md:flex-row gap-6">

          <!-- PDF iframe viewer -->
          <div class="flex-1 bg-gray-50 rounded-xl overflow-hidden border border-gray-200/80"
            style="min-height: 380px;">
            <iframe :src="info.resume_url"
              class="w-full h-full border-0"
              style="min-height: 380px;"
              title="Resume PDF Viewer" />
          </div>

          <!-- Action buttons — v4 style -->
          <div class="flex flex-col gap-4 md:w-52">
            <div>
              <p class="text-blue-700 font-exo font-semibold text-sm mb-4">Quick Actions</p>

              <!-- Open in New Tab button — cyan/teal style from v4 -->
              <a :href="info.resume_url" target="_blank" rel="noopener noreferrer"
                class="cv-btn-primary w-full px-5 py-3 rounded-xl font-exo font-semibold text-sm flex items-center gap-3 mb-3">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
                Open in New Tab
              </a>

              <!-- Download PDF button — fuchsia style from v4 -->
              <a :href="info.resume_url" download
                class="cv-btn-secondary w-full px-5 py-3 rounded-xl font-exo font-semibold text-sm flex items-center gap-3">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Download PDF
              </a>
            </div>

            <!-- Tip box — v4 style -->
            <div class="bg-gray-50 rounded-xl p-4 border border-gray-200/80 mt-auto">
              <p class="text-gray-400 text-sm font-exo leading-relaxed">
                <span class="text-yellow-400 font-semibold">💡 Tip:</span>
                Use the buttons above to view or download my complete resume with all my experience, education, and projects.
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

<style scoped>
/* Cyan/teal button — matches v4 Open in New Tab */
.cv-btn-primary {
  background: rgba(29,78,216,0.08);
  border: 1.5px solid rgba(29,78,216,0.5);
  color: #1d4ed8;
  transition: all 0.3s ease;
}
.cv-btn-primary:hover {
  background: rgba(29,78,216,0.14);
  box-shadow: 0 4px 12px rgba(29,78,216,0.18);
  transform: translateY(-1px);
}

/* Fuchsia button — matches v4 Download PDF */
.cv-btn-secondary {
  background: rgba(220,38,38,0.07);
  border: 1.5px solid rgba(220,38,38,0.5);
  color: #dc2626;
  transition: all 0.3s ease;
}
.cv-btn-secondary:hover {
  background: rgba(220,38,38,0.12);
  box-shadow: 0 4px 12px rgba(220,38,38,0.18);
  transform: translateY(-1px);
}
</style>
