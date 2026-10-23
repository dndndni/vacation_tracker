<script setup>
import { ref, computed } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import AppIcon from './AppIcon.vue'
import {
  store,
  visibleEmployees,
  employeeFor,
  farmName,
  closeModal,
  saveLeave,
  canApprove,
} from '../utils/store'
import { LEAVE_TYPES } from '../utils/constants'
import { today, addDays, workingDays, daysBetween, formatDate } from '../utils/dateUtils'
import { leaveWarnings } from '../utils/leaveUtils'
const props = defineProps({ draft: { type: Object, default: () => ({}) }, confirm: Boolean })
const search = ref(''),
  attempted = ref(false)
const form = ref({
  employeeId:
    props.draft.employeeId ||
    visibleEmployees.value.find((e) => e.status === 'On Site')?.id ||
    visibleEmployees.value[0]?.id ||
    '',
  type: props.draft.type || 'Annual Leave',
  start: props.draft.start || addDays(today(), 2),
  end: props.draft.end || addDays(today(), 5),
  ...(props.draft.id ? { id: props.draft.id } : {}),
})
const employees = computed(() =>
  visibleEmployees.value.filter((e) =>
    `${e.name} ${e.id}`.toLowerCase().includes(search.value.toLowerCase())
  )
)
const employee = computed(() => employeeFor(form.value.employeeId))
const days = computed(() => workingDays(form.value.start, form.value.end))
const balance = computed(
  () =>
    (employee.value?.remainingBalance || 0) -
    (form.value.type === 'Annual Leave' ? days.value : 0) +
    (store.leaves.find(
      (l) => l.id === form.value.id && l.approval === 'Approved' && l.type === 'Annual Leave'
    )?.days || 0)
)
const warnings = computed(() => leaveWarnings(store, form.value))
const invalid = computed(
  () =>
    !employee.value ||
    !form.value.start ||
    !form.value.end ||
    form.value.end < form.value.start ||
    daysBetween(form.value.start, form.value.end) > 366 ||
    warnings.value.some(
      (w) =>
        ['invalid', 'overlap'].includes(w.type) ||
        (w.type === 'staffing' && store.settings.staffingMode === 'block')
    )
)
function save() {
  attempted.value = true
  if (!invalid.value) saveLeave(form.value)
}
</script>
<template>
  <BaseModal
    :title="
      confirm ? (form.id ? 'Move scheduled leave' : 'Confirm leave dates') : 'Plan a new leave'
    "
    :subtitle="
      confirm
        ? 'Review the dates and automatic checks before saving.'
        : 'A few details now. The rest stays in sync automatically.'
    "
    @close="closeModal"
  >
    <form id="leave-form" class="modal-form" @submit.prevent="save">
      <template v-if="!confirm">
        <label class="field">
          <span>Find employee</span>
          <input
            v-model="search"
            class="input"
            type="search"
            placeholder="Search name or employee ID"
          />
        </label>
        <label class="field">
          <span>Employee</span>
          <select v-model="form.employeeId" required>
            <option v-if="!employees.length" disabled value="">No matching employees</option>
            <option v-for="person in employees" :key="person.id" :value="person.id">
              {{ person.name }} · {{ person.id }}
            </option>
          </select>
        </label>
      </template>
      <div v-else class="person">
        <span class="avatar">
          {{
            employee?.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
          }}
        </span>
        <div>
          <strong>{{ employee?.name }}</strong>
          <small>{{ employee?.id }} · {{ employee?.department }}</small>
        </div>
      </div>
      <div class="notice">
        <AppIcon name="farm" />
        <span>{{ farmName(employee?.farm) }} · Automatically assigned from employee record</span>
      </div>
      <label class="field">
        <span>Leave type</span>
        <select v-model="form.type">
          <option v-for="type in LEAVE_TYPES" :key="type">{{ type }}</option>
        </select>
      </label>
      <div class="two-column">
        <label class="field">
          <span>First day of leave</span>
          <input v-model="form.start" class="input" type="date" required />
        </label>
        <label class="field">
          <span>Expected return date</span>
          <input v-model="form.end" class="input" type="date" :min="form.start" required />
        </label>
      </div>
      <div class="form-summary">
        <div>
          <span class="muted">Working days</span>
          <strong>{{ days }}</strong>
        </div>
        <div>
          <span class="muted">Current balance</span>
          <strong>
            {{ employee?.remainingBalance || 0 }}
            <small>days</small>
          </strong>
        </div>
        <div>
          <span class="muted">Balance after leave</span>
          <strong>
            {{ balance }}
            <small>days</small>
          </strong>
        </div>
      </div>
      <p class="tiny muted">
        {{ formatDate(form.start) }} – {{ formatDate(form.end) }} · Sundays and configured holidays
        excluded. Expected return is included in leave-day calculations.
      </p>
      <div v-for="warning in warnings" :key="warning.type" class="notice warning">
        <AppIcon name="alert" />
        {{ warning.message }}
      </div>
      <div v-if="!warnings.length" class="notice">
        <AppIcon name="check" />
        Balance, dates, and farm staffing checks look good.
      </div>
      <p class="tiny muted">
        {{
          canApprove
            ? 'This leave will be approved when saved.'
            : 'This leave will be sent to HR for approval.'
        }}
        Every change is recorded in history.
      </p>
      <p v-if="invalid && attempted" role="alert" class="form-error">
        Choose valid dates within one year and resolve any blocking warnings.
      </p>
    </form>
    <template #footer>
      <BaseButton variant="secondary" @click="closeModal">Cancel</BaseButton>
      <BaseButton form="leave-form" type="submit" icon="check">
        {{ form.id ? 'Save changes' : 'Save leave' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
