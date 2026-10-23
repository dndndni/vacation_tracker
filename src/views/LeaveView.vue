<script setup>
import { ref, computed } from 'vue'
import BaseButton from '../components/BaseButton.vue'
import BaseTabs from '../components/BaseTabs.vue'
import BaseTable from '../components/BaseTable.vue'
import FilterBar from '../components/FilterBar.vue'
import StatusBadge from '../components/StatusBadge.vue'
import AppIcon from '../components/AppIcon.vue'
import { store, visibleLeaves, canApprove, employeeFor, farmName, openModal } from '../utils/store'
import { LEAVE_TYPES } from '../utils/constants'
import { formatDate } from '../utils/dateUtils'
const tab = ref('Pending Approval'),
  search = ref(''),
  type = ref('')
const tabs = computed(() => [
  {
    label: 'Pending Approval',
    count: visibleLeaves.value.filter((l) => ['Pending', 'Endorsed'].includes(l.approval)).length,
  },
  { label: 'Approved', count: visibleLeaves.value.filter((l) => l.approval === 'Approved').length },
  {
    label: 'Extensions',
    count: visibleLeaves.value.filter((l) => l.extension?.status === 'Pending').length,
  },
  { label: 'All', count: visibleLeaves.value.length },
])
const rows = computed(() =>
  visibleLeaves.value.filter(
    (l) =>
      (tab.value === 'All' ||
        (tab.value === 'Approved' && l.approval === 'Approved') ||
        (tab.value === 'Pending Approval' && ['Pending', 'Endorsed'].includes(l.approval)) ||
        (tab.value === 'Extensions' && l.extension)) &&
      employeeFor(l.employeeId).name.toLowerCase().includes(search.value.toLowerCase()) &&
      (!type.value || l.type === type.value)
  )
)
const columns = computed(() => [
  { key: 'employee', label: 'EMPLOYEE' },
  { key: 'type', label: 'LEAVE TYPE' },
  {
    key: 'dates',
    label: tab.value === 'Extensions' ? 'ORIGINAL → REQUESTED RETURN' : 'LEAVE DATES',
  },
  { key: 'days', label: 'WORKING DAYS' },
  { key: 'approval', label: 'STATUS' },
  { key: 'actions', label: 'ACTIONS' },
])
</script>
<template>
  <div>
    <header class="page-header">
      <div>
        <h1>Leave planning</h1>
        <p>Make time away work for everyone, from the first request to the final return.</p>
      </div>
      <BaseButton icon="plus" @click="openModal('leave')">New leave</BaseButton>
    </header>
    <div class="card">
      <BaseTabs v-model="tab" :tabs="tabs" />
      <FilterBar v-model="search" placeholder="Search employee name…" :count="rows.length">
        <select v-model="type" aria-label="Filter leave type">
          <option value="">All leave types</option>
          <option v-for="t in LEAVE_TYPES" :key="t">{{ t }}</option>
        </select>
        <span class="tiny muted">
          {{
            store.settings.approvalMode === 'hr_approves'
              ? 'HR approval required'
              : 'Farm Admin approval enabled'
          }}
        </span>
      </FilterBar>
      <BaseTable
        :columns="columns"
        :rows="rows"
        :empty="
          tab === 'Pending Approval'
            ? 'No leave requests are waiting for review.'
            : 'No leave records match this view.'
        "
      >
        <template #employee="{ row }">
          <div class="person">
            <span class="avatar blue">
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
              <small>{{ farmName(employeeFor(row.employeeId).farm) }} · {{ row.id }}</small>
            </div>
          </div>
        </template>
        <template #dates="{ row }">
          <template v-if="tab === 'Extensions'">
            <s class="muted">{{ formatDate(row.extension.originalEnd) }}</s>
            <AppIcon name="arrow" :size="12" />
            {{ formatDate(row.extension.requestedEnd) }}
          </template>
          <template v-else>{{ formatDate(row.start) }} – {{ formatDate(row.end) }}</template>
        </template>
        <template #days="{ row }">{{ row.days }} days</template>
        <template #approval="{ row }">
          <StatusBadge :status="tab === 'Extensions' ? row.extension.status : row.approval" />
          <div v-if="row.note" class="tiny muted" :title="row.note">Revision note added</div>
        </template>
        <template #actions="{ row }">
          <div class="table-actions">
            <BaseButton
              v-if="tab === 'Extensions' && row.extension.status === 'Pending'"
              small
              variant="secondary"
              @click="openModal('extension', { leave: row })"
            >
              {{ canApprove ? 'Review extension' : 'View request' }}
            </BaseButton>
            <BaseButton
              v-else-if="['Pending', 'Endorsed'].includes(row.approval)"
              small
              :disabled="!canApprove && row.endorsed"
              @click="openModal('review', { leave: row })"
            >
              {{ canApprove ? 'Review / Approve' : row.endorsed ? 'Endorsed' : 'Endorse' }}
            </BaseButton>
            <button class="text-link" @click="openModal('history', { leave: row })">
              <AppIcon name="history" />
              History
            </button>
          </div>
        </template>
      </BaseTable>
      <div class="card-footer">
        <span>{{ rows.length }} leave records · All changes are automatically recorded.</span>
        <RouterLink to="/calendar" class="text-link">
          Plan in calendar
          <AppIcon name="arrow" />
        </RouterLink>
      </div>
    </div>
    <div class="insight-strip">
      <AppIcon name="info" />
      <div>
        <strong>Suggested rules, flexible by design.</strong>
        <p>
          Annual leave uses the leave balance. Sundays and sample holidays are excluded. HR can
          adjust approval and staffing behavior in demo settings.
        </p>
      </div>
    </div>
  </div>
</template>
