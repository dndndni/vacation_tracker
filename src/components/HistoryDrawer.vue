<script setup>
import { computed } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import AppIcon from './AppIcon.vue'
import { store, closeModal, employeeFor } from '../utils/store'
import { formatTime } from '../utils/dateUtils'
const props = defineProps({ leave: Object, employee: Object })
const person = computed(() => props.employee || employeeFor(props.leave?.employeeId))
const entries = computed(() =>
  store.history
    .filter((h) =>
      props.leave ? h.leaveId === props.leave.id : h.employeeId === props.employee?.id
    )
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
)
</script>
<template>
  <BaseModal
    title="Record history"
    :subtitle="`${person?.name || ''} · An automatic audit trail`"
    drawer
    @close="closeModal"
  >
    <div v-if="!entries.length" class="empty-state">
      <AppIcon name="history" />
      <p>No changes have been recorded yet.</p>
    </div>
    <article v-for="entry in entries" :key="entry.id" class="history-entry">
      <h4>{{ entry.action }}</h4>
      <p>{{ entry.actor }}</p>
      <p>{{ formatTime(entry.timestamp) }}</p>
      <span v-if="entry.recordedLate" class="recorded-late">Recorded late</span>
      <div v-if="entry.oldValues || entry.newValues" class="history-values">
        <div v-if="entry.oldValues">
          <span class="muted">Before</span>
          <code>{{ JSON.stringify(entry.oldValues, null, 1) }}</code>
        </div>
        <div v-if="entry.newValues">
          <span class="muted">After</span>
          <code>{{ JSON.stringify(entry.newValues, null, 1) }}</code>
        </div>
      </div>
    </article>
    <template #footer>
      <BaseButton variant="secondary" @click="closeModal">Close history</BaseButton>
    </template>
  </BaseModal>
</template>
