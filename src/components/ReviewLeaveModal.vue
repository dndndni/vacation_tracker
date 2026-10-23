<script setup>
import { ref, computed } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import AppIcon from './AppIcon.vue'
import {
  store,
  canApprove,
  closeModal,
  approveLeave,
  reviseLeave,
  employeeFor,
  farmName,
} from '../utils/store'
import { leaveWarnings } from '../utils/leaveUtils'
import { formatDate } from '../utils/dateUtils'
const props = defineProps({ leave: Object })
const note = ref(''),
  revising = ref(false)
const warnings = computed(() => leaveWarnings(store, props.leave))
const blocked = computed(() =>
  warnings.value.some(
    (w) =>
      ['invalid', 'overlap'].includes(w.type) ||
      (w.type === 'staffing' && store.settings.staffingMode === 'block')
  )
)
function approve() {
  if (!blocked.value) {
    approveLeave(props.leave)
    closeModal()
  }
}
</script>
<template>
  <BaseModal
    title="Review leave request"
    :subtitle="`${employeeFor(leave.employeeId).name} · ${farmName(
      employeeFor(leave.employeeId).farm
    )}`"
    @close="closeModal"
  >
    <div class="modal-form">
      <div class="form-summary">
        <div>
          <span class="muted">{{ leave.type }}</span>
          <strong>
            {{ leave.days }}
            <small>working days</small>
          </strong>
        </div>
        <div>
          <span class="muted">Dates</span>
          <p class="mt-16">{{ formatDate(leave.start) }} – {{ formatDate(leave.end) }}</p>
        </div>
      </div>
      <div v-for="warning in warnings" :key="warning.type" class="notice warning">
        <AppIcon name="alert" />
        {{ warning.message }}
      </div>
      <p v-if="!warnings.length" class="notice">
        <AppIcon name="check" />
        All automatic checks passed.
      </p>
      <label v-if="revising" class="field">
        <span>
          Revision note
          <span class="muted">(optional)</span>
        </span>
        <textarea v-model="note" rows="3" placeholder="What needs to change?" />
      </label>
    </div>
    <template #footer>
      <BaseButton variant="secondary" @click="closeModal">Cancel</BaseButton>
      <BaseButton
        v-if="canApprove"
        variant="ghost"
        @click="revising ? reviseLeave(leave, note) : (revising = true)"
      >
        {{ revising ? 'Send for revision' : 'Return for revision' }}
      </BaseButton>
      <BaseButton :disabled="blocked || (!canApprove && leave.endorsed)" @click="approve">
        {{ canApprove ? 'Approve leave' : leave.endorsed ? 'Endorsed' : 'Endorse to HR' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
