<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { store, currentUser, resetDemo, toast } from '../utils/store'
import { formatDate, today } from '../utils/dateUtils'
import FarmSelector from './FarmSelector.vue'
import RoleSwitcher from './RoleSwitcher.vue'
import AppIcon from './AppIcon.vue'
import BaseButton from './BaseButton.vue'
const settingsOpen = ref(false),
  settingsEl = ref(null),
  resetConfirm = ref(false)
function outside(event) {
  if (!settingsEl.value?.contains(event.target)) {
    settingsOpen.value = false
    resetConfirm.value = false
  }
}
function escape(event) {
  if (event.key === 'Escape') settingsOpen.value = false
}
function handleReset() {
  resetDemo()
  settingsOpen.value = false
  resetConfirm.value = false
}
onMounted(() => {
  document.addEventListener('click', outside)
  document.addEventListener('keydown', escape)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', outside)
  document.removeEventListener('keydown', escape)
})
</script>
<template>
  <header class="topbar">
    <div class="topbar-left">
      <FarmSelector />
      <span class="topbar-divider" />
      <RoleSwitcher />
    </div>
    <div class="topbar-right">
      <span class="topbar-date">
        {{ formatDate(today(), { weekday: 'short', year: 'numeric' }) }}
      </span>
      <div ref="settingsEl" class="settings-wrap">
        <button
          class="icon-btn"
          aria-label="Demo settings"
          :aria-expanded="settingsOpen"
          @click="settingsOpen = !settingsOpen"
        >
          <AppIcon name="settings" />
        </button>
        <div v-if="settingsOpen" class="settings-popover">
          <h3>Demo settings</h3>
          <template v-if="store.role === 'HR'">
            <label class="field">
              <span>Leave approval</span>
              <select
                v-model="store.settings.approvalMode"
                @change="toast('Approval rule updated')"
              >
                <option value="hr_approves">HR approves</option>
                <option value="admin_approves">HR or Farm Admin approves</option>
              </select>
            </label>
            <label class="field">
              <span>Below minimum staffing</span>
              <select
                v-model="store.settings.staffingMode"
                @change="toast('Staffing rule updated')"
              >
                <option value="warning">Warn and allow</option>
                <option value="block">Block new leave</option>
              </select>
            </label>
          </template>
          <p v-else class="small muted">HR manages the suggested approval and staffing rules.</p>
          <p class="tiny muted">
            Working days exclude Sundays and sample holidays. Data resets on reload.
          </p>
          <BaseButton
            v-if="!resetConfirm"
            variant="ghost"
            icon="history"
            @click="resetConfirm = true"
          >
            Reset demo data
          </BaseButton>
          <div v-else class="mt-16">
            <p class="small">Discard changes to this demo?</p>
            <div class="flex mt-16">
              <BaseButton variant="danger" small @click="handleReset">Reset data</BaseButton>
              <BaseButton variant="ghost" small @click="resetConfirm = false">Cancel</BaseButton>
            </div>
          </div>
        </div>
      </div>
      <span class="topbar-divider" />
      <div class="user-summary">
        <span class="avatar square">{{ store.role === 'HR' ? 'CR' : 'RC' }}</span>
        <div>
          <strong>{{ currentUser }}</strong>
          <small>{{ store.role === 'HR' ? 'HR Administrator' : 'Farm Administrator' }}</small>
        </div>
      </div>
    </div>
  </header>
  <div class="prototype-banner">
    <AppIcon name="info" :size="12" />
    <span>Prototype: fictional data. Rules shown are suggested defaults.</span>
    <span class="demo-pill">Interactive demo</span>
  </div>
</template>
