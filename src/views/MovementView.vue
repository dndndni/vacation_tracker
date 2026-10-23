<script setup>
import { ref, computed } from 'vue'
import BaseButton from '../components/BaseButton.vue'
import BaseTabs from '../components/BaseTabs.vue'
import BaseTable from '../components/BaseTable.vue'
import FilterBar from '../components/FilterBar.vue'
import StatusBadge from '../components/StatusBadge.vue'
import AppIcon from '../components/AppIcon.vue'
import { store, visibleLeaves, employeeFor, farmName, movementFor, openModal } from '../utils/store'
import { formatDate, formatTime, today, daysBetween } from '../utils/dateUtils'
const tab = ref('Scheduled Departures'),
  search = ref('')
function category(leave) {
  const movement = movementFor(leave)
  if (movement?.returnedAt) return 'Completed'
  if (!movement?.departedAt) return 'Scheduled Departures'
  const status = employeeFor(leave.employeeId).status
  if (['Overdue', 'AWOL', 'Extended'].includes(status)) return status
  if (status === 'Returning Soon') return 'Returning Soon'
  return 'On Leave'
}
const eligible = computed(() => visibleLeaves.value.filter((l) => l.approval === 'Approved'))
const labels = [
  'Scheduled Departures',
  'On Leave',
  'Returning Soon',
  'Overdue',
  'Extended',
  'AWOL',
  'Completed',
]
const tabs = computed(() =>
  labels.map((label) => ({
    label,
    count: eligible.value.filter((l) => category(l) === label).length,
  }))
)
const rows = computed(() =>
  eligible.value.filter(
    (l) =>
      category(l) === tab.value &&
      `${employeeFor(l.employeeId).name} ${l.employeeId}`
        .toLowerCase()
        .includes(search.value.toLowerCase())
  )
)
const columns = computed(() => [
  { key: 'employee', label: 'EMPLOYEE' },
  { key: 'departure', label: 'DEPARTURE' },
  { key: 'return', label: 'EXPECTED RETURN' },
  ...(tab.value === 'Overdue'
    ? [
        { key: 'overdue', label: 'DAYS OVERDUE' },
        { key: 'followup', label: 'LAST FOLLOW-UP' },
      ]
    : []),
  { key: 'status', label: 'STATUS' },
  { key: 'actions', label: 'ACTIONS' },
])
function finalStatus(leave, event) {
  const value = event.target.value
  event.target.value = ''
  if (value) openModal(value, { leave })
}
</script>
<template>
  <div>
    <header class="page-header">
      <div>
        <h1>Movement monitoring</h1>
        <p>Know who’s away, who’s coming back, and who needs a check-in.</p>
      </div>
      <BaseButton icon="plus" @click="openModal('leave')">Schedule departure</BaseButton>
    </header>
    <div class="card">
      <BaseTabs v-model="tab" :tabs="tabs" />
      <FilterBar v-model="search" :count="rows.length">
        <span class="tiny muted">
          {{
            tab === 'Overdue'
              ? 'Off-site employees with a missed return date'
              : 'Leave and movement records stay connected automatically'
          }}
        </span>
      </FilterBar>
      <BaseTable
        :columns="columns"
        :rows="rows"
        empty="No movements in this category for the selected farm."
      >
        <template #employee="{ row }">
          <div class="person">
            <span class="avatar" :class="tab === 'Overdue' ? 'sand' : 'blue'">
              {{
                employeeFor(row.employeeId)
                  .name.split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
              }}
            </span>
            <div>
              <strong>{{ employeeFor(row.employeeId).name }}</strong>
              <small>{{ farmName(employeeFor(row.employeeId).farm) }} · {{ row.employeeId }}</small>
            </div>
          </div>
        </template>
        <template #departure="{ row }">
          {{ formatDate(movementFor(row)?.departedAt || row.start) }}
          <div v-if="movementFor(row)?.recordedLate" class="recorded-late">Recorded late</div>
        </template>
        <template #return="{ row }">
          {{ formatDate(row.end) }}
          <div v-if="movementFor(row)?.returnedAt" class="tiny muted">
            Actual: {{ formatDate(movementFor(row).returnedAt) }}
          </div>
          <div v-if="row.originalEnd !== row.end" class="tiny muted">
            Original:
            <s>{{ formatDate(row.originalEnd) }}</s>
          </div>
        </template>
        <template #overdue="{ row }">
          <span class="strong">{{ Math.max(0, daysBetween(row.end, today())) }} days</span>
        </template>
        <template #followup="{ row }">
          <span :title="movementFor(row)?.followUpNote">
            {{
              movementFor(row)?.lastFollowUp
                ? formatTime(movementFor(row).lastFollowUp)
                : 'No follow-up yet'
            }}
          </span>
        </template>
        <template #status="{ row }">
          <StatusBadge
            :status="
              movementFor(row)?.returnedAt
                ? movementFor(row).status === 'Returned Late'
                  ? 'Returned Late'
                  : 'Completed'
                : category(row) === 'Scheduled Departures'
                ? 'Scheduled'
                : employeeFor(row.employeeId).status
            "
          />
        </template>
        <template #actions="{ row }">
          <div class="table-actions">
            <BaseButton
              v-if="tab === 'Scheduled Departures'"
              small
              @click="openModal('departure', { leave: row })"
            >
              Mark as departed
            </BaseButton>
            <BaseButton
              v-else-if="tab !== 'Completed'"
              small
              variant="secondary"
              @click="openModal('return', { leave: row })"
            >
              Mark as returned
            </BaseButton>
            <button
              v-if="tab === 'Overdue'"
              class="text-link"
              @click="openModal('followup', { leave: row })"
            >
              Record follow-up
            </button>
            <select
              v-if="
                tab === 'Overdue' &&
                store.role === 'HR' &&
                employeeFor(row.employeeId).status !== 'AWOL'
              "
              aria-label="Set final status"
              @change="finalStatus(row, $event)"
            >
              <option value="">Set final status</option>
              <option value="extension">Extended</option>
              <option value="return">Returned Late</option>
              <option value="awol">AWOL</option>
            </select>
            <button
              class="text-link"
              aria-label="View movement history"
              @click="openModal('history', { leave: row })"
            >
              <AppIcon name="history" />
            </button>
          </div>
        </template>
      </BaseTable>
      <div class="card-footer">
        <span>
          {{ rows.length }} movements · Actual event dates are retained alongside recorded dates.
        </span>
        <span>All times are local</span>
      </div>
    </div>
    <div class="insight-strip">
      <AppIcon name="clock" />
      <div>
        <strong>A quick update keeps everyone informed.</strong>
        <p>
          Record departures and returns in one step. Late entries are tagged automatically, and
          follow-ups stay in the audit trail.
        </p>
      </div>
    </div>
  </div>
</template>
