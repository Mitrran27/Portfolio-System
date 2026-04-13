<template>
  <section id="home" class="min-h-screen flex items-center px-4 pt-20 pb-12 relative overflow-hidden">
    <div class="scan-line" />

    <div class="max-w-6xl mx-auto w-full">
      <div class="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

        <!-- Left: Text -->
        <div class="space-y-5 text-center lg:text-left">
          <Transition name="fade-slide">
            <div v-if="info?.available_for_work"
              class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/40 bg-green-900/20 text-green-400 text-xs font-exo">
              <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Available for work
            </div>
          </Transition>

          <div>
            <p class="text-gray-500 font-exo text-xs mb-2 tracking-widest uppercase">Hello, I'm</p>
            <h1 class="font-orbitron font-black leading-tight" style="font-size:clamp(1.9rem,5vw,3.8rem)">
              <span class="text-white">{{ info?.name || 'Your Name' }}</span>
            </h1>
            <h2 class="font-orbitron font-bold mt-2 min-h-[1.8em]" style="font-size:clamp(0.9rem,2.5vw,1.6rem)">
              <span class="text-cyan-400 neon-text">{{ displayedTitle }}</span>
              <span class="cursor-blink text-cyan-400">|</span>
            </h2>
          </div>

          <p class="text-gray-400 font-exo leading-relaxed text-sm md:text-base mx-auto lg:mx-0 max-w-md">
            {{ info?.bio || 'Passionate developer crafting digital experiences.' }}
          </p>

          <div class="flex flex-wrap gap-3 pt-1 justify-center lg:justify-start">
            <a href="#projects" class="btn-neon px-6 py-3 rounded-xl text-sm">View Projects</a>
            <a href="#contact" class="px-6 py-3 rounded-xl text-sm font-orbitron border border-fuchsia-400/50 text-fuchsia-400 hover:bg-fuchsia-400/10 transition-all">
              Contact Me
            </a>
            <a v-if="info?.resume_url" :href="info.resume_url" target="_blank"
              class="px-6 py-3 rounded-xl text-sm font-orbitron border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-all">
              Resume ↗
            </a>
          </div>

          <p v-if="info?.location" class="text-gray-600 text-xs font-exo flex items-center gap-1.5 justify-center lg:justify-start">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            {{ info.location }}
          </p>
        </div>

        <!-- Right: Avatar -->
        <div class="flex flex-col items-center gap-6">
          <div class="avatar-ring">
            <div class="avatar-inner">
              <img v-if="info?.avatar_url" :src="info.avatar_url" alt="avatar" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-cyan-400 font-orbitron font-black"
                style="font-size:clamp(2rem,6vw,4rem)">
                {{ info?.name?.[0] || '?' }}
              </div>
            </div>
          </div>

          <!-- Social icons -->
          <div class="flex justify-center flex-wrap gap-3">
            <a v-for="s in socials" :key="s.platform"
              :href="s.url" target="_blank" rel="noopener noreferrer" :title="s.platform"
              :class="['social-icon w-10 h-10 rounded-full card-glass flex items-center justify-center text-gray-400 transition-colors',
                ['Twitter','X'].includes(s.platform) ? 'hover:text-fuchsia-400' : 'hover:text-cyan-400']">
              <SocialIcon :platform="s.platform" />
            </a>
            <a v-if="info?.email" :href="`mailto:${info.email}`"
              class="social-icon w-10 h-10 rounded-full card-glass flex items-center justify-center text-gray-400 hover:text-fuchsia-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator — hidden on mobile -->
    <div class="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-gray-600">
      <span class="text-xs font-exo tracking-widest uppercase">Scroll</span>
      <div class="scroll-dot" />
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onUnmounted, defineComponent, h } from 'vue'

const props = defineProps({ info: Object, socials: Array, loading: Boolean })

const displayedTitle = ref('')
let typeInterval = null

const startTypewriter = (text) => {
  if (!text) return
  displayedTitle.value = ''
  let i = 0
  clearInterval(typeInterval)
  typeInterval = setInterval(() => {
    displayedTitle.value += text[i]
    i++
    if (i >= text.length) clearInterval(typeInterval)
  }, 60)
}

watch(() => props.info?.title, (t) => { if (t) startTypewriter(t) }, { immediate: true })
onUnmounted(() => clearInterval(typeInterval))

const SocialIcon = defineComponent({
  props: ['platform'],
  setup(p) {
    const icons = {
      GitHub: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
      LinkedIn: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
      Twitter: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    }
    return () => h('svg', { class: 'w-4 h-4', fill: 'currentColor', viewBox: '0 0 24 24' },
      icons[p.platform] ? [h('path', { d: icons[p.platform] })] :
      [h('text', { x: '12', y: '16', 'text-anchor': 'middle', 'font-size': '11', fill: 'currentColor' }, p.platform[0])]
    )
  }
})
</script>

<style scoped>
.scan-line {
  position: absolute; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(34,211,238,0.3), transparent);
  animation: scan 6s linear infinite;
  pointer-events: none;
}
.avatar-ring {
  width: clamp(180px, 40vw, 240px);
  height: clamp(180px, 40vw, 240px);
  border-radius: 50%;
  padding: 3px;
  background: conic-gradient(var(--cyan), var(--fuchsia), var(--cyan));
  animation: spin-slow 8s linear infinite;
}
@keyframes spin-slow { to { transform: rotate(360deg); } }
.avatar-inner {
  width: 100%; height: 100%;
  border-radius: 50%;
  background: var(--bg);
  overflow: hidden;
  animation: spin-slow 8s linear infinite reverse;
}
.scroll-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--cyan);
  animation: bounce-dot 1.5s ease-in-out infinite;
}
@keyframes bounce-dot { 0%,100%{transform:translateY(0);opacity:1} 50%{transform:translateY(8px);opacity:0.4} }
.fade-slide-enter-active { transition: all 0.5s ease 0.3s; }
.fade-slide-enter-from { opacity:0; transform:translateY(-8px); }
</style>
