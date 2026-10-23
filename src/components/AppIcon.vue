<script setup>
defineProps({ name: String, size: { type: [Number, String], default: 19 } })
const paths = {
  dashboard: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  calendar:
    'M5 5h14a2 2 0 0 1 2 2v13H3V7a2 2 0 0 1 2-2z M7 3v4 M17 3v4 M3 10h18 M7 14h2 M12 14h2 M7 18h2',
  users:
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M16 3a4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  leaf: 'M20 3C9 1 2 8 5 15c4 8 17 3 15-12z M4 21 16 9 M10 15v-5 M10 15h5',
  movement: 'M3 7h17 M15 2l5 5-5 5 M21 17H4 M9 12l-5 5 5 5',
  chart: 'M4 3v18h17 M8 16v-4 M13 16V7 M18 16v-7',
  report: 'M5 3h9l5 5v13H5z M14 3v6h5 M9 13h6 M9 17h6',
  farm: 'M3 10 12 3l9 7v11H3z M8 21v-8h8v8 M3 10h18 M10 7h4',
  chevron: 'm9 5 7 7-7 7',
  down: 'm6 9 6 6 6-6',
  left: 'm15 5-7 7 7 7',
  plus: 'M12 5v14 M5 12h14',
  close: 'm6 6 12 12 M6 18 18 6',
  search: 'M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  check: 'm5 12 4 4L19 6',
  clock: 'M12 8v5l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  alert: 'm12 3 10 18H2z M12 9v5 M12 17h.01',
  info: 'M12 11v6 M12 7h.01 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  settings:
    'M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1z M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  download: 'M12 3v12 m-5-5 5 5 5-5 M4 16v5h16v-5',
  arrow: 'M4 12h16 m-5-5 5 5-5 5',
  history: 'M3 3v6h6 M3 9a9 9 0 1 1 0 6 M12 7v5l3 2',
  lock: 'M5 10h14v11H5z M8 10V6a4 4 0 0 1 8 0v4 M12 14v3',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8 M10 20h4',
  sun: 'M12 2v2 M12 20v2 M2 12h2 M20 12h2 M5 5l2 2 M17 17l2 2 M5 19l2-2 M17 7l2-2 M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0',
  shield: 'M12 2 3 6v6c0 6 9 10 9 10s9-4 9-10V6z m-5 10 3 3 5-6',
  mail: 'M3 5h18v14H3z m0 0 9 8 9-8',
  dots: 'M5 12h.01 M12 12h.01 M19 12h.01',
  sprout: 'M12 21V10 M12 15C4 15 2 11 3 5c7-1 10 3 9 10z M12 10c0-6 4-8 9-7 0 5-3 8-9 7',
}
</script>
<template>
  <svg
    class="icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.65"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="paths[name] || paths.info" />
  </svg>
</template>
