<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast-list">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', `toast-${toast.type}`]"
        >
          <span class="toast-icon">
            {{ toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ' }}
          </span>
          {{ toast.message }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '@/composables/useToast'
const { toasts } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed; bottom: 24px; right: 24px; z-index: 9999;
  display: flex; flex-direction: column; gap: 10px;
  pointer-events: none;
}
.toast { pointer-events: all; }
.toast-icon {
  width: 20px; height: 20px;
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 50%;
  font-size: 0.75rem; font-weight: bold; flex-shrink: 0;
}
.toast-list-enter-active, .toast-list-leave-active { transition: all 0.3s ease; }
.toast-list-enter-from { opacity: 0; transform: translateX(40px); }
.toast-list-leave-to { opacity: 0; transform: translateX(40px); }
</style>
