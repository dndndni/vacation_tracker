<script setup>
import { ref, computed } from 'vue'
import BaseButton from '../components/BaseButton.vue'
import BaseTable from '../components/BaseTable.vue'
import StatCard from '../components/StatCard.vue'
import StatusBadge from '../components/StatusBadge.vue'
import AppIcon from '../components/AppIcon.vue'
import {
  store,
  visibleLeaves,
  visibleEmployees,
  allowedFarms,
  employeeFor,
  farmName,
  movementFor,
  openModal,
} from '../utils/store'
import { today, addDays, overlaps, formatDate, daysBetween } from '../utils/dateUtils'
import { LEAVE_TYPES } from '../utils/constants'
import { exportCsv, simulateExport } from '../utils/exportUtils'
import { dailyHeadcount } from '../utils/leaveUtils'
const report = ref('Leave Summary'),
  start = ref(addDays(today(), -30)),
  end = ref(addDays(today(), 30)),
  type = ref(''),
  status = ref('')
const reportTypes = [
  'Leave Summary',
  'Movements (Entries/Exits)',
  'Extensions',
  'Overdue/AWOL',
  'Staffing',
  'Employee History',
]
const statusOptions = [
  'Pending',
  'Approved',
  'Endorsed',
  'Scheduled',
  'On Leave',
  'Returning Soon',
  'Overdue',
  'Extended',
  'Returned Late',
  'AWOL',
  'Completed',
]
const selectedLeaves = computed(() =>
  visibleLeaves.value.filter(
    (l) =>
      overlaps(l.start, l.end, start.value, end.value) &&
      (!type.value || l.type === type.value) &&
      (!status.value ||
        [l.approval, l.status, employeeFor(l.employeeId).status].includes(status.value))
  )
)
const rows = computed(() => {
  if (!start.value || !end.value || end.value < start.value) return []
  if (report.value === 'Staffing') {
    const farmIds = new Set(visibleEmployees.value.map((e) => e.farm))
    const count = Math.min(daysBetween(start.value, end.value) + 1, 93)
    return allowedFarms.value
      .filter((f) => farmIds.has(f.id))
      .flatMap((f) =>
        Array.from({ length: count }, (_, i) => {
          const date = addDays(start.value, i),
            onsite = dailyHeadcount(store, f.id, date),
            total = store.employees.filter((e) => e.farm === f.id).length
          return {
            id: `${f.id}-${date}`,
            farm: f.name,
            date,
            onsite,
            minimum: f.minimum,
            availability: Math.round((onsite / total) * 100) + '%',
            status: onsite < f.minimum ? 'Below minimum' : 'Healthy',
          }
        })
      )
      .filter(
        (r) => !status.value || (status.value === 'Overdue' ? r.status === 'Below minimum' : true)
      )
  }
  if (report.value === 'Employee History')
    return store.history
      .filter(
        (h) =>
          visibleEmployees.value.some((e) => e.id === h.employeeId) &&
          h.timestamp.slice(0, 10) >= start.value &&
          h.timestamp.slice(0, 10) <= end.value &&
          (!type.value || store.leaves.find((l) => l.id === h.leaveId)?.type === type.value) &&
          (!status.value ||
            [
              employeeFor(h.employeeId).status,
              store.leaves.find((l) => l.id === h.leaveId)?.approval,
            ].includes(status.value))
      )
      .map((h) => ({
        id: h.id,
        employee: employeeFor(h.employeeId).name,
        farm: farmName(employeeFor(h.employeeId).farm),
        date: h.timestamp.slice(0, 10),
        action: h.action,
        actor: h.actor,
        changes: JSON.stringify({ before: h.oldValues, after: h.newValues }),
        late: h.recordedLate ? 'Recorded late' : '',
      }))
  let source = selectedLeaves.value
  if (report.value === 'Extensions')
    source = source.filter((l) => l.extension || l.status === 'Extended')
  if (report.value === 'Overdue/AWOL')
    source = source.filter(
      (l) =>
        ['Overdue', 'AWOL'].includes(employeeFor(l.employeeId).status) &&
        movementFor(l) &&
        !movementFor(l).returnedAt
    )
  if (report.value === 'Movements (Entries/Exits)') source = source.filter((l) => movementFor(l))
  return source.map((l) => {
    const employee = employeeFor(l.employeeId),
      movement = movementFor(l)
    return {
      id: l.id,
      employee: employee.name,
      farm: farmName(employee.farm),
      type: l.type,
      start: l.start,
      end: l.end,
      days: l.days,
      status:
        report.value === 'Leave Summary'
          ? l.approval
          : movement?.returnedAt
          ? movement.status === 'Returned Late'
            ? 'Returned Late'
            : 'Completed'
          : employee.status,
      ...(report.value === 'Extensions'
        ? {
            original: l.extension?.originalEnd || l.originalEnd,
            requested: l.extension?.requestedEnd || l.end,
            approval: l.extension?.status || 'Approved',
          }
        : {}),
      ...(report.value === 'Movements (Entries/Exits)'
        ? {
            departed: movement?.departedAt,
            returned: movement?.returnedAt || 'Not yet returned',
            late: movement?.recordedLate ? 'Recorded late' : '',
          }
        : {}),
      ...(report.value === 'Overdue/AWOL'
        ? {
            overdue: Math.max(0, daysBetween(l.end, today())),
            followup: movement?.lastFollowUp || 'None',
          }
        : {}),
    }
  })
})
const columns = computed(() =>
  report.value === 'Staffing'
    ? [
        { key: 'farm', label: 'FARM' },
        { key: 'date', label: 'DATE' },
        { key: 'onsite', label: 'ON SITE' },
        { key: 'minimum', label: 'MINIMUM' },
        { key: 'availability', label: 'AVAILABILITY' },
        { key: 'status', label: 'STATUS' },
      ]
    : report.value === 'Employee History'
    ? [
        { key: 'employee', label: 'EMPLOYEE' },
        { key: 'farm', label: 'FARM' },
        { key: 'date', label: 'DATE' },
        { key: 'action', label: 'ACTION' },
        { key: 'actor', label: 'RECORDED BY' },
        { key: 'late', label: 'NOTE' },
      ]
    : [
        { key: 'employee', label: 'EMPLOYEE' },
        { key: 'farm', label: 'FARM' },
        { key: 'type', label: 'LEAVE TYPE' },
        { key: 'dates', label: 'DATES' },
        { key: 'days', label: 'DAYS' },
        ...(report.value === 'Extensions'
          ? [{ key: 'extension', label: 'ORIGINAL → REQUESTED RETURN' }]
          : []),
        ...(report.value === 'Overdue/AWOL' ? [{ key: 'overdue', label: 'DAYS OVERDUE' }] : []),
        ...(report.value === 'Movements (Entries/Exits)'
          ? [
              { key: 'departed', label: 'ACTUAL DEPARTURE' },
              { key: 'returned', label: 'ACTUAL RETURN' },
            ]
          : []),
        { key: 'status', label: 'STATUS' },
      ]
)
const workingDayTotal = computed(() => rows.value.reduce((sum, r) => sum + (r.days || 0), 0))
function detail(row) {
  if (report.value === 'Staffing') return
  if (report.value === 'Employee History') {
    const history = store.history.find((h) => h.id === row.id)
    openModal('employee', { employee: employeeFor(history.employeeId) })
  } else openModal('history', { leave: store.leaves.find((l) => l.id === row.id) })
}
</script>
<template>
  <div>
    <header class="page-header">
      <div>
        <h1>HR reports</h1>
        <p>Clear records, better decisions. Bring the full picture into focus.</p>
      </div>
      <div class="header-actions">
        <BaseButton variant="secondary" @click="simulateExport">Excel</BaseButton>
        <BaseButton variant="secondary" @click="simulateExport">PDF</BaseButton>
        <BaseButton
          icon="download"
          @click="exportCsv(rows, report.toLowerCase().replace(/[^a-z]+/g, '-') + '.csv')"
        >
          Export CSV
        </BaseButton>
      </div>
    </header>
    <div class="stats-grid report-metrics">
      <StatCard
        title="Matching records"
        :value="rows.length"
        caption="Within selected filters"
        icon="report"
      />
      <StatCard
        title="Employees in scope"
        :value="visibleEmployees.length"
        caption="Respects your farm access"
        icon="users"
      />
      <StatCard
        title="Working days"
        :value="workingDayTotal"
        caption="Across matching leave records"
        icon="calendar"
      />
      <StatCard
        title="Farms in scope"
        :value="new Set(visibleEmployees.map((e) => e.farm)).size"
        caption="Included in this report"
        icon="farm"
      />
    </div>
    <div class="card">
      <div class="card-header">
        <div>
          <h2>{{ report }}</h2>
          <p>
            {{
              store.selectedFarm === 'all'
                ? 'Consolidated across all authorized farms'
                : farmName(store.selectedFarm)
            }}
            · {{ formatDate(start) }} – {{ formatDate(end) }}
          </p>
        </div>
        <label class="field report-type">
          <span class="sr-only">Report type</span>
          <select v-model="report" aria-label="Report type">
            <option v-for="r in reportTypes" :key="r">{{ r }}</option>
          </select>
        </label>
      </div>
      <div class="filter-bar">
        <label class="field">
          <span class="sr-only">Report farm</span>
          <select v-model="store.selectedFarm" aria-label="Report farm">
            <option v-if="store.role === 'HR'" value="all">All farms · Consolidated</option>
            <option v-for="f in allowedFarms" :key="f.id" :value="f.id">{{ f.name }}</option>
          </select>
        </label>
        <label class="filter-date">
          From
          <input v-model="start" class="input" type="date" aria-label="Report start date" />
        </label>
        <label class="filter-date">
          To
          <input
            v-model="end"
            class="input"
            type="date"
            :min="start"
            aria-label="Report end date"
          />
        </label>
        <select v-if="report !== 'Staffing'" v-model="type" aria-label="Report leave type">
          <option value="">All leave types</option>
          <option v-for="t in LEAVE_TYPES" :key="t">{{ t }}</option>
        </select>
        <select v-if="report !== 'Staffing'" v-model="status" aria-label="Report status">
          <option value="">All statuses</option>
          <option v-for="s in statusOptions" :key="s">{{ s }}</option>
        </select>
      </div>
      <div v-if="end < start" class="notice danger">
        <AppIcon name="alert" />
        Choose an end date on or after the start date.
      </div>
      <BaseTable
        :columns="columns"
        :rows="rows"
        :clickable="report !== 'Staffing'"
        @row-click="detail"
      >
        <template #date="{ row }">{{ formatDate(row.date) }}</template>
        <template #dates="{ row }">
          {{ formatDate(row.start) }} – {{ formatDate(row.end) }}
        </template>
        <template #extension="{ row }">
          <s class="muted">{{ formatDate(row.original) }}</s>
          → {{ formatDate(row.requested) }}
          <div class="tiny muted">{{ row.approval }}</div>
        </template>
        <template #status="{ row }">
          <span
            v-if="report === 'Staffing'"
            :class="row.status === 'Below minimum' ? 'warning-badge' : 'status-badge status-onsite'"
          >
            {{ row.status }}
          </span>
          <StatusBadge v-else :status="row.status" />
        </template>
        <template #departed="{ row }">
          {{ formatDate(row.departed) }}
          <div v-if="row.late" class="recorded-late">{{ row.late }}</div>
        </template>
        <template #returned="{ row }">
          {{ row.returned === 'Not yet returned' ? row.returned : formatDate(row.returned) }}
        </template>
      </BaseTable>
      <div class="card-footer">
        <span>
          {{ rows.length }} matching records{{
            report === 'Staffing'
              ? ' · Forecast capped at 93 days per farm'
              : ' · Click a record to see its history'
          }}
        </span>
        <span>CSV downloads all filtered records</span>
      </div>
    </div>
    <div class="insight-strip">
      <AppIcon name="shield" />
      <div>
        <strong>The same data, wherever you look.</strong>
        <p>
          Reports use the shared leave, movement, staffing, and audit records. Farm Admin access is
          restricted to assigned farms.
        </p>
      </div>
    </div>
  </div>
</template>
