<template>
  <section id="contact" class="py-20 px-4 pb-32" ref="sectionRef">
    <div class="max-w-6xl mx-auto">
      
      <div class="text-center mb-12">
        <h2 class="font-orbitron font-bold text-white" style="font-size:clamp(1.6rem,4vw,2.8rem)">
          <span class="text-cyan-400 neon-text">Contact</span>
          <span class="text-white"> Me</span>
        </h2>
        <div class="flex items-center justify-center gap-3 mt-4">
          <div class="h-px w-16 bg-gradient-to-r from-transparent to-cyan-400" />
          <div class="w-2 h-2 rounded-full bg-cyan-400" />
          <div class="h-px w-16 bg-gradient-to-l from-transparent to-cyan-400" />
        </div>
      </div>

      <!-- Social icons -->
      <div class="flex justify-center flex-wrap gap-4 mb-10">
        <a v-for="s in socials" :key="s.platform" :href="s.url" target="_blank" rel="noopener noreferrer" :title="s.platform"
          :class="['social-icon w-14 h-14 rounded-full card-glass flex items-center justify-center text-gray-400 gradient-border transition-all',
            ['Twitter','X'].includes(s.platform) ? 'hover:text-fuchsia-400' : 'hover:text-cyan-400']">
          <SocialIcon :platform="s.platform" class="w-7 h-7" />
        </a>
        <a v-if="info?.email" :href="`mailto:${info.email}`"
          class="social-icon w-14 h-14 rounded-full card-glass flex items-center justify-center text-gray-400 hover:text-fuchsia-400 gradient-border">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </a>
      </div>

      <!-- Main contact grid: Quick Chat (2/3) + Get in Touch (1/3) -->
      <div :class="['grid grid-cols-1 md:grid-cols-3 gap-6 section-fade', visible ? 'visible' : '']">

        <!-- Quick Chat -->
        <div class="md:col-span-2 card-glass rounded-2xl p-6 gradient-border flex flex-col" style="min-height:340px">
          <h3 class="text-cyan-400 font-orbitron font-bold text-lg mb-1">Quick Chat</h3>
          <p class="text-gray-400 text-sm font-exo mb-4">Ask me anything about my work, skills, or services.</p>

          <!-- Chat messages -->
          <div ref="chatBox" class="flex-1 overflow-y-auto mb-4 space-y-3 pr-1" style="max-height:200px">
            <div v-for="(msg, i) in chatMessages" :key="i"
              :class="['flex', msg.from === 'user' ? 'justify-end' : 'justify-start']">
              <div :class="['rounded-xl px-4 py-2 max-w-xs text-sm font-exo',
                msg.from === 'user'
                  ? 'bg-cyan-900/60 text-cyan-300 border border-cyan-700/50'
                  : 'bg-gray-800/80 text-gray-300 border border-gray-700/50']">
                {{ msg.text }}
              </div>
            </div>
            <div v-if="chatLoading" class="flex justify-start">
              <div class="bg-gray-800/80 border border-gray-700/50 rounded-xl px-4 py-2 text-gray-500 text-sm font-exo">
                <span class="inline-flex gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style="animation-delay:0s"/>
                  <span class="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style="animation-delay:0.15s"/>
                  <span class="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style="animation-delay:0.3s"/>
                </span>
              </div>
            </div>
          </div>

          <!-- Chat input -->
          <div class="flex gap-2">
            <input v-model="chatInput" @keyup.enter="sendChat"
              class="input-neon flex-1 px-4 py-2.5 rounded-lg text-sm font-exo"
              placeholder="Type your question..." />
            <button @click="sendChat" :disabled="chatLoading || !chatInput.trim()"
              class="btn-neon px-4 py-2.5 rounded-lg disabled:opacity-50">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Get in Touch -->
        <div class="card-glass rounded-2xl p-6 gradient-border flex flex-col" style="border-color: rgba(217,70,239,0.3)">
          <h3 class="text-fuchsia-400 font-orbitron font-bold text-lg mb-5">Get in Touch</h3>

          <div class="space-y-4 flex-1">
            <div>
              <p class="text-cyan-400 text-sm font-exo font-medium mb-1">Email</p>
              <a :href="`mailto:${info?.email}`" class="text-gray-400 hover:text-cyan-400 text-sm font-exo transition-colors">
                {{ info?.email || 'hello@example.com' }}
              </a>
            </div>
            <div>
              <p class="text-cyan-400 text-sm font-exo font-medium mb-1">Response Time</p>
              <p class="text-gray-400 text-sm font-exo">{{ info?.response_time || 'Within 24 hours' }}</p>
            </div>
            <div>
              <p class="text-cyan-400 text-sm font-exo font-medium mb-1">Available For</p>
              <p class="text-gray-400 text-sm font-exo">{{ info?.available_for || 'Freelance, Full-time, Consulting' }}</p>
            </div>
            <div v-if="info?.location">
              <p class="text-cyan-400 text-sm font-exo font-medium mb-1">Based in</p>
              <p class="text-gray-400 text-sm font-exo">{{ info.location }}</p>
              <span v-if="info?.available_for_work"
                class="inline-block mt-1 text-xs bg-green-900/40 border border-green-500/40 text-green-400 px-2 py-0.5 rounded-full font-exo">
                ● Open to work
              </span>
            </div>
          </div>

          <hr class="border-gray-700/50 my-4" />
          <button @click="showForm = !showForm"
            class="w-full py-2.5 rounded-xl text-sm font-orbitron border border-fuchsia-400/50 text-fuchsia-400 hover:bg-fuchsia-400/10 transition-all">
            Detailed Message
          </button>
        </div>
      </div>

      <!-- Expandable detailed form -->
      <Transition name="expand">
        <div v-if="showForm" class="card-glass rounded-2xl p-6 md:p-8 gradient-border mt-6 section-fade visible">
          <h3 class="text-white font-orbitron text-sm mb-5">SEND A MESSAGE</h3>
          <form v-if="!submitted" @submit.prevent="sendMessage" class="space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Your Name</label>
                <input type="text" v-model="form.sender_name" required class="input-neon w-full px-4 py-3 rounded-lg text-sm" placeholder="John Doe" />
              </div>
              <div>
                <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Your Email</label>
                <input type="email" v-model="form.sender_email" required class="input-neon w-full px-4 py-3 rounded-lg text-sm" placeholder="john@example.com" />
              </div>
            </div>
            <div>
              <label class="block text-cyan-400 text-sm font-medium mb-2 font-exo">Message</label>
              <textarea v-model="form.message" rows="5" required class="input-neon w-full px-4 py-3 rounded-lg resize-none text-sm" placeholder="Tell me about your project..." />
            </div>
            <div v-if="errorMsg" class="p-3 rounded-lg bg-red-900/50 border border-red-500/50 text-red-400 text-sm font-exo">{{ errorMsg }}</div>
            <button type="submit" :disabled="sending" class="btn-neon w-full py-4 rounded-xl text-sm font-orbitron tracking-wider disabled:opacity-50">
              <span v-if="!sending">Send Message ↗</span>
              <span v-else class="flex items-center justify-center gap-2">
                <span class="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin inline-block" />
                Sending...
              </span>
            </button>
          </form>
          <div v-else class="py-8 text-center space-y-3">
            <div class="w-14 h-14 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center mx-auto text-2xl">✨</div>
            <h3 class="text-white font-orbitron">Message Sent!</h3>
            <p class="text-gray-400 font-exo text-sm">I'll get back to you soon.</p>
            <button @click="submitted = false; form = { sender_name:'', sender_email:'', message:'' }"
              class="btn-neon px-6 py-2 rounded-xl text-sm">Send Another</button>
          </div>
        </div>
      </Transition>
    </div>
  </section>
