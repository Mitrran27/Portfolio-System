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

      <template v-else>
        <!-- Category tabs — same pattern as ProjectsSection -->
        <div class="flex flex-wrap justify-center gap-2 mb-10">
          <button
            v-for="cat in availableCategories"
            :key="cat"
            @click="activeCategory = cat"
            class="px-4 py-2 rounded-full font-exo text-sm transition-all border"
            :class="activeCategory === cat
              ? 'border-cyan-400 bg-cyan-400/15 text-cyan-300'
              : 'border-gray-700 bg-transparent text-gray-500 hover:border-gray-500 hover:text-gray-300'">
            {{ cat === 'all' ? '✦ All' : cat }}
            <span class="ml-1.5 text-xs opacity-60">({{ cat === 'all' ? skills.length : grouped[cat]?.length ?? 0 }})</span>
          </button>
        </div>

        <!-- Skills grid — filtered by active category -->
        <Transition name="fade-grid" mode="out-in">
          <div :key="activeCategory" class="space-y-10">
            <div v-for="(group, cat) in filteredGrouped" :key="cat"
              :class="['section-fade', visible ? 'visible' : '']">
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
        </Transition>
      </template>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const props = defineProps({ skills: Array })

const sectionRef = ref(null)
const visible = ref(false)
const activeCategory = ref('all')

useIntersectionObserver(sectionRef, ([{ isIntersecting }]) => { if (isIntersecting) visible.value = true }, { threshold: 0.1 })

// All skills grouped by category — unchanged from original
const grouped = computed(() => {
  if (!props.skills) return {}
  return props.skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})
})

// Tabs: 'all' + each unique category that has skills
const availableCategories = computed(() => {
  return ['all', ...Object.keys(grouped.value)]
})

// What's shown in the grid — all categories when 'all', single category otherwise
const filteredGrouped = computed(() => {
  if (activeCategory.value === 'all') return grouped.value
  const cat = activeCategory.value
  return grouped.value[cat] ? { [cat]: grouped.value[cat] } : {}
})
</script>

<style scoped>
.fade-grid-enter-active, .fade-grid-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fade-grid-enter-from, .fade-grid-leave-to { opacity: 0; transform: translateY(6px); }
</style>