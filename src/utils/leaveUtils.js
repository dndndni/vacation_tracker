import { ABSENT_STATUSES, RETURNING_SOON_DAYS, OVERDUE_AFTER_DAYS } from './constants'
import { today, daysBetween, overlaps, workingDays, dateRange } from './dateUtils'
export const isOnSite = (e) => !ABSENT_STATUSES.includes(e.status)
export function deriveStatus(leave, movement) {
  if (movement?.returnedAt)
    return movement.returnedAt.slice(0, 10) > leave.end ? 'Returned Late' : 'On Site'
  if (movement?.status === 'AWOL') return 'AWOL'
  if (movement?.departedAt) {
    if (daysBetween(leave.end, today()) >= OVERDUE_AFTER_DAYS) return 'Overdue'
    if (leave.status === 'Extended') return 'Extended'
    if (daysBetween(today(), leave.end) <= RETURNING_SOON_DAYS) return 'Returning Soon'
    return 'On Leave'
  }
  return leave.approval === 'Approved' ? 'Scheduled' : 'On Site'
}
export function dailyHeadcount(data, farmId, date, proposed = null) {
  const employees = data.employees.filter((e) => e.farm === Number(farmId))
  return employees.filter((e) => {
    if (proposed?.employeeId === e.id && date >= proposed.start && date <= proposed.end)
      return false
    if (e.status === 'AWOL') return false
    return !data.leaves.some((l) => {
      if (l.employeeId !== e.id || l.id === proposed?.id || l.approval !== 'Approved') return false
      const movement = data.movements.find((m) => m.leaveId === l.id)
      if (movement?.departedAt) {
        if (date < movement.departedAt.slice(0, 10)) return false
        if (movement.returnedAt) return date < movement.returnedAt.slice(0, 10)
        if (l.end < today()) return true
        return date <= l.end
      }
      if (date <= today()) return false
      return overlaps(l.start, l.end, date, date)
    })
  }).length
}
export function leaveWarnings(data, draft) {
  const employee = data.employees.find((e) => e.id === draft.employeeId)
  if (!employee || !draft.start || !draft.end) return []
  const warnings = []
  if (draft.end < draft.start)
    return [{ type: 'invalid', message: 'End date must be on or after the start date.' }]
  const existing = data.leaves.find((l) => l.id === draft.id)
  const available =
    employee.remainingBalance +
    (existing?.approval === 'Approved' && existing.type === 'Annual Leave' ? existing.days : 0)
  if (draft.type === 'Annual Leave' && workingDays(draft.start, draft.end) > available)
    warnings.push({
      type: 'balance',
      message: 'This leave exceeds the available annual leave balance.',
    })
  if (
    data.leaves.some(
      (l) =>
        l.id !== draft.id &&
        l.employeeId === employee.id &&
        !['Revision Requested'].includes(l.approval) &&
        overlaps(l.start, l.end, draft.start, draft.end)
    )
  )
    warnings.push({
      type: 'overlap',
      message: 'These dates overlap an existing leave for this employee.',
    })
  const farm = data.farms.find((f) => f.id === employee.farm)
  if (
    dateRange(draft.start, draft.end).some(
      (d) => dailyHeadcount(data, farm.id, d, draft) < farm.minimum
    )
  )
    warnings.push({
      type: 'staffing',
      message: `${farm.name} would fall below its minimum of ${farm.minimum} on-site employees.`,
    })
  return warnings
}
