<template>
  <section id="contact" class="py-24 px-6 border-t border-white/[0.05] pb-32" ref="sectionRef">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-16">
        <p class="accent-line text-white/30 text-xs font-body tracking-[0.2em] uppercase mb-4">Contact</p>
        <h2 class="font-display text-white" style="font-size:clamp(2rem,4.5vw,3.5rem)">
          Get in <em>Touch</em>
        </h2>
        <p class="text-white/35 font-body mt-4 text-sm max-w-sm">
          Have a project in mind or just want to say hi? I'd love to hear from you.
        </p>
      </div>

      <div class="grid lg:grid-cols-5 gap-12">

        <!-- Left: info cards -->
        <div :class="['lg:col-span-2 space-y-4 section-fade', visible ? 'visible' : '']" style="transition-delay:0.05s">

          <a v-if="info?.email" :href="`mailto:${info.email}`" class="contact-card group block p-5 border border-white/[0.07] hover:border-white/15 transition-all">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-8 h-8 border border-red-700/40 flex items-center justify-center text-red-600">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <p class="text-white/25 text-[10px] font-body tracking-[0.15em] uppercase">Email</p>
            </div>
            <p class="text-white/60 text-sm font-body group-hover:text-white transition-colors truncate">{{ info.email }}</p>
          </a>

          <div class="contact-card p-5 border border-white/[0.07]">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-8 h-8 border border-white/10 flex items-center justify-center text-white/30">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <p class="text-white/25 text-[10px] font-body tracking-[0.15em] uppercase">Location</p>
            </div>
            <p class="text-white/55 text-sm font-body">{{ info?.location || 'Malaysia' }}</p>
            <span v-if="info?.available_for_work"
              class="inline-block mt-2 text-[10px] border border-red-700/40 text-red-600 px-2.5 py-0.5 font-body tracking-widest uppercase">
              Open to work
            </span>
          </div>

          <div class="contact-card p-5 border border-white/[0.07]" @click="scrollToForm">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-8 h-8 border border-white/10 flex items-center justify-center text-white/30">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <p class="text-white/25 text-[10px] font-body tracking-[0.15em] uppercase">Quick Chat</p>
            </div>
            <p class="text-white/55 text-sm font-body">Send a message below</p>

          </div>

          <!-- Socials -->
          <div v-if="socials?.length" class="pt-2">
            <p class="text-white/20 text-[10px] font-body tracking-[0.2em] uppercase mb-3">Socials</p>
            <div class="flex flex-wrap gap-2">
              <a v-for="s in socials" :key="s.platform" :href="s.url" target="_blank"
                class="w-9 h-9 border border-white/[0.08] flex items-center justify-center text-white/25 hover:text-white hover:border-white/25 transition-all">
                <SocialIcon :platform="s.platform" />
              </a>
            </div>
          </div>
        </div>

        <!-- Right: form -->
        <div :class="['lg:col-span-3 section-fade', visible ? 'visible' : '']" style="transition-delay:0.15s" id="contact-form-wrapper">

          <form v-if="!submitted" @submit.prevent="sendMessage" class="space-y-5">
            <div class="grid sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-white/30 text-[10px] font-body tracking-[0.15em] uppercase mb-2">Name</label>
                <input type="text" v-model="form.sender_name" required
                  class="input-neon w-full px-4 py-3 text-sm" placeholder="John Doe" />
              </div>
              <div>
                <label class="block text-white/30 text-[10px] font-body tracking-[0.15em] uppercase mb-2">Email</label>
                <input type="email" v-model="form.sender_email" required
                  class="input-neon w-full px-4 py-3 text-sm" placeholder="john@example.com" />
              </div>
            </div>
            <div>
              <label class="block text-white/30 text-[10px] font-body tracking-[0.15em] uppercase mb-2">Message</label>
              <textarea v-model="form.message" rows="6" required
                class="input-neon w-full px-4 py-3 resize-none text-sm"
                placeholder="Tell me about your project or just say hi..." />
            </div>

            <div v-if="errorMsg" class="p-3 border border-red-700/40 text-red-500 text-sm font-body">
              {{ errorMsg }}
            </div>

            <button type="submit" :disabled="sending" class="btn-solid w-full py-4 text-sm tracking-widest uppercase disabled:opacity-40">
              <span v-if="!sending">Send Message ↗</span>
              <span v-else class="flex items-center justify-center gap-2">
                <span class="inline-block w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </span>
            </button>
          </form>

          <!-- Success state -->
          <div v-else class="py-16 text-center space-y-5 border border-white/[0.07]">
            <div class="w-12 h-12 border border-red-700/40 flex items-center justify-center mx-auto text-red-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 class="text-white font-display text-xl">Message Sent</h3>
            <p class="text-white/35 font-body text-sm">I'll get back to you as soon as possible.</p>
            <button @click="submitted = false; form = { sender_name:'', sender_email:'', message:'' }"
              class="btn-neon px-8 py-2.5 text-sm tracking-wide">
              Send Another
            </button>
          </div>
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
    return () => h('svg', { class: 'w-3.5 h-3.5', fill: 'currentColor', viewBox: '0 0 24 24' },
      icons[p.platform] ? [h('path', { d: icons[p.platform] })] :
      [h('text', { x: '12', y: '17', 'text-anchor': 'middle', 'font-size': '11', fill: 'currentColor' }, p.platform[0])]
    )
  }
})
</script>