<script setup>
import { ref } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import { closeModal, employeeFor, recordFollowUp } from '../utils/store'
import { today, addDays } from '../utils/dateUtils'
const props = defineProps({ leave: Object })
const reason = ref('Called, will return on'),
  note = ref(''),
  promisedDate = ref(addDays(today(), 1))
</script>
<template>
  <BaseModal
    title="Record a follow-up"
    :subtitle="employeeFor(leave.employeeId).name"
    @close="closeModal"
  >
    <form
      id="followup-form"
      class="modal-form"
      @submit.prevent="
        recordFollowUp(
          props.leave,
          reason,
          note,
          reason === 'Called, will return on' ? promisedDate : ''
        )
      "
    >
      <label class="field">
        <span>Contact outcome</span>
        <select v-model="reason">
          <option>Called, will return on</option>
          <option>No answer</option>
          <option>Family emergency</option>
          <option>Awaiting supporting documents</option>
        </select>
      </label>
      <label v-if="reason === 'Called, will return on'" class="field">
        <span>Promised return date</span>
        <input v-model="promisedDate" class="input" type="date" :min="today()" required />
      </label>
      <label class="field">
        <span>
          Note
          <span class="muted">(optional)</span>
        </span>
        <textarea v-model="note" rows="3" placeholder="Anything HR should know?" />
      </label>
      <p class="small muted">
        Your name, role, and the contact time are recorded automatically. A promised date does not
        extend approved leave.
      </p>
    </form>
    <template #footer>
      <BaseButton variant="secondary" @click="closeModal">Cancel</BaseButton>
      <BaseButton form="followup-form" type="submit" icon="check">Save follow-up</BaseButton>
    </template>
  </BaseModal>
</template>
