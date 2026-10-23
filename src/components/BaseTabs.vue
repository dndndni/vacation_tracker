<script setup>
defineProps({ modelValue: String, tabs: Array })
defineEmits(['update:modelValue'])
function move(event) {
  const buttons = [...event.currentTarget.parentElement.querySelectorAll('[role=tab]')]
  const index = buttons.indexOf(event.currentTarget)
  buttons[(index + (event.key === 'ArrowLeft' ? -1 : 1) + buttons.length) % buttons.length]?.click()
  buttons[(index + (event.key === 'ArrowLeft' ? -1 : 1) + buttons.length) % buttons.length]?.focus()
}
</script>
<template>
  <div class="tabs" role="tablist" aria-label="View filters">
    <button
      v-for="tab in tabs"
      :key="tab.label || tab"
      role="tab"
      :aria-selected="modelValue === (tab.label || tab)"
      :class="['tab', { active: modelValue === (tab.label || tab) }]"
      @keydown.right.prevent="move"
      @keydown.left.prevent="move"
      @click="$emit('update:modelValue', tab.label || tab)"
    >
      {{ tab.label || tab }}
      <span v-if="tab.count !== undefined" class="badge-count">{{ tab.count }}</span>
    </button>
  </div>
</template>
