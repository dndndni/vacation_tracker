<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import AppIcon from './AppIcon.vue'
import StatusBadge from './StatusBadge.vue'
import { store, openModal, movementFor } from '../utils/store'
import { addDays, dateRange, daysBetween, today, formatDate } from '../utils/dateUtils'
import { dailyHeadcount } from '../utils/leaveUtils'
import { STATUSES } from '../utils/constants'
const props = defineProps({ employees: Array, start: String, range: Number, farmId: Number })
const dates = computed(() => dateRange(props.start, addDays(props.start, props.range - 1)))
const dayWidth = computed(() => (props.range === 14 ? 65 : 42))
const gridStyle = computed(() => ({
  gridTemplateColumns: `210px repeat(${props.range}, ${dayWidth.value}px)`,
}))
const farm = computed(() => store.farms.find((f) => f.id === props.farmId))
const counts = computed(() => dates.value.map((d) => dailyHeadcount(store, props.farmId, d)))
const drag = ref(null)
const rowLeaves = computed(() =>
  Object.fromEntries(
    props.employees.map((e) => [
      e.id,
      store.leaves.filter(
        (l) =>
          l.employeeId === e.id &&
          l.approval !== 'Revision Requested' &&
          l.start <= dates.value[dates.value.length - 1] &&
          l.end >= props.start
      ),
    ])
  )
)
function barAt(employee, date) {
  return (rowLeaves.value[employee.id] || []).filter(
    (l) => (l.start < props.start ? props.start : l.start) === date
  )
}
function locked(leave) {
  return (
    !!movementFor(leave)?.departedAt ||
    leave.start < today() ||
    ['AWOL', 'Completed'].includes(leave.status)
  )
}
function barWidth(leave) {
  return (
    Math.max(
      1,
      daysBetween(
        leave.start < props.start ? props.start : leave.start,
        leave.end > dates.value[dates.value.length - 1]
          ? dates.value[dates.value.length - 1]
          : leave.end
      ) + 1
    ) *
      dayWidth.value -
    5
  )
}
function leaveStatus(leave) {
  return ['Pending', 'Endorsed'].includes(leave.approval)
    ? 'Pending'
    : movementFor(leave)?.returnedAt
    ? 'Completed'
    : leave.status
}
function tooltip(employee, leave) {
  return `${employee.name} · ${leave.type}\n${formatDate(leave.start)} – ${formatDate(
    leave.end
  )} · ${leaveStatus(leave)}\n${
    locked(leave)
      ? '🔒 Locked: departure or completion already recorded'
      : 'Drag to move · Dates and history are retained'
  }`
}
function begin(employee, date, event) {
  if (event.button !== 0) return
  drag.value = { employeeId: employee.id, anchor: date, current: date, leave: null }
}
function beginMove(employee, leave, date, event) {
  event.stopPropagation()
  if (event.button !== 0) return
  if (locked(leave)) {
    openModal('history', { leave })
    return
  }
  drag.value = { employeeId: employee.id, anchor: date, current: date, leave }
}
function enter(employee, date) {
  if (drag.value?.employeeId === employee.id) drag.value.current = date
}
function movePointer(event) {
  if (!drag.value) return
  const grid = document.querySelector('.timeline-grid')
  if (!grid) return
  const index = Math.max(
    0,
    Math.min(
      props.range - 1,
      Math.floor((event.clientX - grid.getBoundingClientRect().left - 210) / dayWidth.value)
    )
  )
  drag.value.current = dates.value[index]
}
function selected(employee, date) {
  const d = drag.value
  if (!d || d.employeeId !== employee.id) return false
  if (d.leave) {
    const offset = daysBetween(d.anchor, d.current)
    return date >= addDays(d.leave.start, offset) && date <= addDays(d.leave.end, offset)
  }
  return (
    date >= (d.anchor < d.current ? d.anchor : d.current) &&
    date <= (d.anchor > d.current ? d.anchor : d.current)
  )
}
function finish() {
  const d = drag.value
  if (!d) return
  drag.value = null
  if (d.leave) {
    const offset = daysBetween(d.anchor, d.current)
    if (!offset) return
    openModal('confirmLeave', {
      draft: {
        ...d.leave,
        start: addDays(d.leave.start, offset),
        end: addDays(d.leave.end, offset),
      },
    })
  } else
    openModal('confirmLeave', {
      draft: {
        employeeId: d.employeeId,
        start: d.anchor < d.current ? d.anchor : d.current,
        end: d.anchor > d.current ? d.anchor : d.current,
        type: 'Annual Leave',
      },
    })
}
function cancel(event) {
  if (event.key === 'Escape') drag.value = null
}
onMounted(() => {
  document.addEventListener('mouseup', finish)
  document.addEventListener('mousemove', movePointer)
  document.addEventListener('keydown', cancel)
})
onBeforeUnmount(() => {
  document.removeEventListener('mouseup', finish)
  document.removeEventListener('mousemove', movePointer)
  document.removeEventListener('keydown', cancel)
})
</script>
<template>
  <div>
    <div class="timeline-scroll">
      <div class="timeline-grid" :style="gridStyle">
        <div class="timeline-name heading">
          EMPLOYEE
          <span class="badge-count">{{ employees.length }}</span>
        </div>
        <div
          v-for="date in dates"
          :key="'header' + date"
          :class="['timeline-date', { current: date === today() }]"
        >
          <small>
            {{ formatDate(date, { weekday: 'short', day: undefined, month: undefined }) }}
          </small>
          {{ Number(date.slice(-2)) }}
        </div>
        <div class="timeline-name staffing-name">
          <AppIcon name="users" :size="12" />
          On site · min. {{ farm.minimum }}
        </div>
        <div
          v-for="(date, index) in dates"
          :key="'staff' + date"
          :class="['staffing-cell', { low: counts[index] < farm.minimum }]"
          :title="`${date}: ${counts[index]} on site, minimum ${farm.minimum}`"
        >
          {{ counts[index] }}
        </div>
        <template v-for="employee in employees" :key="employee.id">
          <button class="timeline-name" @click="openModal('employee', { employee })">
            <span class="avatar">
              {{
                employee.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
              }}
            </span>
            <span>
              <strong>{{ employee.name }}</strong>
              <small>{{ employee.department }}</small>
            </span>
          </button>
          <div
            v-for="(date, di) in dates"
            :key="employee.id + date"
            :class="[
              'timeline-cell',
              {
                weekend: [0, 6].includes(new Date(date + 'T12:00:00').getDay()),
                'today-cell': date === today(),
                'selected-cell': selected(employee, date),
              },
            ]"
            :data-employee="employee.id"
            :data-date="date"
            :tabindex="di === 0 ? 0 : undefined"
            :aria-label="`Plan leave for ${employee.name} on ${formatDate(date)}`"
            @mousedown.prevent="begin(employee, date, $event)"
            @mouseenter="enter(employee, date)"
            @keydown.enter="
              openModal('confirmLeave', {
                draft: { employeeId: employee.id, start: date, end: date },
              })
            "
          >
            <div
              v-for="leave in barAt(employee, date)"
              :key="leave.id"
              :title="tooltip(employee, leave)"
              :aria-label="tooltip(employee, leave)"
              :class="[
                'timeline-bar',
                'status-' + (STATUSES[leaveStatus(leave)] || 'scheduled'),
                { locked: locked(leave), extension: leave.status === 'Extended' },
              ]"
              :style="{ width: barWidth(leave) + 'px' }"
              @mousedown.prevent="beginMove(employee, leave, date, $event)"
            >
              <AppIcon v-if="locked(leave)" name="lock" />
              <span>{{ leave.type }} · {{ leaveStatus(leave) }}</span>
              <span
                v-if="leave.end <= dates[dates.length - 1]"
                class="return-marker"
                title="Expected return day"
              >
                ↩
              </span>
            </div>
          </div>
        </template>
      </div>
      <div v-if="!employees.length" class="empty-state">
        <AppIcon name="users" />
        <h3>No employees match</h3>
        <p>Try another name, department, or status.</p>
      </div>
    </div>
    <div class="timeline-legend">
      <StatusBadge
        v-for="status in [
          'Scheduled',
          'On Leave',
          'Returning Soon',
          'Overdue',
          'Extended',
          'Pending',
        ]"
        :key="status"
        :status="status"
      />
      <span class="flex">
        <AppIcon name="lock" :size="12" />
        Movement recorded · locked
      </span>
      <span>↩ Expected return</span>
    </div>
    <p class="timeline-help">
      Drag across an empty row to plan leave. Drag a future leave to move it. Click a locked leave
      to see its history. Keyboard: focus a row’s first date and press Enter to plan.
    </p>
  </div>
</template>
