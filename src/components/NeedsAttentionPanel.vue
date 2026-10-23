<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from './AppIcon.vue'
import {
  store,
  visibleLeaves,
  visibleEmployees,
  allowedFarms,
  employeeFor,
  openModal,
  movementFor,
  farmName,
} from '../utils/store'
import { today, formatDate, daysBetween } from '../utils/dateUtils'
import { isOnSite } from '../utils/leaveUtils'
const router = useRouter()
const groups = computed(() => {
  const leaves = visibleLeaves.value
  const make = (leave, detail, action, modal) => ({
    id: leave.id,
    name: employeeFor(leave.employeeId).name,
    detail: `${farmName(employeeFor(leave.employeeId).farm)} · ${detail}`,
    action,
    run: () => openModal(modal, { leave }),
  })
  return [
    {
      title: 'Overdue returns',
      icon: 'alert',
      danger: true,
      rows: leaves
        .filter(
          (l) =>
            employeeFor(l.employeeId).status === 'Overdue' &&
            movementFor(l) &&
            !movementFor(l).returnedAt
        )
        .map((l) =>
          make(l, `${daysBetween(l.end, today())} days overdue`, 'Follow up', 'followup')
        ),
    },
    {
      title: 'Departures today',
      icon: 'movement',
      rows: leaves
        .filter(
          (l) => l.approval === 'Approved' && l.start === today() && !movementFor(l)?.departedAt
        )
        .map((l) => make(l, 'Scheduled to leave today', 'Mark departed', 'departure')),
    },
    {
      title: 'Returning in the next 3 days',
      icon: 'calendar',
      rows: leaves
        .filter(
          (l) =>
            employeeFor(l.employeeId).status === 'Returning Soon' &&
            movementFor(l) &&
            !movementFor(l).returnedAt
        )
        .map((l) => make(l, `Expected ${formatDate(l.end)}`, 'Mark returned', 'return')),
    },
    {
      title: 'Pending approvals',
      icon: 'clock',
      rows: leaves
        .filter((l) => ['Pending', 'Endorsed'].includes(l.approval))
        .map((l) => make(l, `${l.type} · ${l.days} days`, 'Review', 'review')),
    },
    {
      title: 'Extension requests',
      icon: 'history',
      rows: leaves
        .filter((l) => l.extension?.status === 'Pending')
        .map((l) =>
          make(
            l,
            `Requesting return ${formatDate(l.extension.requestedEnd)}`,
            'Review',
            'extension'
          )
        ),
    },
    {
      title: 'Staffing warnings',
      icon: 'users',
      rows: allowedFarms.value
        .filter((f) => store.selectedFarm === 'all' || f.id === Number(store.selectedFarm))
        .filter(
          (f) =>
            visibleEmployees.value.filter((e) => e.farm === f.id && isOnSite(e)).length < f.minimum
        )
        .map((f) => ({
          id: `farm${f.id}`,
          name: f.name,
          detail: `Below minimum staffing of ${f.minimum}`,
          action: 'View staffing',
          run: () => {
            store.selectedFarm = f.id
            router.push('/staffing')
          },
        })),
    },
  ].filter((g) => g.rows.length)
})
const count = computed(() => groups.value.reduce((n, g) => n + g.rows.length, 0))
</script>
<template>
  <section class="card">
    <div class="card-header">
      <div>
        <h2 class="flex">
          Needs attention
          <span class="badge-count">{{ count }}</span>
        </h2>
        <p>A few things to keep your farms moving.</p>
      </div>
      <AppIcon name="bell" />
    </div>
    <div class="attention-groups">
      <div v-if="!count" class="empty-state">
        <AppIcon name="check" />
        <h3>You’re all caught up</h3>
        <p>No items need attention for this farm.</p>
      </div>
      <div v-for="group in groups" :key="group.title" class="attention-group">
        <div :class="['attention-label', { danger: group.danger }]">
          <AppIcon :name="group.icon" />
          {{ group.title }}
          <span class="badge-count">{{ group.rows.length }}</span>
        </div>
        <div v-for="row in group.rows.slice(0, 2)" :key="row.id" class="attention-row">
          <span class="avatar" :class="group.danger ? 'sand' : 'blue'">
            {{
              row.name
                .split(' ')
                .map((w) => w[0])
                .slice(0, 2)
                .join('')
            }}
          </span>
          <div class="attention-main">
            <strong>{{ row.name }}</strong>
            <small>{{ row.detail }}</small>
          </div>
          <button class="text-link" @click="row.run">
            {{ row.action }}
            <AppIcon name="chevron" />
          </button>
        </div>
        <RouterLink
          v-if="group.rows.length > 2"
          class="text-link tiny"
          :to="
            group.title === 'Pending approvals' || group.title === 'Extension requests'
              ? '/leave'
              : '/movement'
          "
        >
          View all {{ group.rows.length }}
          <AppIcon name="arrow" />
        </RouterLink>
      </div>
    </div>
    <div class="card-footer">
      <span>Updated automatically as you work</span>
      <RouterLink to="/movement" class="text-link">
        View movements
        <AppIcon name="arrow" />
      </RouterLink>
    </div>
  </section>
</template>
