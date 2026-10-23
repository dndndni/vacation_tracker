<script setup>
import AppIcon from './AppIcon.vue'
defineProps({
  variant: { type: String, default: 'primary' },
  icon: String,
  small: Boolean,
  type: { type: String, default: 'button' },
})
</script>
<template>
  <button :type="type" :class="['btn', 'btn-' + variant, { 'btn-small': small }]">
    <AppIcon v-if="icon" :name="icon" />
    <slot />
  </button>
</template>
