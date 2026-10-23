<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import AppIcon from './AppIcon.vue'
const props = defineProps({ title: String, subtitle: String, wide: Boolean, drawer: Boolean })
const emit = defineEmits(['close'])
const panel = ref(null)
let previousFocus
function handleKey(event) {
  if (event.key === 'Escape') emit('close')
  if (event.key === 'Tab') {
    const elements = [
      ...panel.value.querySelectorAll(
        'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea, a[href], [tabindex="0"]'
      ),
    ].filter((el) => el.offsetParent !== null)
    const first = elements[0],
      last = elements[elements.length - 1]
    if (!first) {
      event.preventDefault()
      panel.value.focus()
    } else if (
      event.shiftKey &&
      (document.activeElement === first || document.activeElement === panel.value)
    ) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
}
onMounted(async () => {
  previousFocus = document.activeElement
  document.body.style.overflow = 'hidden'
  document.addEventListener('keydown', handleKey)
  await nextTick()
  panel.value.focus()
})
onBeforeUnmount(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', handleKey)
  previousFocus?.focus?.()
})
</script>
<template>
  <Teleport to="body">
    <div class="modal-backdrop" @mousedown.self="$emit('close')">
      <section
        ref="panel"
        role="dialog"
        aria-modal="true"
        :aria-label="props.title"
        tabindex="-1"
        :class="['modal', { wide, drawer }]"
      >
        <header class="modal-header">
          <div>
            <h2>{{ title }}</h2>
            <p v-if="subtitle">{{ subtitle }}</p>
          </div>
          <button class="icon-btn" aria-label="Close dialog" @click="$emit('close')">
            <AppIcon name="close" />
          </button>
        </header>
        <div class="modal-body"><slot /></div>
        <footer v-if="$slots.footer" class="modal-footer"><slot name="footer" /></footer>
      </section>
    </div>
  </Teleport>
</template>
