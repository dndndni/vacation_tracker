<script setup>
import { ref, computed } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import AppIcon from './AppIcon.vue'
import {
  store,
  canApprove,
  closeModal,
  employeeFor,
  requestExtension,
  approveExtension,
} from '../utils/store'
import { addDays, formatDate } from '../utils/dateUtils'
import { leaveWarnings } from '../utils/leaveUtils'
const props = defineProps({ leave: Object })
const requestedEnd = ref(
    props.leave.extension?.status === 'Pending'
      ? props.leave.extension.requestedEnd
      : addDays(props.leave.end, 3)
  ),
  reason = ref(props.leave.extension?.reason || ''),
  error = ref('')
const pending = computed(() => props.leave.extension?.status === 'Pending')
const warnings = computed(() => leaveWarnings(store, { ...props.leave, end: requestedEnd.value }))
const blocked = computed(() =>
  warnings.value.some(
    (w) =>
      ['invalid', 'overlap'].includes(w.type) ||
      (w.type === 'staffing' && store.settings.staffingMode === 'block')
  )
)
function submit() {
  if (pending.value && canApprove.value) {
    approveExtension(props.leave)
    return
  }
  if (!requestedEnd.value || requestedEnd.value <= props.leave.end) {
    error.value = 'Choose a date after the current return date.'
    return
  }
  requestExtension(props.leave, requestedEnd.value, reason.value)
}
</script>
<template>
  <BaseModal
    :title="pending ? 'Review extension request' : 'Request an extension'"
    :subtitle="employeeFor(leave.employeeId).name"
    @close="closeModal"
  >
    <form id="extension-form" class="modal-form" @submit.prevent="submit">
      <div class="form-summary">
        <div>
          <span class="muted">Original return date</span>
          <strong>
            <s>{{ formatDate(leave.end) }}</s>
          </strong>
        </div>
        <div>
          <span class="muted">Requested return</span>
          <strong>{{ formatDate(requestedEnd) }}</strong>
        </div>
      </div>
      <label class="field">
        <span>New expected return date</span>
        <input
          v-model="requestedEnd"
          class="input"
          type="date"
          :min="addDays(leave.end, 1)"
          :disabled="pending"
          required
        />
      </label>
      <label class="field">
        <span>
          Reason
          <span class="muted">(optional)</span>
        </span>
        <textarea
          v-model="reason"
          rows="3"
          :disabled="pending"
          placeholder="Add any useful context"
        />
      </label>
      <div v-for="warning in warnings" :key="warning.type" class="notice warning">
        <AppIcon name="alert" />
        {{ warning.message }}
      </div>
      <p class="tiny muted">
        The expected return date changes only after approval. The original date remains in history.
      </p>
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
    </form>
    <template #footer>
      <BaseButton variant="secondary" @click="closeModal">Close</BaseButton>
      <BaseButton
        v-if="!pending || canApprove"
        :disabled="pending && blocked"
        form="extension-form"
        type="submit"
        icon="check"
      >
        {{ pending ? 'Approve extension' : 'Request extension' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
