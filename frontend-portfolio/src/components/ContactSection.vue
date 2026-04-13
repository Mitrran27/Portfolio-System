<template>
  <section id="contact" class="py-20 px-4 pb-32" ref="sectionRef">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="font-orbitron font-bold text-white" style="font-size:clamp(1.6rem,4vw,2.8rem)">
          <span class="text-cyan-400 neon-text">Get in</span>
          <span class="text-white"> Touch</span>
        </h2>
        <div class="flex items-center justify-center gap-3 mt-4">
          <div class="h-px w-16 bg-gradient-to-r from-transparent to-cyan-400" />
          <div class="w-2 h-2 rounded-full bg-cyan-400" />
          <div class="h-px w-16 bg-gradient-to-l from-transparent to-cyan-400" />
        </div>
        <p class="text-gray-400 font-exo mt-4 text-sm max-w-md mx-auto">
          Have a project in mind or just want to say hi? I'd love to hear from you.
        </p>
      </div>

      <!-- Quick contact cards -->
      <div :class="['grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 section-fade', visible ? 'visible' : '']">
        <!-- Email card -->
        <a v-if="info?.email" :href="`mailto:${info.email}`"
          class="quick-card card-glass rounded-2xl p-5 text-center hover:border-cyan-400/50 transition-all group">
          <div class="w-12 h-12 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center mx-auto mb-3 group-hover:bg-cyan-400/20 transition-colors">
            <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <p class="text-white font-exo text-sm font-medium mb-1">Email Me</p>
          <p class="text-cyan-400 text-xs font-exo truncate">{{ info.email }}</p>
        </a>

        <!-- Quick Chat card -->
        <div class="quick-card card-glass rounded-2xl p-5 text-center hover:border-fuchsia-400/50 transition-all group cursor-pointer"
          @click="scrollToForm">
          <div class="w-12 h-12 rounded-full bg-fuchsia-400/10 border border-fuchsia-400/30 flex items-center justify-center mx-auto mb-3 group-hover:bg-fuchsia-400/20 transition-colors">
            <svg class="w-5 h-5 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </div>
          <p class="text-white font-exo text-sm font-medium mb-1">Quick Chat</p>
          <p class="text-fuchsia-400 text-xs font-exo">Send a message below</p>
        </div>

        <!-- Location / availability card -->
        <div class="quick-card card-glass rounded-2xl p-5 text-center">
          <div class="w-12 h-12 rounded-full bg-green-400/10 border border-green-400/30 flex items-center justify-center mx-auto mb-3">
            <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <p class="text-white font-exo text-sm font-medium mb-1">Based in</p>
          <p class="text-green-400 text-xs font-exo">{{ info?.location || 'Malaysia' }}</p>
          <span v-if="info?.available_for_work" class="inline-block mt-2 text-xs bg-green-900/40 border border-green-500/40 text-green-400 px-2 py-0.5 rounded-full font-exo">
            ● Open to work
          </span>
        </div>
      </div>

      <!-- Social Icons -->
      <div class="flex justify-center flex-wrap gap-4 mb-10">
        <a v-for="s in socials" :key="s.platform"
          :href="s.url" target="_blank" rel="noopener noreferrer"
          :class="['social-icon w-12 h-12 rounded-full card-glass flex items-center justify-center text-gray-400 gradient-border transition-all',
            ['Twitter','X'].includes(s.platform) ? 'hover:text-fuchsia-400' : 'hover:text-cyan-400']"
          :title="s.platform">
          <SocialIcon :platform="s.platform" class="w-5 h-5" />
        </a>
        <a v-if="info?.email" :href="`mailto:${info.email}`"
          class="social-icon w-12 h-12 rounded-full card-glass flex items-center justify-center text-gray-400 hover:text-fuchsia-400 gradient-border">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </a>
      </div>

      <!-- Contact Form -->
      <div id="contact-form-wrapper" :class="['card-glass rounded-2xl p-6 md:p-8 gradient-border section-fade', visible ? 'visible' : '']"
        style="transition-delay: 0.15s">
        <h3 class="text-white font-orbitron text-sm mb-6">SEND A MESSAGE</h3>
        <form v-if="!submitted" @submit.prevent="sendMessage" class="space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Your Name</label>
              <input type="text" v-model="form.sender_name" required
                class="input-neon w-full px-4 py-3 rounded-lg text-sm" placeholder="John Doe" />
            </div>
            <div>
              <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Your Email</label>
              <input type="email" v-model="form.sender_email" required
                class="input-neon w-full px-4 py-3 rounded-lg text-sm" placeholder="john@example.com" />
            </div>
          </div>
          <div>
            <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Message</label>
            <textarea v-model="form.message" rows="5" required
              class="input-neon w-full px-4 py-3 rounded-lg resize-none text-sm"
              placeholder="Tell me about your project or just say hi..." />
          </div>

          <div v-if="errorMsg" class="p-3 rounded-lg bg-red-900/50 border border-red-500/50 text-red-400 text-sm font-exo">
            {{ errorMsg }}
          </div>

          <button type="submit" :disabled="sending"
            class="btn-neon w-full py-4 rounded-xl text-sm font-orbitron tracking-wider disabled:opacity-50">
            <span v-if="!sending">Send Message ↗</span>
            <span v-else class="flex items-center justify-center gap-2">
              <span class="inline-block w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
              Sending...
            </span>
          </button>
        </form>

        <!-- Success -->
        <div v-else class="py-10 text-center space-y-4">
          <div class="w-16 h-16 rounded-full bg-cyan-400/10 border border-cyan-400/40 flex items-center justify-center mx-auto text-2xl">✨</div>
          <h3 class="text-white font-orbitron">Message Sent!</h3>
          <p class="text-gray-400 font-exo text-sm">I'll get back to you as soon as possible.</p>
          <button @click="submitted = false; form = { sender_name:'', sender_email:'', message:'' }"
            class="btn-neon px-8 py-2.5 rounded-xl text-sm">Send Another</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, defineComponent, h } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import axios from 'axios'

defineProps({ info: Object, socials: Array })

const sectionRef = ref(null)
const visible = ref(false)
useIntersectionObserver(sectionRef, ([{ isIntersecting }]) => { if (isIntersecting) visible.value = true }, { threshold: 0.05 })

const form = ref({ sender_name: '', sender_email: '', message: '' })
const sending = ref(false)
const submitted = ref(false)
const errorMsg = ref('')

const scrollToForm = () => {
  document.getElementById('contact-form-wrapper')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

const sendMessage = async () => {
  sending.value = true
  errorMsg.value = ''
  try {
    await axios.post('/api/messages', form.value)
    submitted.value = true
  } catch (err) {
    errorMsg.value = err.response?.data?.error || 'Something went wrong. Please try again.'
  } finally {
    sending.value = false
  }
}

const SocialIcon = defineComponent({
  props: ['platform'],
  setup(p) {
    const icons = {
      GitHub: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
      LinkedIn: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
      Twitter: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    }
    return () => h('svg', { class: 'w-6 h-6', fill: 'currentColor', viewBox: '0 0 24 24' },
      icons[p.platform] ? [h('path', { d: icons[p.platform] })] :
      [h('text', { x: '12', y: '17', 'text-anchor': 'middle', 'font-size': '11', fill: 'currentColor' }, p.platform[0])]
    )
  }
})
</script>

<style scoped>
.quick-card { transition: all 0.3s ease; }
.quick-card:hover { transform: translateY(-3px); }
</style>
