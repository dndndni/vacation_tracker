<script setup>
import AppIcon from './AppIcon.vue'
defineProps({
  title: String,
  value: [String, Number],
  caption: String,
  icon: { type: String, default: 'users' },
  tone: String,
})
</script>
<template>
  <div :class="['stat-card', tone]">
    <div class="stat-top">
      <span class="stat-title">{{ title }}</span>
      <span class="stat-icon"><AppIcon :name="icon" /></span>
    </div>
    <div class="stat-value">{{ value }}</div>
    <div class="stat-caption">{{ caption }}</div>
  </div>
</template>
