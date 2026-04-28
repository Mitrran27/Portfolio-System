<template>
  <section id="about" class="py-24 px-6 border-t border-white/[0.05]" ref="sectionRef">
    <div class="max-w-6xl mx-auto">

      <!-- Header -->
      <div class="mb-16">
        <p class="accent-line text-white/30 text-xs font-body tracking-[0.2em] uppercase mb-4">Who I Am</p>
        <h2 class="font-display text-white" style="font-size:clamp(2rem,4.5vw,3.5rem)">
          About <em>Me</em>
        </h2>
      </div>

      <div class="grid lg:grid-cols-2 gap-16 items-start">

        <!-- Left: Text -->
        <div :class="['space-y-8 section-fade', visible ? 'visible' : '']" style="transition-delay:0.1s">
          <p class="text-white/55 font-body leading-relaxed text-base">{{ info?.bio }}</p>

          <div class="grid grid-cols-2 gap-3 pt-2">
            <InfoChip label="Location" :value="info?.location" />
            <InfoChip label="Email" :value="info?.email" />
            <InfoChip
              label="Status"
              :value="info?.available_for_work ? 'Open to work' : 'Not available'"
              :highlight="info?.available_for_work" />
          </div>

          <div v-if="info?.resume_url" class="pt-2">
            <a :href="info.resume_url" target="_blank" class="btn-neon inline-block px-8 py-3 rounded text-sm tracking-wide">
              Download Resume ↗
            </a>
          </div>
        </div>

        <!-- Right: Stats -->
        <div :class="['grid grid-cols-2 gap-4 section-fade', visible ? 'visible' : '']" style="transition-delay:0.2s">
          <StatBox v-for="stat in stats" :key="stat.label" v-bind="stat" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, defineComponent, h } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

defineProps({ info: Object })

const sectionRef = ref(null)
const visible = ref(false)
useIntersectionObserver(sectionRef, ([{ isIntersecting }]) => { if (isIntersecting) visible.value = true }, { threshold: 0.15 })

const stats = [
  { number: '3+',   label: 'Years Experience' },
  { number: '20+',  label: 'Projects Built' },
  { number: '10+',  label: 'Technologies' },
  { number: '100%', label: 'Passion' },
]

const InfoChip = defineComponent({
  props: ['label', 'value', 'highlight'],
  template: `
    <div class="p-4 border border-white/[0.07] rounded">
      <p class="text-white/25 text-[10px] font-body tracking-[0.15em] uppercase mb-1.5">{{ label }}</p>
      <p :class="['text-sm font-body', highlight ? 'text-red-500' : 'text-white/70']">
        {{ value || '—' }}
      </p>
    </div>
  `
})

const StatBox = defineComponent({
  props: ['number', 'label'],
  template: `
    <div class="p-6 border border-white/[0.07] rounded group hover:border-red-700/40 transition-all">
      <p class="font-display text-white mb-1" style="font-size:clamp(2rem,4vw,3rem)">{{ number }}</p>
      <p class="text-white/30 text-xs font-body tracking-wide uppercase">{{ label }}</p>
      <div class="mt-3 h-px w-0 bg-red-700 group-hover:w-8 transition-all duration-500" />
    </div>
  `
})
</script>