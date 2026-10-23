<script setup>
import { computed } from 'vue'
import AppIcon from '../components/AppIcon.vue'
import BaseButton from '../components/BaseButton.vue'
import StatCard from '../components/StatCard.vue'
import StatusBadge from '../components/StatusBadge.vue'
import BaseTable from '../components/BaseTable.vue'
import NeedsAttentionPanel from '../components/NeedsAttentionPanel.vue'
import {
  store,
  stats,
  allowedFarms,
  visibleEmployees,
  visibleLeaves,
  employeeFor,
  openModal,
  farmName,
  movementFor,
} from '../utils/store'
import { isOnSite } from '../utils/leaveUtils'
import { formatDate, formatTime, today } from '../utils/dateUtils'
import { exportCsv } from '../utils/exportUtils'
const farmRows = computed(() =>
  allowedFarms.value.map((f) => {
    const people = store.employees.filter((e) => e.farm === f.id),
      onsite = people.filter(isOnSite).length
    return {
      ...f,
      total: people.length,
      onsite,
      percent: Math.round((onsite / people.length) * 100),
    }
  })
)
const recentActivity = computed(() =>
  store.history
    .filter((h) => visibleEmployees.value.some((e) => e.id === h.employeeId))
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 4)
)
const upcoming = computed(() =>
  visibleLeaves.value
    .filter((l) => l.approval === 'Approved' && !movementFor(l)?.departedAt)
    .sort((a, b) => a.start.localeCompare(b.start))
    .slice(0, 4)
)
const columns = [
  { key: 'employee', label: 'EMPLOYEE' },
  { key: 'dates', label: 'LEAVE DATES' },
  { key: 'status', label: 'STATUS' },
  { key: 'action', label: '' },
]
function download() {
  exportCsv(
    farmRows.value.map((f) => ({
      Farm: f.name,
      Employees: f.total,
      'On site': f.onsite,
      'Availability %': f.percent,
      Minimum: f.minimum,
    })),
    'farm-overview.csv'
  )
}
</script>
<template>
  <div>
    <header class="page-header">
      <div>
        <h1>Dashboard</h1>
        <p>A clear view of your people. Here’s what’s happening across your farms.</p>
      </div>
      <div class="header-actions">
        <BaseButton variant="secondary" icon="download" @click="download">
          Export overview
        </BaseButton>
        <BaseButton icon="plus" @click="openModal('leave')">New leave</BaseButton>
      </div>
    </header>
    <div class="stats-grid">
      <StatCard
        title="Employees"
        :value="stats.employees"
        :caption="
          store.selectedFarm === 'all'
            ? `${allowedFarms.length} farms, one team`
            : `${farmName(store.selectedFarm)} team members`
        "
        icon="users"
      />
      <StatCard
        title="On site"
        :value="stats.onsite"
        caption="Present and ready to work"
        icon="farm"
      />
      <StatCard
        title="On leave"
        :value="stats.leave"
        caption="Currently away"
        icon="leaf"
        tone="leave"
      />
      <StatCard
        title="Returning soon"
        :value="stats.returning"
        caption="Within the next 3 days"
        icon="calendar"
        tone="returning"
      />
      <StatCard
        title="Overdue"
        :value="stats.overdue"
        caption="Follow-up needed"
        icon="alert"
        tone="overdue"
      />
      <StatCard
        title="Pending approvals"
        :value="stats.pending"
        caption="Ready for your review"
        icon="clock"
        tone="pending"
      />
    </div>
    <div class="dashboard-grid">
      <section class="card">
        <div class="card-header">
          <div>
            <h2>Farm availability</h2>
            <p>On-site teams at a glance · {{ formatDate(today(), { weekday: 'long' }) }}</p>
          </div>
          <RouterLink to="/staffing" class="text-link">
            View staffing
            <AppIcon name="arrow" />
          </RouterLink>
        </div>
        <div class="card-body">
          <button
            v-for="farm in farmRows"
            :key="farm.id"
            class="farm-row"
            :aria-label="`Select ${farm.name}, ${farm.percent}% available`"
            @click="store.selectedFarm = farm.id"
          >
            <span class="farm-name">
              <AppIcon name="farm" />
              {{ farm.name }}
            </span>
            <div>
              <div class="progress-track">
                <div
                  :class="['progress-fill', { warning: farm.onsite < farm.minimum }]"
                  :style="{ width: farm.percent + '%' }"
                />
              </div>
              <div class="farm-headcount" style="margin-top: 5px">
                {{ farm.onsite }} of {{ farm.total }} on site
              </div>
            </div>
            <span class="farm-percentage">
              {{ farm.percent }}
              <small>%</small>
            </span>
            <div>
              <span v-if="farm.onsite < farm.minimum" class="warning-badge">
                <AppIcon name="alert" />
                Below minimum
              </span>
              <span v-else class="farm-headcount">Staffing healthy</span>
            </div>
          </button>
          <div class="farm-legend">
            <span>
              <i class="legend-dot" />
              Healthy staffing
            </span>
            <span>
              <i class="legend-dot warning" />
              Below minimum headcount
            </span>
          </div>
        </div>
        <div class="card-footer">
          <span>Suggested minimum: 80% of each farm’s team</span>
          <span>Click a farm to filter your workspace</span>
        </div>
      </section>
      <NeedsAttentionPanel />
    </div>
    <div class="dashboard-grid mt-24">
      <section class="card">
        <div class="card-header">
          <div>
            <h2>Upcoming departures</h2>
            <p>Planned time away, without the surprises.</p>
          </div>
          <RouterLink to="/calendar" class="text-link">
            Open calendar
            <AppIcon name="arrow" />
          </RouterLink>
        </div>
        <BaseTable
          :columns="columns"
          :rows="upcoming"
          empty="No upcoming departures for this selection."
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
                <small>{{ farmName(employeeFor(row.employeeId).farm) }} · {{ row.type }}</small>
              </div>
            </div>
          </template>
          <template #dates="{ row }">
            {{ formatDate(row.start) }} – {{ formatDate(row.end) }}
          </template>
          <template #status><StatusBadge status="Scheduled" /></template>
          <template #action="{ row }">
            <button class="text-link" @click="openModal('departure', { leave: row })">
              Mark departed
            </button>
          </template>
        </BaseTable>
      </section>
      <section class="card">
        <div class="card-header">
          <div>
            <h2>Recent activity</h2>
            <p>A little context, automatically recorded.</p>
          </div>
          <AppIcon name="history" />
        </div>
        <div class="card-body">
          <div v-if="!recentActivity.length" class="empty-state">
            <AppIcon name="history" />
            <p>No recent activity for this farm.</p>
          </div>
          <div v-for="entry in recentActivity" :key="entry.id" class="activity-row">
            <span class="activity-symbol">
              <AppIcon
                :name="
                  entry.action.includes('Extension')
                    ? 'history'
                    : entry.action.includes('Departure')
                    ? 'movement'
                    : 'check'
                "
              />
            </span>
            <div>
              <p>{{ entry.action }}</p>
              <small>
                {{ employeeFor(entry.employeeId)?.name }} ·
                {{ farmName(employeeFor(entry.employeeId)?.farm) }}
              </small>
            </div>
            <span class="activity-time">{{ formatTime(entry.timestamp) }}</span>
          </div>
        </div>
      </section>
    </div>
    <div class="insight-strip">
      <AppIcon name="sprout" />
      <div>
        <strong>A little planning goes a long way.</strong>
        <p>
          Plan leave from the calendar and we’ll check balances, overlapping dates, and staffing for
          you.
        </p>
      </div>
      <RouterLink to="/calendar" class="text-link">
        Plan with the calendar
        <AppIcon name="arrow" />
      </RouterLink>
    </div>
  </div>
</template>
