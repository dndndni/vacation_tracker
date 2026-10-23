<script setup>
import AppIcon from './AppIcon.vue'
defineProps({
  modelValue: String,
  placeholder: { type: String, default: 'Search by name or employee ID…' },
  count: Number,
})
defineEmits(['update:modelValue'])
</script>
<template>
  <div class="filter-bar">
    <label class="search-input">
      <span class="sr-only">{{ placeholder }}</span>
      <AppIcon name="search" />
      <input
        class="input"
        type="search"
        :value="modelValue"
        :placeholder="placeholder"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </label>
    <slot />
    <span v-if="count !== undefined" class="filter-count">{{ count }} records</span>
  </div>
</template>
