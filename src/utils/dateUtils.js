import { EXCLUDED_WEEKDAYS, HOLIDAYS } from './constants'
export function dateKey(value = new Date()) {
  const d =
    typeof value === 'string' ? new Date(value.length === 10 ? value + 'T12:00:00' : value) : value
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`
}
export const today = () => dateKey()
export function addDays(value, days) {
  const d = new Date(dateKey(value) + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return dateKey(d)
}
export function daysBetween(a, b) {
  return Math.round(
    (new Date(dateKey(b) + 'T12:00:00') - new Date(dateKey(a) + 'T12:00:00')) / 86400000
  )
}
export function dateRange(start, end) {
  const list = []
  for (let d = dateKey(start); d <= dateKey(end); d = addDays(d, 1)) list.push(d)
  return list
}
export function workingDays(start, end) {
  if (!start || !end || end < start) return 0
  return dateRange(start, end).filter(
    (d) => !EXCLUDED_WEEKDAYS.includes(new Date(d + 'T12:00:00').getDay()) && !HOLIDAYS.includes(d)
  ).length
}
export function formatDate(value, options = {}) {
  return value
    ? new Date(value.length === 10 ? value + 'T12:00:00' : value).toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
        ...options,
      })
    : '—'
}
export function formatTime(value) {
  return new Date(value).toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
export const overlaps = (a, b, c, d) => a <= d && c <= b
export const localDateTime = () => {
  const d = new Date()
  return `${dateKey(d)}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(
    2,
    '0'
  )}`
}
