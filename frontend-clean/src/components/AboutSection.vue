<template>
  <section id="about" class="py-24 px-6" ref="sectionRef">
    <div class="max-w-6xl mx-auto">
      <SectionHeader title="About" accent="Me" />

      <div class="grid lg:grid-cols-2 gap-12 items-center mt-14">
        <!-- Left: Text -->
        <div :class="['space-y-6 section-fade', visible ? 'visible' : '']" style="transition-delay:0.1s">
          <p class="text-gray-400 font-exo leading-relaxed text-base">{{ info?.bio }}</p>

          <div class="grid grid-cols-2 gap-4 pt-4">
            <InfoChip label="Location" :value="info?.location" icon="📍" />
            <InfoChip label="Email" :value="info?.email" icon="✉" />
            <InfoChip label="Status"
              :value="info?.available_for_work ? 'Open to work' : 'Not available'"
              :accent="info?.available_for_work ? 'green' : 'gray'"
              icon="💼" />
          </div>

          <div v-if="info?.resume_url" class="pt-2">
            <a :href="info.resume_url" target="_blank"
              class="btn-neon inline-block px-8 py-3 rounded-xl text-sm">
              Download Resume ↗
            </a>
          </div>
        </div>

        <!-- Right: decorative stats -->
        <div :class="['grid grid-cols-2 gap-4 section-fade', visible ? 'visible' : '']" style="transition-delay:0.25s">
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
  { number: '3+', label: 'Years Experience', icon: '⚡' },
  { number: '20+', label: 'Projects Built', icon: '🚀' },
  { number: '10+', label: 'Technologies', icon: '⚙' },
  { number: '100%', label: 'Passion', icon: '❤' },
]

const SectionHeader = defineComponent({
  props: ['title', 'accent'],
  template: `
    <div class="text-center">
      <h2 class="font-orbitron font-bold text-gray-900" style="font-size:clamp(1.8rem,4vw,2.8rem)">
        <span class="text-blue-700 neon-text">{{ title }}</span>
        <span class="text-gray-900"> {{ accent }}</span>
      </h2>
      <div class="flex items-center justify-center gap-3 mt-4">
        <div class="h-px w-16 bg-gradient-to-r from-transparent to-blue-500" />
        <div class="w-2 h-2 rounded-full bg-cyan-400" />
        <div class="h-px w-16 bg-gradient-to-l from-transparent to-blue-500" />
      </div>
    </div>
  `
})

const InfoChip = defineComponent({
  props: ['label', 'value', 'icon', 'accent'],
  template: `
    <div class="card-glass rounded-xl p-4">
      <p class="text-gray-400 text-xs font-exo mb-1">{{ icon }} {{ label }}</p>
      <p :class="['text-sm font-exo font-medium', accent === 'green' ? 'text-green-400' : 'text-gray-900']">
        {{ value || '—' }}
      </p>
    </div>
  `
})

const StatBox = defineComponent({
  props: ['number', 'label', 'icon'],
  template: `
    <div class="card-glass rounded-2xl p-6 text-center hover:border-blue-500/40 transition-all group">
      <span class="text-3xl block mb-2">{{ icon }}</span>
      <p class="font-orbitron font-black text-blue-700 text-3xl">{{ number }}</p>
      <p class="text-gray-400 text-xs font-exo mt-2">{{ label }}</p>
    </div>
  `
})
</script>
