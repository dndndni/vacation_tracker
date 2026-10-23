<script setup>
import { pages } from '../router'
import { stats, store } from '../utils/store'
import AppIcon from './AppIcon.vue'
</script>
<template>
  <aside class="sidebar">
    <RouterLink to="/dashboard" class="brand" aria-label="Farm HR Management home">
      <span class="brand-mark"><AppIcon name="sprout" :size="36" /></span>
      <div class="brand-copy">
        <div class="brand-title">FARM HR</div>
        <div class="brand-subtitle">MANAGEMENT</div>
      </div>
    </RouterLink>
    <div class="nav-label">WORKSPACE</div>
    <nav aria-label="Main navigation">
      <RouterLink
        v-for="page in pages"
        :key="page.path"
        :to="page.path"
        class="nav-link"
        :title="page.meta.title"
      >
        <AppIcon :name="page.meta.icon" />
        <span class="nav-text">{{ page.meta.title }}</span>
        <span v-if="page.name === 'leave' && stats.pending" class="nav-count">
          {{ stats.pending }}
        </span>
        <span v-if="page.name === 'movement' && stats.overdue" class="nav-count alert">
          {{ stats.overdue }}
        </span>
      </RouterLink>
    </nav>
    <div class="sidebar-bottom">
      <div class="sidebar-note">
        <AppIcon name="sprout" />
        <strong>People first. Farms forward.</strong>
        A little less admin.
        <br />
        More room to grow.
      </div>
      <div class="sidebar-footer">
        <span class="connection-dot" />
        Frontend prototype
        <span style="margin-left: auto">v1.0</span>
      </div>
      <div class="sr-only">Current role: {{ store.role }}</div>
    </div>
  </aside>
</template>
