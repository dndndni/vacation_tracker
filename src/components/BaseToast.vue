<script setup>
import { store } from '../utils/store'
import AppIcon from './AppIcon.vue'
</script>
<template>
  <Teleport to="body">
    <div class="toast-stack" aria-live="polite" aria-atomic="false">
      <div v-for="item in store.toasts" :key="item.id" :class="['toast', item.type]" role="status">
        <AppIcon :name="item.type === 'error' ? 'alert' : 'check'" />
        <span>{{ item.message }}</span>
        <button
          class="icon-btn"
          aria-label="Dismiss notification"
          @click="store.toasts = store.toasts.filter((t) => t.id !== item.id)"
        >
          <AppIcon name="close" />
        </button>
      </div>
    </div>
  </Teleport>
</template>
