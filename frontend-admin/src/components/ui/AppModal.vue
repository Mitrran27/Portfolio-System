<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-backdrop" @click.self="$emit('update:modelValue', false)">
        <div class="modal-box card-glass rounded-2xl" :style="{ maxWidth: width }">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6 pb-4 border-b border-cyan-400/20">
            <h3 class="text-lg font-bold text-cyan-400 font-orbitron">{{ title }}</h3>
            <button @click="$emit('update:modelValue', false)" class="text-gray-500 hover:text-white transition-colors p-1 rounded">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <!-- Slot -->
          <div class="modal-body">
            <slot />
          </div>
          <!-- Footer -->
          <div v-if="$slots.footer" class="mt-6 pt-4 border-t border-cyan-400/20 flex justify-end gap-3">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: { type: String, default: 'Modal' },
  width: { type: String, default: '560px' }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0; z-index: 9000;
  background: rgba(3, 7, 18, 0.85);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  padding: 24px;
}
.modal-box {
  width: 100%;
  padding: 28px;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95) translateY(10px); }
</style>
