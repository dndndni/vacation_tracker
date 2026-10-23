<script setup>
import { STATUSES } from '../utils/constants'
defineProps({ status: String })
</script>
<template>
  <span :class="['status-badge', 'status-' + (STATUSES[status] || 'pending')]">
    <span class="status-dot" />
    {{ status }}
  </span>
</template>
