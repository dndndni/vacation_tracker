<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './components/AppSidebar.vue'
import AppTopbar from './components/AppTopbar.vue'
import AppIcon from './components/AppIcon.vue'
import BaseToast from './components/BaseToast.vue'
import BaseModal from './components/BaseModal.vue'
import BaseButton from './components/BaseButton.vue'
import LeaveFormModal from './components/LeaveFormModal.vue'
import ConfirmLeaveModal from './components/ConfirmLeaveModal.vue'
import DepartureModal from './components/DepartureModal.vue'
import ReturnModal from './components/ReturnModal.vue'
import ExtensionModal from './components/ExtensionModal.vue'
import FollowUpModal from './components/FollowUpModal.vue'
import HistoryDrawer from './components/HistoryDrawer.vue'
import EmployeeDetailModal from './components/EmployeeDetailModal.vue'
import ReviewLeaveModal from './components/ReviewLeaveModal.vue'
import { store, closeModal, setAwol, employeeFor } from './utils/store'
const route = useRoute()
const components = {
  leave: LeaveFormModal,
  confirmLeave: ConfirmLeaveModal,
  departure: DepartureModal,
  return: ReturnModal,
  extension: ExtensionModal,
  followup: FollowUpModal,
  history: HistoryDrawer,
  employee: EmployeeDetailModal,
  review: ReviewLeaveModal,
}
const modalComponent = computed(() => components[store.modal?.type])
const modalProps = computed(() => {
  const value = { ...store.modal }
  delete value.type
  return value
})
</script>
<template>
  <div class="app-shell">
    <AppSidebar />
    <div class="workspace">
      <AppTopbar />
      <main class="page-container">
        <div class="breadcrumb">
          <AppIcon name="farm" :size="12" />
          <span>Workspace</span>
          <AppIcon name="chevron" :size="10" />
          <span>{{ route.meta.title }}</span>
        </div>
        <RouterView />
        <footer class="page-footer">
          <span>
            Farm HR Management
            <span class="muted">·</span>
            Taking care of the people who grow with us.
          </span>
          <span>Fictional data · For demonstration purposes</span>
        </footer>
      </main>
    </div>
    <component
      :is="modalComponent"
      v-if="modalComponent"
      :key="store.modal.type + (store.modal.leave?.id || '')"
      v-bind="modalProps"
    />
    <BaseModal
      v-if="store.modal?.type === 'awol'"
      title="Set final status to AWOL?"
      :subtitle="employeeFor(store.modal.leave.employeeId)?.name"
      @close="closeModal"
    >
      <div class="notice danger">
        <AppIcon name="alert" />
        This employee will remain off site with a final status of AWOL. This HR decision is recorded
        in the audit trail.
      </div>
      <template #footer>
        <BaseButton variant="secondary" @click="closeModal">Cancel</BaseButton>
        <BaseButton variant="danger" @click="setAwol(store.modal.leave)">Confirm AWOL</BaseButton>
      </template>
    </BaseModal>
    <BaseToast />
  </div>
</template>
