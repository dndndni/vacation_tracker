<script setup>
import AppIcon from './AppIcon.vue'
defineProps({
  columns: Array,
  rows: Array,
  rowKey: { type: String, default: 'id' },
  clickable: Boolean,
  empty: { type: String, default: 'No records match your current filters.' },
})
defineEmits(['row-click'])
</script>
<template>
  <div class="table-scroll">
    <table v-if="rows.length">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key" scope="col">{{ column.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="row[rowKey]"
          :class="{ clickable }"
          :tabindex="clickable ? 0 : undefined"
          @click="clickable && $emit('row-click', row)"
          @keydown.enter="clickable && $emit('row-click', row)"
        >
          <td v-for="column in columns" :key="column.key">
            <slot :name="column.key" :row="row">{{ row[column.key] ?? '—' }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="empty-state">
      <AppIcon name="leaf" />
      <h3>All clear here</h3>
      <p>{{ empty }}</p>
    </div>
  </div>
</template>
