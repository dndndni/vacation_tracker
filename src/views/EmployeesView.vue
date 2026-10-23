<script setup>
import { ref, computed, watch } from 'vue'
import BaseButton from '../components/BaseButton.vue'
import BaseTable from '../components/BaseTable.vue'
import FilterBar from '../components/FilterBar.vue'
import StatusBadge from '../components/StatusBadge.vue'
import AppIcon from '../components/AppIcon.vue'
import { store, visibleEmployees, openModal, farmName } from '../utils/store'
import { DEPARTMENTS, STATUSES } from '../utils/constants'
import { exportCsv } from '../utils/exportUtils'
const search = ref(''),
  department = ref(''),
  status = ref(''),
  page = ref(1)
const employeeStatuses = Object.keys(STATUSES).slice(0, 8)
const filtered = computed(() =>
  visibleEmployees.value.filter(
    (e) =>
      `${e.name} ${e.id}`.toLowerCase().includes(search.value.toLowerCase()) &&
      (!department.value || e.department === department.value) &&
      (!status.value || e.status === status.value)
  )
)
const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / 20)))
const rows = computed(() => filtered.value.slice((page.value - 1) * 20, page.value * 20))
watch([search, department, status, () => store.selectedFarm, () => store.role], () => {
  page.value = 1
})
const columns = [
  { key: 'id', label: 'EMPLOYEE ID' },
  { key: 'name', label: 'EMPLOYEE' },
  { key: 'farm', label: 'FARM' },
  { key: 'department', label: 'DEPARTMENT' },
  { key: 'entitlement', label: 'ENTITLEMENT' },
  { key: 'balance', label: 'BALANCE' },
  { key: 'status', label: 'STATUS' },
]
function download() {
  exportCsv(
    filtered.value.map((e) => ({
      ID: e.id,
      Name: e.name,
      Farm: farmName(e.farm),
      Department: e.department,
      Entitlement: e.entitlement,
      Balance: e.remainingBalance,
      Status: e.status,
    })),
    'employees.csv'
  )
}
</script>
<template>
  <div>
    <header class="page-header">
      <div>
        <h1>Employees</h1>
        <p>The people who keep your farms growing. All employee records in one place.</p>
      </div>
      <div class="header-actions">
        <BaseButton variant="secondary" icon="download" @click="download">
          Export employees
        </BaseButton>
        <BaseButton icon="plus" @click="openModal('leave')">Plan leave</BaseButton>
      </div>
    </header>
    <div class="card">
      <div class="card-header">
        <div>
          <h2>
            Employee directory
            <span class="badge-count">{{ visibleEmployees.length }}</span>
          </h2>
          <p>Click an employee to see their profile, leave records, and history.</p>
        </div>
      </div>
      <FilterBar v-model="search" :count="filtered.length">
        <select v-model="department" aria-label="Filter department">
          <option value="">All departments</option>
          <option v-for="d in DEPARTMENTS" :key="d">{{ d }}</option>
        </select>
        <select v-model="status" aria-label="Filter status">
          <option value="">All statuses</option>
          <option v-for="s in employeeStatuses" :key="s">{{ s }}</option>
        </select>
      </FilterBar>
      <BaseTable
        :columns="columns"
        :rows="rows"
        clickable
        @row-click="openModal('employee', { employee: $event })"
      >
        <template #name="{ row }">
          <div class="person">
            <span class="avatar" :class="['', 'blue', 'sand', 'purple'][row.farm % 4]">
              {{
                row.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
              }}
            </span>
            <div>
              <strong>{{ row.name }}</strong>
              <small>{{ row.position }}</small>
            </div>
          </div>
        </template>
        <template #farm="{ row }">{{ farmName(row.farm) }}</template>
        <template #entitlement="{ row }">{{ row.entitlement }} days</template>
        <template #balance="{ row }">
          <strong>{{ row.remainingBalance }}</strong>
          <span class="muted">days</span>
        </template>
        <template #status="{ row }"><StatusBadge :status="row.status" /></template>
      </BaseTable>
      <div class="pagination">
        <span>
          {{ filtered.length ? (page - 1) * 20 + 1 : 0 }}–{{
            Math.min(page * 20, filtered.length)
          }}
          of {{ filtered.length }} employees
        </span>
        <div class="pagination-controls">
          <button
            class="icon-btn"
            aria-label="Previous page"
            :disabled="page === 1"
            @click="page--"
          >
            <AppIcon name="left" />
          </button>
          <span>Page {{ page }} of {{ pages }}</span>
          <button class="icon-btn" aria-label="Next page" :disabled="page >= pages" @click="page++">
            <AppIcon name="chevron" />
          </button>
        </div>
      </div>
    </div>
    <div class="insight-strip">
      <AppIcon name="shield" />
      <div>
        <strong>Employee records are maintained by HR and Farm Admin only.</strong>
        <p>
          Employees do not log in. Your team takes care of planning, approvals, and movement
          records.
        </p>
      </div>
    </div>
  </div>
</template>
