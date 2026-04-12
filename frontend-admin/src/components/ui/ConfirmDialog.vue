<template>
  <AppModal v-model="show" title="Confirm Action" width="400px">
    <p class="text-gray-300 font-exo">{{ message }}</p>
    <template #footer>
      <button class="btn-neon px-5 py-2 rounded-lg text-sm font-exo" @click="cancel">Cancel</button>
      <button class="btn-fuchsia px-5 py-2 rounded-lg text-sm font-exo" @click="confirm">{{ confirmLabel }}</button>
    </template>
  </AppModal>
</template>

<script setup>
import { ref } from 'vue'
import AppModal from './AppModal.vue'

const show = ref(false)
const message = ref('')
const confirmLabel = ref('Confirm')
let resolveFn = null

const open = (msg, label = 'Delete') => {
  message.value = msg
  confirmLabel.value = label
  show.value = true
  return new Promise(r => { resolveFn = r })
}
const confirm = () => { show.value = false; resolveFn?.(true) }
const cancel = () => { show.value = false; resolveFn?.(false) }

defineExpose({ open })
</script>
