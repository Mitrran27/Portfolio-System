<template>
  <section id="about" class="py-24 px-6" ref="sectionRef">
    <div class="max-w-6xl mx-auto">
      <SectionHeader title="About" accent="Me" />

      <div class="mt-14">
        <div :class="['about-container section-fade', visible ? 'visible' : '']">

          <!-- LEFT: Full portrait, anchored top, no crop -->
          <div class="portrait-col">
            <img :src="portraitSrc" alt="Mitrran" class="portrait-img" />
            <div class="fade-right" />
            <div class="fade-top" />
            <div class="fade-bottom" />
          </div>

          <!-- RIGHT: Bio text, chips, resume -->
          <div class="content-col space-y-6">
            <p class="text-gray-200 font-exo leading-relaxed text-base">{{ info?.bio }}</p>

            <div class="grid grid-cols-2 gap-3 pt-2">
              <InfoChip label="Location" :value="info?.location" icon="📍" />
              <InfoChip label="Email"    :value="info?.email"    icon="✉"  />
              <InfoChip
                label="Status"
                :value="info?.available_for_work ? 'Open to work' : 'Not available'"
                :accent="info?.available_for_work ? 'green' : 'gray'"
                icon="💼"
              />
            </div>

            <div v-if="info?.resume_url" class="pt-2">
              <a :href="info.resume_url" target="_blank"
                class="btn-neon inline-block px-8 py-3 rounded-xl text-sm">
                Download Resume ↗
              </a>
            </div>
          </div>
        </div>

        <!-- Stats row -->
        <div
          :class="['grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 section-fade', visible ? 'visible' : '']"
          style="transition-delay:0.3s"
        >
          <StatBox v-for="stat in stats" :key="stat.label" v-bind="stat" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, defineComponent } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import portraitSrc from '@/assets/about-avatar.png'

defineProps({ info: Object })

const sectionRef = ref(null)
const visible = ref(false)
useIntersectionObserver(
  sectionRef,
  ([{ isIntersecting }]) => { if (isIntersecting) visible.value = true },
  { threshold: 0.1 }
)

const stats = [
  { number: '3+',   label: 'Years Experience', icon: '⚡' },
  { number: '20+',  label: 'Projects Built',   icon: '🚀' },
  { number: '10+',  label: 'Technologies',     icon: '⚙'  },
  { number: '100%', label: 'Passion',          icon: '❤'  },
]

const SectionHeader = defineComponent({
  props: ['title', 'accent'],
  template: `
    <div class="text-center">
      <h2 class="font-orbitron font-bold text-white" style="font-size:clamp(1.8rem,4vw,2.8rem)">
        <span class="text-cyan-400 neon-text">{{ title }}</span>
        <span class="text-white"> {{ accent }}</span>
      </h2>
      <div class="flex items-center justify-center gap-3 mt-4">
        <div class="h-px w-16 bg-gradient-to-r from-transparent to-cyan-400" />
        <div class="w-2 h-2 rounded-full bg-cyan-400" />
        <div class="h-px w-16 bg-gradient-to-l from-transparent to-cyan-400" />
      </div>
    </div>
  `
})

const InfoChip = defineComponent({
  props: ['label', 'value', 'icon', 'accent'],
  template: `
    <div class="card-glass rounded-xl p-4">
      <p class="text-gray-500 text-xs font-exo mb-1">{{ icon }} {{ label }}</p>
      <p :class="['text-sm font-exo font-medium', accent === 'green' ? 'text-green-400' : 'text-white']">
        {{ value || '—' }}
      </p>
    </div>
  `
})

const StatBox = defineComponent({
  props: ['number', 'label', 'icon'],
  template: `
    <div class="card-glass rounded-2xl p-6 text-center hover:border-cyan-400/40 transition-all group">
      <span class="text-3xl block mb-2">{{ icon }}</span>
      <p class="font-orbitron font-black text-cyan-400 text-3xl neon-text">{{ number }}</p>
      <p class="text-gray-500 text-xs font-exo mt-2">{{ label }}</p>
    </div>
  `
})
</script>

<style scoped>
/* ── Two-column grid: image 5fr | text 7fr ── */
.about-container {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: 0;
  align-items: start; /* top-align so image starts from top, not stretched */
}

/* ── LEFT: portrait column ── */
.portrait-col {
  position: relative;
  /* Let the image dictate height naturally */
  line-height: 0;
}

.portrait-img {
  width: 100%;
  height: auto;             /* natural aspect ratio — NO fixed height, NO crop */
  display: block;
  object-fit: contain;
  object-position: top;    /* anchored to top so head is never cut */
  opacity: 0.85;
  filter: brightness(1.06) saturate(1.08);
  transition: opacity 0.4s ease;
  position: relative;
  z-index: 1;
}

.portrait-col:hover .portrait-img {
  opacity: 0.96;
}

/* Rightward fade — dissolves into dark bg where text begins */
.fade-right {
  position: absolute;
  top: 0; right: 0; bottom: 0;
  width: 65%;
  background: linear-gradient(to right, transparent 0%, #030712 85%);
  z-index: 2;
  pointer-events: none;
}

/* Subtle top fade */
.fade-top {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 8%;
  background: linear-gradient(to bottom, #030712 0%, transparent 100%);
  z-index: 2;
  pointer-events: none;
}

/* Bottom fade — hides the cropped edge cleanly */
.fade-bottom {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 15%;
  background: linear-gradient(to top, #030712 0%, transparent 100%);
  z-index: 2;
  pointer-events: none;
}

/* ── RIGHT: text column ── */
.content-col {
  margin-left: -60px;   /* overlap the rightward fade for seamless blend */
  padding: 2rem 0 2rem 0;
  position: relative;
  z-index: 10;
  /* Vertically center content relative to the full image height */
  align-self: center;
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .about-container {
    grid-template-columns: 1fr;
  }
  .portrait-col {
    max-height: 380px;
    overflow: hidden;
  }
  .portrait-img {
    width: 75%;
    margin: 0 auto;
  }
  .fade-right { display: none; }
  .fade-bottom {
    height: 30%;
    background: linear-gradient(to top, #030712 40%, transparent 100%);
  }
  .content-col {
    margin-left: 0;
    padding: 1.5rem 0.5rem;
  }
}
</style>