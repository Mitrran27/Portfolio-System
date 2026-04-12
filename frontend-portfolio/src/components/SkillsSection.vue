<template>
  <section id="skills" class="py-24 px-6" ref="sectionRef">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-14">
        <h2 class="font-orbitron font-bold text-white" style="font-size:clamp(1.8rem,4vw,2.8rem)">
          <span class="text-cyan-400 neon-text">My</span>
          <span class="text-white"> Skills</span>
        </h2>
        <div class="flex items-center justify-center gap-3 mt-4">
          <div class="h-px w-16 bg-gradient-to-r from-transparent to-cyan-400" />
          <div class="w-2 h-2 rounded-full bg-cyan-400" />
          <div class="h-px w-16 bg-gradient-to-l from-transparent to-cyan-400" />
        </div>
      </div>

      <div v-if="!skills?.length" class="text-center text-gray-600 font-exo py-12">No skills added yet.</div>

      <div v-else class="space-y-10">
        <div v-for="(group, cat) in grouped" :key="cat" :class="['section-fade', visible ? 'visible' : '']">
          <h3 class="text-fuchsia-400 font-orbitron text-sm tracking-widest mb-5 uppercase">{{ cat }}</h3>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="skill in group" :key="skill.id"
              class="card-glass rounded-xl p-5 hover:border-cyan-400/30 transition-all group">
              <div class="flex items-center justify-between mb-3">
                <span class="text-white font-exo text-sm font-medium">{{ skill.name }}</span>
                <span class="text-cyan-400 font-orbitron text-sm">{{ skill.level }}%</span>
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
