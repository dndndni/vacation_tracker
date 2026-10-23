<script setup>
import { store, allowedFarms } from '../utils/store'
import AppIcon from './AppIcon.vue'
</script>
<template>
  <label class="farm-control">
    <AppIcon name="farm" />
    <span class="sr-only">Selected farm</span>
    <select v-model="store.selectedFarm" aria-label="Selected farm">
      <option v-if="store.role === 'HR'" value="all">All Farms</option>
      <option v-for="farm in allowedFarms" :key="farm.id" :value="farm.id">{{ farm.name }}</option>
    </select>
  </label>
</template>
