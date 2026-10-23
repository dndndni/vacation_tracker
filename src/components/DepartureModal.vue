<script setup>
import { ref, computed } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import AppIcon from './AppIcon.vue'
import { closeModal, employeeFor, recordDeparture } from '../utils/store'
import { localDateTime, today, formatDate } from '../utils/dateUtils'
const props = defineProps({ leave: Object })
const actual = ref(localDateTime()),
  error = ref('')
const employee = computed(() => employeeFor(props.leave.employeeId))
function submit() {
  if (!actual.value || actual.value > localDateTime()) {
    error.value = 'Enter a departure time that is not in the future.'
    return
  }
  recordDeparture(props.leave, actual.value)
}
</script>
<template>
  <BaseModal
    title="Record departure"
    :subtitle="`${employee.name} · ${employee.id}`"
    @close="closeModal"
  >
    <form id="departure-form" class="modal-form" @submit.prevent="submit">
      <div class="notice">
        <AppIcon name="movement" />
        Scheduled leave: {{ formatDate(leave.start) }} – {{ formatDate(leave.end) }}
      </div>
      <label class="field">
        <span>Actual departure</span>
        <input
          v-model="actual"
          class="input"
          type="datetime-local"
          :max="localDateTime()"
          required
        />
        <small>Prefilled with the current local date and time.</small>
      </label>
      <div v-if="actual.slice(0, 10) < today()" class="notice warning">
        <AppIcon name="clock" />
        This event will be tagged “Recorded late”.
      </div>
      <p class="small muted">The employee’s status and farm availability update immediately.</p>
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
    </form>
    <template #footer>
      <BaseButton variant="secondary" @click="closeModal">Cancel</BaseButton>
      <BaseButton form="departure-form" type="submit" icon="check">Mark as departed</BaseButton>
    </template>
  </BaseModal>
</template>