</template>

<script setup>
import { ref, nextTick, defineComponent, h } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import axios from 'axios'

const props = defineProps({ info: Object, socials: Array })

const sectionRef = ref(null)
const visible = ref(false)
useIntersectionObserver(sectionRef, ([{ isIntersecting }]) => {
  if (isIntersecting) visible.value = true
}, { threshold: 0.05 })

// Chat
const chatMessages = ref([
  { from: 'bot', text: "Hi! How can I help you today? Ask me about skills, projects, or availability!" }
])
const chatInput = ref('')
const chatLoading = ref(false)
const chatBox = ref(null)

const scrollChat = () => nextTick(() => {
  if (chatBox.value) chatBox.value.scrollTop = chatBox.value.scrollHeight
})

const quickResponses = {
  skill: "I work with Vue.js, React, Node.js, TypeScript, PostgreSQL, and more. Check the Skills section for the full list!",
  project: "I've built various projects including web apps, APIs, and dashboards. Click any project card to see the full details!",
  available: props.info?.available_for_work
    ? `Yes! I'm currently available for ${props.info?.available_for || 'freelance and full-time opportunities'}.`
    : "I'm not currently available for new projects, but feel free to reach out for future opportunities!",
  hire: "I'd love to work with you! Use the 'Detailed Message' button to send me the details of your project.",
  contact: `You can email me at ${props.info?.email || 'hello@example.com'}. My response time is ${props.info?.response_time || 'within 24 hours'}.`,
  experience: "I have experience as a Full Stack Developer. Check the Experience section on this page for details!",
  default: "Thanks for your message! For detailed inquiries, please use the 'Detailed Message' form below. I typically respond within 24 hours."
}

