<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '../components/AppIcon.vue'
import BaseButton from '../components/BaseButton.vue'
import { store, allowedFarms, openModal } from '../utils/store'
import { isOnSite, dailyHeadcount } from '../utils/leaveUtils'
import { today, addDays, formatDate } from '../utils/dateUtils'
import { exportCsv } from '../utils/exportUtils'
const router = useRouter()
const dates = Array.from({ length: 7 }, (_, i) => addDays(today(), i))
const rows = computed(() =>
  allowedFarms.value
    .filter((f) => store.selectedFarm === 'all' || f.id === Number(store.selectedFarm))
    .map((f) => {
      const employees = store.employees.filter((e) => e.farm === f.id),
        onsite = employees.filter(isOnSite).length,
        days = dates.map((date) => ({ date, count: dailyHeadcount(store, f.id, date) }))
      return {
        ...f,
        total: employees.length,
        onsite,
        away: employees.length - onsite,
        percent: Math.round((onsite / employees.length) * 100),
        days,
        warning: onsite < f.minimum || days.some((d) => d.count < f.minimum),
      }
    })
)
function download() {
  exportCsv(
    rows.value.flatMap((f) =>
      f.days.map((d) => ({
        Farm: f.name,
        Date: d.date,
        'On site': d.count,
        Minimum: f.minimum,
        Total: f.total,
        Warning: d.count < f.minimum ? 'Below minimum' : 'Healthy',
      }))
    ),
    'staffing-forecast.csv'
  )
}
function plan(farm) {
  store.selectedFarm = farm.id
  router.push('/calendar')
}
</script>
<template>
  <div>
    <header class="page-header">
      <div>
        <h1>Staffing overview</h1>
        <p>Healthy teams, steady operations. See today’s availability and the week ahead.</p>
      </div>
      <div class="header-actions">
        <BaseButton variant="secondary" icon="download" @click="download">
          Export staffing
        </BaseButton>
        <BaseButton icon="plus" @click="openModal('leave')">Plan leave</BaseButton>
      </div>
    </header>
    <div class="three-column">
      <section v-for="farm in rows" :key="farm.id" class="card">
        <div class="card-header">
          <div>
            <h2 class="flex">
              <AppIcon name="farm" />
              {{ farm.name }}
            </h2>
            <p>{{ farm.location }}</p>
          </div>
          <span v-if="farm.warning" class="warning-badge">
            <AppIcon name="alert" />
            Staffing warning
          </span>
          <span v-else class="status-badge status-onsite">Healthy</span>
        </div>
        <div class="card-body">
          <div class="staffing-metrics">
            <div>
              <strong>{{ farm.total }}</strong>
              <span>Total employees</span>
            </div>
            <div>
              <strong>{{ farm.onsite }}</strong>
              <span>On site today</span>
            </div>
            <div>
              <strong>{{ farm.away }}</strong>
              <span>On leave / away</span>
            </div>
          </div>
          <div class="progress-track">
            <div
              :class="['progress-fill', { warning: farm.onsite < farm.minimum }]"
              :style="{ width: farm.percent + '%' }"
            />
          </div>
          <div class="staffing-caption">
            <span>{{ farm.percent }}% availability</span>
            <span class="muted">Minimum: {{ farm.minimum }}</span>
          </div>
          <div class="eyebrow mt-24">Next 7 days · On-site headcount</div>
          <div class="mini-chart" :aria-label="`${farm.name} seven-day staffing forecast`">
            <div
              v-for="day in farm.days"
              :key="day.date"
              class="mini-chart-column"
              :title="`${formatDate(day.date)}: ${day.count} on site, minimum ${farm.minimum}`"
            >
              <span>{{ day.count }}</span>
              <div
                :class="['mini-chart-bar', { warning: day.count < farm.minimum }]"
                :style="{ height: (day.count / farm.total) * 60 + 'px' }"
              />
              <span>
                {{ formatDate(day.date, { weekday: 'short', month: undefined, day: undefined }) }}
              </span>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <span>
            {{
              farm.warning
                ? 'Review planned absences before scheduling.'
                : 'Your farm is in a good place.'
            }}
          </span>
          <button class="text-link" @click="plan(farm)">
            Plan leave
            <AppIcon name="arrow" />
          </button>
        </div>
      </section>
    </div>
    <div class="insight-strip">
      <AppIcon name="users" />
      <div>
        <strong>Staffing warnings help you plan ahead.</strong>
        <p>
          The forecast uses approved leave dates and recorded returns. Suggested minimums are set at
          about 80% of each team. HR can choose to warn or block in demo settings.
        </p>
      </div>
    </div>
  </div>
</template>
