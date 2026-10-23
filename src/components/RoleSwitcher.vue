<script setup>
import { store, setRole } from '../utils/store'
</script>
<template>
  <div class="flex">
    <span class="eyebrow role-label">Demo role</span>
    <label>
      <span class="sr-only">Demo role</span>
      <select :value="store.role" aria-label="Demo role" @change="setRole($event.target.value)">
        <option>HR</option>
        <option>Farm Admin</option>
      </select>
    </label>
  </div>
</template>
