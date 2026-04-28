<template>
  <section id="skills" class="py-24 px-6 border-t border-white/[0.05]" ref="sectionRef">
    <div class="max-w-6xl mx-auto">

      <!-- Header -->
      <div class="mb-16">
        <p class="accent-line text-white/30 text-xs font-body tracking-[0.2em] uppercase mb-4">What I Know</p>
        <h2 class="font-display text-white" style="font-size:clamp(2rem,4.5vw,3.5rem)">
          My <em>Skills</em>
        </h2>
      </div>

      <div v-if="!skills?.length" class="text-white/20 font-body py-12">No skills added yet.</div>

      <div v-else class="space-y-12">
        <div v-for="(group, cat) in grouped" :key="cat"
          :class="['section-fade', visible ? 'visible' : '']">

          <!-- Category label -->
          <div class="flex items-center gap-4 mb-6">
            <span class="text-red-600 text-[10px] font-body tracking-[0.2em] uppercase">{{ cat }}</span>
            <div class="flex-1 h-px bg-white/[0.06]" />
          </div>

          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="skill in group" :key="skill.id"
              class="group p-5 border border-white/[0.07] rounded hover:border-white/15 transition-all">
              <div class="flex items-center justify-between mb-4">
                <span class="text-white/80 font-body text-sm">{{ skill.name }}</span>
                <span class="text-red-600 font-body text-xs tabular-nums">{{ skill.level }}%</span>
              </div>
              <div class="skill-bar">
                <div class="skill-bar-fill" :style="{ width: visible ? skill.level + '%' : '0%' }" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const props = defineProps({ skills: Array })

const sectionRef = ref(null)
const visible = ref(false)
useIntersectionObserver(sectionRef, ([{ isIntersecting }]) => { if (isIntersecting) visible.value = true }, { threshold: 0.1 })

const grouped = computed(() => {
  if (!props.skills) return {}
  return props.skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})
})
</script>