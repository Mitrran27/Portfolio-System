<template>
  <section id="home" class="min-h-screen flex items-center px-6 pt-20 pb-16 relative overflow-hidden">
    <!-- Vertical red accent line -->
    <div class="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-red-700/40 to-transparent hidden lg:block" />

    <div class="max-w-6xl mx-auto w-full">
      <div class="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        <!-- Left: Text -->
        <div class="space-y-8 text-center lg:text-left">

          <!-- Available badge -->
          <Transition name="fade-slide">
            <div v-if="info?.available_for_work"
              class="inline-flex items-center gap-2 px-4 py-1.5 border border-white/10 text-white/50 text-xs font-body tracking-widest uppercase rounded-sm">
              <span class="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              Available for work
            </div>
          </Transition>

          <!-- Name + title -->
          <div class="space-y-3">
            <p class="text-white/30 font-body text-xs tracking-[0.2em] uppercase">Hello, I'm</p>
            <h1 class="font-display leading-[1.05] text-white" style="font-size:clamp(2.4rem,6vw,5rem)">
              {{ info?.name || 'Your Name' }}
            </h1>
            <div class="flex items-center gap-3 justify-center lg:justify-start">
              <div class="w-6 h-px bg-red-600 flex-shrink-0" />
              <h2 class="font-body font-light text-white/60 min-h-[1.4em]" style="font-size:clamp(0.9rem,2vw,1.2rem)">
                {{ displayedTitle }}<span class="cursor-blink">|</span>
              </h2>
            </div>
          </div>

          <!-- Bio -->
          <p class="text-white/45 font-body leading-relaxed text-sm md:text-base mx-auto lg:mx-0 max-w-md">
            {{ info?.bio || 'Passionate developer crafting digital experiences.' }}
          </p>

          <!-- CTA buttons -->
          <div class="flex flex-wrap gap-3 justify-center lg:justify-start">
            <a href="#projects" class="btn-solid px-7 py-3 rounded text-sm tracking-wide">View Projects</a>
            <a href="#contact" class="btn-neon px-7 py-3 rounded text-sm tracking-wide">
              Contact Me
            </a>
            <a v-if="info?.resume_url" :href="info.resume_url" target="_blank"
              class="px-7 py-3 rounded text-sm font-body tracking-wide border border-white/10 text-white/40 hover:text-white hover:border-white/25 transition-all">
              Resume ↗
            </a>
          </div>

          <!-- Location -->
          <p v-if="info?.location" class="text-white/25 text-xs font-body flex items-center gap-2 justify-center lg:justify-start">
            <svg class="w-3.5 h-3.5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            {{ info.location }}
          </p>
        </div>

        <!-- Right: Avatar -->
        <div class="flex flex-col items-center gap-8">
          <div class="avatar-frame">
            <img v-if="info?.avatar_url" :src="info.avatar_url" alt="avatar" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center font-display text-white/20"
              style="font-size:clamp(3rem,8vw,5rem)">
              {{ info?.name?.[0] || '?' }}
            </div>
            <!-- Corner decorations -->
            <span class="corner-tl" />
            <span class="corner-br" />
          </div>

          <!-- Social icons -->
          <div class="flex justify-center flex-wrap gap-3">
            <a v-for="s in socials" :key="s.platform"
              :href="s.url" target="_blank" rel="noopener noreferrer" :title="s.platform"
              class="social-icon w-9 h-9 rounded border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 transition-all">
              <SocialIcon :platform="s.platform" />
            </a>
            <a v-if="info?.email" :href="`mailto:${info.email}`"
              class="social-icon w-9 h-9 rounded border border-white/10 flex items-center justify-center text-white/30 hover:text-red-500 hover:border-red-500/40 transition-all">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-white/20">
      <span class="text-[10px] font-body tracking-[0.25em] uppercase">Scroll</span>
      <div class="scroll-track"><div class="scroll-thumb" /></div>
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
    return () => h('svg', { class: 'w-3.5 h-3.5', fill: 'currentColor', viewBox: '0 0 24 24' },
      icons[p.platform] ? [h('path', { d: icons[p.platform] })] :
      [h('text', { x: '12', y: '16', 'text-anchor': 'middle', 'font-size': '11', fill: 'currentColor' }, p.platform[0])]
    )
  }
})
</script>

<style scoped>
/* Avatar frame — sharp rectangular with red corner brackets */
.avatar-frame {
  position: relative;
  width: clamp(200px, 38vw, 320px);
  height: clamp(200px, 38vw, 320px);
  overflow: hidden;
  background: var(--surface);
}
.avatar-frame img { width: 100%; height: 100%; object-fit: cover; }

/* Corner bracket decorations */
.corner-tl,
.corner-br {
  position: absolute;
  width: 24px; height: 24px;
  pointer-events: none;
}
.corner-tl {
  top: -1px; left: -1px;
  border-top: 2px solid var(--red);
  border-left: 2px solid var(--red);
}
.corner-br {
  bottom: -1px; right: -1px;
  border-bottom: 2px solid var(--red);
  border-right: 2px solid var(--red);
}

/* Scroll indicator */
.scroll-track {
  width: 1px; height: 40px;
  background: rgba(255,255,255,0.08);
  position: relative; overflow: hidden;
}
.scroll-thumb {
  position: absolute;
  width: 100%; height: 14px;
  background: var(--red);
  top: 0;
  animation: scroll-drop 1.8s ease-in-out infinite;
}
@keyframes scroll-drop {
  0%  { top: 0; opacity: 1; }
  80% { top: calc(100% - 14px); opacity: 0.6; }
  100%{ top: calc(100% - 14px); opacity: 0; }
}

.fade-slide-enter-active { transition: all 0.5s ease 0.3s; }
.fade-slide-enter-from { opacity: 0; transform: translateY(-6px); }

.social-icon { transition: all 0.2s ease; }
</style>