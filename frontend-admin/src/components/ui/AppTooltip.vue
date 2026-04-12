<template>
  <div class="tooltip-wrap">
    <slot />
    <span class="tooltip-content">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({ text: { type: String, required: true } })
</script>
