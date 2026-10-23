<script setup>
import LeaveFormModal from './LeaveFormModal.vue'
defineProps({ draft: Object })
</script>
<template><LeaveFormModal :draft="draft" confirm /></template>
