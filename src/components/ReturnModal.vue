<script setup>
import { ref, computed, watch } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import AppIcon from './AppIcon.vue'
import { closeModal, employeeFor, recordReturn, openModal, movementFor } from '../utils/store'
import { localDateTime, formatDate, today } from '../utils/dateUtils'
const props = defineProps({ leave: Object })
const actual = ref(localDateTime()),
  outcome = ref(localDateTime().slice(0, 10) > props.leave.end ? 'late' : 'returned'),
  error = ref('')
const employee = computed(() => employeeFor(props.leave.employeeId))
const returnLabel = computed(() =>
  actual.value.slice(0, 10) > props.leave.end ? 'Returned late' : 'Returned on time'
)
watch(actual, () => {
  if (['returned', 'late'].includes(outcome.value))
    outcome.value = actual.value.slice(0, 10) > props.leave.end ? 'late' : 'returned'
})
function submit() {
  if (outcome.value === 'extend') return openModal('extension', { leave: props.leave })
  if (outcome.value === 'missing') return openModal('followup', { leave: props.leave })
  if (
    !actual.value ||
    actual.value > localDateTime() ||
    actual.value < movementFor(props.leave)?.departedAt
  ) {
    error.value = 'Return time must be after departure and no later than now.'
    return
  }
  recordReturn(props.leave, actual.value)
}
</script>
<template>
  <BaseModal
    title="Record a return"
    :subtitle="`${employee.name} · Expected ${formatDate(leave.end)}`"
    @close="closeModal"
  >
    <form id="return-form" class="modal-form" @submit.prevent="submit">
      <label class="field">
        <span>Outcome</span>
        <select v-model="outcome">
          <option value="returned">Returned on time</option>
          <option value="late">Returned late</option>
          <option value="extend">Extend leave</option>
          <option value="missing">Still not returned</option>
        </select>
      </label>
      <template v-if="['returned', 'late'].includes(outcome)">
        <label class="field">
          <span>Actual return</span>
          <input
            v-model="actual"
            class="input"
            type="datetime-local"
            :max="localDateTime()"
            required
          />
        </label>
        <div class="notice" :class="{ warning: returnLabel === 'Returned late' }">
          <AppIcon name="info" />
          {{ returnLabel }} · Outcome is calculated from the actual return time.
        </div>
        <p v-if="actual.slice(0, 10) < today()" class="tiny muted">
          This event will be tagged “Recorded late”.
        </p>
      </template>
      <p v-else class="small muted">
        {{
          outcome === 'extend'
            ? 'Continue to request an extension. The current return date stays in place until approval.'
            : 'Continue to record a follow-up. The employee remains off site.'
        }}
      </p>
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
    </form>
    <template #footer>
      <BaseButton variant="secondary" @click="closeModal">Cancel</BaseButton>
      <BaseButton form="return-form" type="submit" icon="check">
        {{ ['returned', 'late'].includes(outcome) ? 'Mark as returned' : 'Continue' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