const sendChat = async () => {
  const text = chatInput.value.trim()
  if (!text || chatLoading.value) return
  chatMessages.value.push({ from: 'user', text })
  chatInput.value = ''
  chatLoading.value = true
  scrollChat()
  await new Promise(r => setTimeout(r, 800))
  const lower = text.toLowerCase()
  let reply = quickResponses.default
  if (lower.includes('skill') || lower.includes('tech') || lower.includes('stack')) reply = quickResponses.skill
  else if (lower.includes('project') || lower.includes('work') || lower.includes('portfolio')) reply = quickResponses.project
  else if (lower.includes('available') || lower.includes('hire') || lower.includes('job') || lower.includes('opportunit')) reply = quickResponses.available
  else if (lower.includes('contact') || lower.includes('email') || lower.includes('reach')) reply = quickResponses.contact
  else if (lower.includes('experience') || lower.includes('background')) reply = quickResponses.experience
  chatMessages.value.push({ from: 'bot', text: reply })
  chatLoading.value = false
  scrollChat()
}

// Detailed form
const showForm = ref(false)
const form = ref({ sender_name: '', sender_email: '', message: '' })
const sending = ref(false)
const submitted = ref(false)
const errorMsg = ref('')

const sendMessage = async () => {
  sending.value = true; errorMsg.value = ''
  try {
    await axios.post('/api/messages', form.value)
    submitted.value = true
  } catch (err) {
    errorMsg.value = err.response?.data?.error || 'Something went wrong. Please try again.'
  } finally { sending.value = false }
}

const SocialIcon = defineComponent({
  props: ['platform'],
  setup(p) {
    const icons = {
      GitHub: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
      LinkedIn: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
      Twitter: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    }
    return () => h('svg', { class: 'w-7 h-7', fill: 'currentColor', viewBox: '0 0 24 24' },
      icons[p.platform] ? [h('path', { d: icons[p.platform] })] :
      [h('text', { x: '12', y: '17', 'text-anchor': 'middle', 'font-size': '11', fill: 'currentColor' }, p.platform[0])]
    )
  }
})
</script>

<style scoped>
.expand-enter-active, .expand-leave-active { transition: all 0.3s ease; }
.expand-enter-from, .expand-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
