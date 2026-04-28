<template>
  <section id="resume" class="py-24 px-6 border-t border-white/[0.05]" ref="sectionRef" v-if="info?.resume_url">
    <div class="max-w-4xl mx-auto">

      <!-- Header -->
      <div class="mb-16">
        <p class="accent-line text-white/30 text-xs font-body tracking-[0.2em] uppercase mb-4">CV</p>
        <h2 class="font-display text-white" style="font-size:clamp(2rem,4.5vw,3.5rem)">
          My <em>Resume</em>
        </h2>
      </div>

      <div :class="['section-fade', visible ? 'visible' : '']">
        <div class="flex flex-col md:flex-row gap-6">

          <!-- PDF iframe viewer -->
          <div class="flex-1 overflow-hidden border border-white/[0.07]" style="min-height: 400px;">
            <iframe :src="info.resume_url"
              class="w-full h-full border-0"
              style="min-height: 400px;"
              title="Resume PDF Viewer" />
          </div>

          <!-- Actions -->
          <div class="flex flex-col gap-3 md:w-48">
            <p class="text-white/25 text-[10px] font-body tracking-[0.18em] uppercase mb-1">Actions</p>

            <a :href="info.resume_url" target="_blank" rel="noopener noreferrer"
              class="cv-btn-primary w-full px-4 py-3 text-sm font-body flex items-center gap-3 border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-all">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              Open in New Tab
            </a>

            <a :href="info.resume_url" download
              class="cv-btn-secondary btn-neon w-full px-4 py-3 text-sm font-body flex items-center gap-3">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Download PDF
            </a>

            <div class="mt-auto border border-white/[0.06] p-4">
              <p class="text-white/25 text-xs font-body leading-relaxed">
                View or download my complete resume with all experience, education, and projects.
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
.cv-btn-primary { transition: all 0.2s ease; }
.cv-btn-primary:hover { transform: translateY(-1px); }
</style>