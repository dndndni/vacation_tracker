<script setup>
import { computed } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import StatusBadge from './StatusBadge.vue'
import { store, farmName, closeModal, openModal } from '../utils/store'
import { formatDate, formatTime } from '../utils/dateUtils'
const props = defineProps({ employee: Object })
const leaves = computed(() => store.leaves.filter((l) => l.employeeId === props.employee.id))
const movements = computed(() => store.movements.filter((m) => m.employeeId === props.employee.id))
const history = computed(() =>
  store.history
    .filter((h) => h.employeeId === props.employee.id)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
)
</script>
<template>
  <BaseModal
    title="Employee profile"
    subtitle="Maintained by HR and Farm Admin · No employee login"
    wide
    @close="closeModal"
  >
    <div class="profile-header">
      <span class="avatar">
        {{
          employee.name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
        }}
      </span>
      <div>
        <h2>{{ employee.name }}</h2>
        <p class="small muted">{{ employee.id }} · {{ employee.position }}</p>
      </div>
      <StatusBadge :status="employee.status" />
    </div>
    <dl class="profile-grid">
      <div>
        <dt>Farm</dt>
        <dd>{{ farmName(employee.farm) }}</dd>
      </div>
      <div>
        <dt>Department</dt>
        <dd>{{ employee.department }}</dd>
      </div>
      <div>
        <dt>Annual entitlement</dt>
        <dd>{{ employee.entitlement }} days</dd>
      </div>
      <div>
        <dt>Remaining annual balance</dt>
        <dd>{{ employee.remainingBalance }} days · {{ employee.usedDays }} used</dd>
      </div>
    </dl>
    <hr />
    <h3 class="mb-16">Leave records</h3>
    <div v-if="!leaves.length" class="small muted">No leave records yet.</div>
    <div v-for="leave in leaves" :key="leave.id" class="activity-row">
      <div>
        <p>{{ leave.type }} · {{ formatDate(leave.start) }} – {{ formatDate(leave.end) }}</p>
        <small>{{ leave.days }} working days</small>
      </div>
      <StatusBadge :status="leave.approval" />
      <button class="text-link" @click="openModal('history', { leave })">History</button>
    </div>
    <hr />
    <h3 class="mb-16">Movement history</h3>
    <div v-if="!movements.length" class="small muted">No movements recorded yet.</div>
    <div v-for="movement in movements" :key="movement.id" class="activity-row">
      <div>
        <p>Departed {{ formatTime(movement.departedAt) }}</p>
        <small>
          {{
            movement.returnedAt
              ? `Returned ${formatTime(movement.returnedAt)}`
              : 'Return not yet recorded'
          }}
        </small>
        <span v-if="movement.recordedLate" class="recorded-late">Recorded late</span>
      </div>
    </div>
    <hr />
    <h3 class="mb-16">Recent audit trail</h3>
    <div v-for="entry in history.slice(0, 5)" :key="entry.id" class="activity-row">
      <div>
        <p>{{ entry.action }}</p>
        <small>{{ entry.actor }} · {{ formatTime(entry.timestamp) }}</small>
        <p v-if="entry.oldValues?.end" class="tiny muted">
          Return: {{ formatDate(entry.oldValues.end) }} → {{ formatDate(entry.newValues?.end) }}
        </p>
      </div>
    </div>
    <template #footer>
      <BaseButton variant="secondary" icon="history" @click="openModal('history', { employee })">
        Full audit trail
      </BaseButton>
      <BaseButton @click="openModal('leave', { draft: { employeeId: employee.id } })">
        Plan leave
      </BaseButton>
    </template>
  </BaseModal>
</template>
