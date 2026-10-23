<script setup>
import { ref, computed } from 'vue'
import BaseButton from '../components/BaseButton.vue'
import AppIcon from '../components/AppIcon.vue'
import EmployeeTimeline from '../components/EmployeeTimeline.vue'
import FilterBar from '../components/FilterBar.vue'
import { store, visibleEmployees, allowedFarms, farmName, openModal } from '../utils/store'
import { DEPARTMENTS } from '../utils/constants'
import { today, addDays, formatDate } from '../utils/dateUtils'
const start = ref(addDays(today(), -3)),
  range = ref(14),
  search = ref(''),
  department = ref(''),
  status = ref('')
const employees = computed(() =>
  visibleEmployees.value.filter(
    (e) =>
      `${e.name} ${e.id}`.toLowerCase().includes(search.value.toLowerCase()) &&
      (!department.value || e.department === department.value) &&
      (!status.value || e.status === status.value)
  )
)
function month(offset) {
  const d = new Date(start.value + 'T12:00:00')
  d.setDate(1)
  d.setMonth(d.getMonth() + offset)
  start.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}
</script>
<template>
  <div>
    <header class="page-header">
      <div>
        <h1>Leave calendar</h1>
        <p>
          A little forward planning makes all the difference. Drag to plan, review, and move leave.
        </p>
      </div>
      <BaseButton icon="plus" @click="openModal('leave')">New leave</BaseButton>
    </header>
    <div v-if="store.selectedFarm === 'all'" class="card">
      <div class="empty-state">
        <AppIcon name="calendar" />
        <h3>Choose a farm to start planning</h3>
        <p>
          Each farm has its own employee timeline and daily staffing checks. Select one below or use
          the farm selector above.
        </p>
        <div class="flex" style="flex-wrap: wrap; justify-content: center">
          <BaseButton
            v-for="farm in allowedFarms"
            :key="farm.id"
            variant="secondary"
            icon="farm"
            @click="store.selectedFarm = farm.id"
          >
            {{ farm.name }}
          </BaseButton>
        </div>
      </div>
    </div>
    <div v-else class="card">
      <div class="timeline-toolbar">
        <div class="flex">
          <h2>{{ farmName(store.selectedFarm) }}</h2>
          <span class="muted">·</span>
          <span class="small">
            {{ formatDate(start, { year: 'numeric' }) }} –
            {{ formatDate(addDays(start, range - 1)) }}
          </span>
        </div>
        <div class="flex">
          <div class="segmented" aria-label="Calendar range">
            <button
              :class="{ active: range === 14 }"
              :aria-pressed="range === 14"
              @click="range = 14"
            >
              14 days
            </button>
            <button
              :class="{ active: range === 31 }"
              :aria-pressed="range === 31"
              @click="range = 31"
            >
              31 days
            </button>
          </div>
          <button class="icon-btn" aria-label="Previous month" @click="month(-1)">
            <AppIcon name="left" />
          </button>
          <BaseButton variant="secondary" small @click="start = addDays(today(), -3)">
            Today
          </BaseButton>
          <button class="icon-btn" aria-label="Next month" @click="month(1)">
            <AppIcon name="chevron" />
          </button>
        </div>
      </div>
      <FilterBar v-model="search" :count="employees.length">
        <select v-model="department" aria-label="Filter department">
          <option value="">All departments</option>
          <option v-for="d in DEPARTMENTS" :key="d">{{ d }}</option>
        </select>
        <select v-model="status" aria-label="Filter employee status">
          <option value="">All statuses</option>
          <option
            v-for="s in [
              'On Site',
              'Scheduled',
              'On Leave',
              'Returning Soon',
              'Overdue',
              'Extended',
              'AWOL',
            ]"
            :key="s"
          >
            {{ s }}
          </option>
        </select>
      </FilterBar>
      <EmployeeTimeline
        :key="store.selectedFarm"
        :employees="employees"
        :start="start"
        :range="range"
        :farm-id="Number(store.selectedFarm)"
      />
    </div>
    <div class="insight-strip">
      <AppIcon name="info" />
      <div>
        <strong>Smart checks, before you save.</strong>
        <p>
          Leave balances, overlapping dates, and minimum staffing are checked automatically.
          Departed or completed leave stays locked to protect the record.
        </p>
      </div>
    </div>
  </div>
</template>
