import { reactive, computed } from 'vue'
import { generateMockData } from './mockData'
import { APPROVAL_MODE, STAFFING_MODE, ASSIGNED_FARMS } from './constants'
import { today, workingDays, daysBetween } from './dateUtils'
import { isOnSite, deriveStatus, leaveWarnings } from './leaveUtils'

export const store = reactive({
  ...generateMockData(),
  role: 'HR',
  selectedFarm: 'all',
  settings: { approvalMode: APPROVAL_MODE, staffingMode: STAFFING_MODE },
  modal: null,
  toasts: [],
})
export const allowedFarms = computed(() =>
  store.farms.filter((f) => store.role === 'HR' || ASSIGNED_FARMS.includes(f.id))
)
export const visibleEmployees = computed(() =>
  store.employees.filter(
    (e) =>
      allowedFarms.value.some((f) => f.id === e.farm) &&
      (store.selectedFarm === 'all' || e.farm === Number(store.selectedFarm))
  )
)
export const visibleLeaves = computed(() =>
  store.leaves.filter((l) => visibleEmployees.value.some((e) => e.id === l.employeeId))
)
export const canApprove = computed(
  () => store.role === 'HR' || store.settings.approvalMode === 'admin_approves'
)
export const currentUser = computed(() => (store.role === 'HR' ? 'Camille Reyes' : 'Rafael Cruz'))
export const stats = computed(() => ({
  employees: visibleEmployees.value.length,
  onsite: visibleEmployees.value.filter(isOnSite).length,
  leave: visibleEmployees.value.filter((e) => e.status === 'On Leave').length,
  returning: visibleEmployees.value.filter((e) => e.status === 'Returning Soon').length,
  overdue: visibleEmployees.value.filter((e) => e.status === 'Overdue').length,
  pending: visibleLeaves.value.filter((l) => ['Pending', 'Endorsed'].includes(l.approval)).length,
}))
export function setRole(role) {
  store.role = role
  if (!allowedFarms.value.some((f) => f.id === Number(store.selectedFarm)))
    store.selectedFarm = role === 'HR' ? 'all' : ASSIGNED_FARMS[0]
  toast(`Switched to ${role}`)
}
export const employeeFor = (id) => store.employees.find((e) => e.id === id)
export const movementFor = (leave) => store.movements.find((m) => m.leaveId === leave?.id)
export const farmName = (id) => store.farms.find((f) => f.id === Number(id))?.name || 'All farms'
export function toast(message, type = 'success') {
  const id = Date.now() + Math.random()
  store.toasts.push({ id, message, type })
  setTimeout(() => {
    store.toasts = store.toasts.filter((t) => t.id !== id)
  }, 4800)
}
export const openModal = (type, payload = {}) => {
  store.modal = { type, ...payload }
}
export const closeModal = () => {
  store.modal = null
}
export function audit(leave, action, oldValues, newValues, recordedLate = false) {
  store.history.unshift({
    id: `H${Date.now()}-${Math.random()}`,
    leaveId: leave?.id,
    employeeId: leave?.employeeId,
    actor: `${currentUser.value} · ${store.role}`,
    action,
    timestamp: new Date().toISOString(),
    oldValues,
    newValues,
    recordedLate,
  })
}
function authorized(leave) {
  return !!leave && visibleEmployees.value.some((e) => e.id === leave.employeeId)
}
function sync(leave) {
  const employee = employeeFor(leave.employeeId)
  const records = store.leaves.filter((l) => l.employeeId === employee.id)
  for (const record of records) {
    const movement = movementFor(record)
    if (movement?.returnedAt) record.status = 'Completed'
    else if (movement?.departedAt) {
      record.status = deriveStatus(record, movement)
      movement.status = record.status
    } else record.status = record.approval === 'Approved' ? 'Scheduled' : record.approval
  }
  const active = records.find((l) => movementFor(l)?.departedAt && !movementFor(l)?.returnedAt)
  const scheduled = records.find(
    (l) => l.approval === 'Approved' && !movementFor(l)?.departedAt && l.end >= today()
  )
  const lastReturned = records
    .filter((l) => movementFor(l)?.returnedAt)
    .sort((a, b) => movementFor(b).returnedAt.localeCompare(movementFor(a).returnedAt))[0]
  const current = active || scheduled || lastReturned
  employee.status = current ? deriveStatus(current, movementFor(current)) : 'On Site'
  employee.currentMovement = current ? movementFor(current)?.id || null : null
}
function blocked(draft) {
  if (
    !draft.start ||
    !draft.end ||
    draft.end < draft.start ||
    daysBetween(draft.start, draft.end) > 366
  ) {
    toast('Choose valid leave dates within one year.', 'error')
    return true
  }
  const warning = leaveWarnings(store, draft).find(
    (w) =>
      ['invalid', 'overlap'].includes(w.type) ||
      (w.type === 'staffing' && store.settings.staffingMode === 'block')
  )
  if (warning) {
    toast(warning.message, 'error')
    return true
  }
  return false
}
function reserveBalance(leave, direction = -1) {
  if (leave.type === 'Annual Leave') {
    const e = employeeFor(leave.employeeId)
    e.usedDays -= direction * leave.days
    e.remainingBalance += direction * leave.days
  }
}
export function saveLeave(draft) {
  if (!visibleEmployees.value.some((e) => e.id === draft.employeeId)) return false
  const existing = store.leaves.find((l) => l.id === draft.id)
  if (existing) {
    if (movementFor(existing)?.departedAt || existing.start < today()) {
      toast('This leave is locked.', 'error')
      return false
    }
    if (blocked(draft)) return false
    const old = { start: existing.start, end: existing.end, type: existing.type }
    if (existing.approval === 'Approved') reserveBalance(existing, 1)
    Object.assign(existing, {
      start: draft.start,
      end: draft.end,
      type: draft.type || existing.type,
      days: workingDays(draft.start, draft.end),
    })
    if (existing.approval === 'Approved') reserveBalance(existing)
    audit(existing, 'Leave rescheduled', old, {
      start: existing.start,
      end: existing.end,
      type: existing.type,
    })
    sync(existing)
  } else {
    if (blocked(draft)) return false
    const approval = canApprove.value ? 'Approved' : 'Pending'
    const leave = {
      ...draft,
      id: `L${Date.now()}`,
      approval,
      status: approval === 'Approved' ? 'Scheduled' : 'Pending',
      originalEnd: draft.end,
      days: workingDays(draft.start, draft.end),
      extension: null,
      endorsed: false,
    }
    store.leaves.unshift(leave)
    if (approval === 'Approved') reserveBalance(leave)
    audit(leave, 'Leave created', null, { start: leave.start, end: leave.end, approval })
    sync(leave)
  }
  toast(`Leave saved for ${employeeFor(draft.employeeId).name}`)
  closeModal()
  return true
}
export function approveLeave(leave) {
  if (!authorized(leave) || !['Pending', 'Endorsed'].includes(leave.approval)) return
  if (blocked(leave)) return
  if (!canApprove.value) {
    leave.endorsed = true
    leave.approval = 'Endorsed'
    audit(leave, 'Leave endorsed', { approval: 'Pending' }, { approval: 'Endorsed' })
    toast('Leave endorsed for HR review')
    return
  }
  const old = leave.approval
  leave.approval = 'Approved'
  leave.status = 'Scheduled'
  reserveBalance(leave)
  audit(leave, 'Leave approved', { approval: old }, { approval: 'Approved' })
  sync(leave)
  toast(`Leave approved for ${employeeFor(leave.employeeId).name}`)
}
export function reviseLeave(leave, note) {
  if (!canApprove.value || !authorized(leave)) return
  const old = leave.approval
  leave.approval = 'Revision Requested'
  leave.note = note
  audit(leave, 'Returned for revision', { approval: old }, { approval: leave.approval, note })
  toast('Leave returned for revision')
  closeModal()
}
export function recordDeparture(leave, actual) {
  if (!authorized(leave) || leave.approval !== 'Approved' || movementFor(leave)?.departedAt) return
  if (
    store.movements.some(
      (movement) =>
        movement.employeeId === leave.employeeId && movement.departedAt && !movement.returnedAt
    )
  ) {
    toast('This employee is already away. Record their return before another departure.', 'error')
    return
  }
  const recordedLate = actual.slice(0, 10) < today()
  store.movements.push({
    id: `M${Date.now()}`,
    leaveId: leave.id,
    employeeId: leave.employeeId,
    departedAt: actual,
    returnedAt: null,
    status: 'On Leave',
    recordedLate,
  })
  audit(
    leave,
    'Departure recorded',
    { status: 'Scheduled' },
    { actualDeparture: actual },
    recordedLate
  )
  sync(leave)
  toast(`Departure recorded for ${employeeFor(leave.employeeId).name}`)
  closeModal()
}
export function recordReturn(leave, actual) {
  if (!authorized(leave)) return
  const movement = movementFor(leave)
  if (!movement) return
  const old = employeeFor(leave.employeeId).status
  movement.returnedAt = actual
  movement.recordedLate = movement.recordedLate || actual.slice(0, 10) < today()
  movement.status = actual.slice(0, 10) > leave.end ? 'Returned Late' : 'On Site'
  leave.status = 'Completed'
  audit(
    leave,
    'Return recorded',
    { status: old },
    { actualReturn: actual, status: movement.status },
    actual.slice(0, 10) < today()
  )
  sync(leave)
  toast(`Return recorded for ${employeeFor(leave.employeeId).name}`)
  closeModal()
}
export function requestExtension(leave, requestedEnd, reason) {
  if (!authorized(leave)) return
  leave.extension = { originalEnd: leave.end, requestedEnd, reason, status: 'Pending' }
  audit(leave, 'Extension requested', { end: leave.end }, { requestedEnd, reason })
  toast('Extension sent for approval. Current return date retained.')
  closeModal()
}
export function approveExtension(leave) {
  if (!canApprove.value || !authorized(leave) || leave.extension?.status !== 'Pending') return
  if (blocked({ ...leave, end: leave.extension.requestedEnd })) return
  const oldEnd = leave.end
  if (leave.approval === 'Approved') reserveBalance(leave, 1)
  leave.end = leave.extension.requestedEnd
  leave.days = workingDays(leave.start, leave.end)
  leave.extension.status = 'Approved'
  leave.status = 'Extended'
  if (leave.approval === 'Approved') reserveBalance(leave)
  const movement = movementFor(leave)
  if (movement) movement.status = 'Extended'
  audit(leave, 'Extension approved', { end: oldEnd }, { end: leave.end })
  sync(leave)
  toast('Extension approved; expected return updated')
  closeModal()
}
export function recordFollowUp(leave, reason, note, promisedDate) {
  if (!authorized(leave)) return
  const movement = movementFor(leave)
  if (!movement) return
  const old = movement.lastFollowUp
  movement.lastFollowUp = new Date().toISOString()
  movement.followUpNote = `${reason}${promisedDate ? ` · ${promisedDate}` : ''}${
    note ? ` · ${note}` : ''
  }`
  audit(leave, 'Follow-up recorded', { lastFollowUp: old }, { reason, note, promisedDate })
  toast(`Follow-up recorded for ${employeeFor(leave.employeeId).name}`)
  closeModal()
}
export function setAwol(leave) {
  if (store.role !== 'HR' || !authorized(leave)) return
  const old = employeeFor(leave.employeeId).status
  const m = movementFor(leave)
  if (!m) return
  m.status = 'AWOL'
  leave.status = 'AWOL'
  audit(leave, 'Final status set to AWOL', { status: old }, { status: 'AWOL' })
  sync(leave)
  toast('Final status updated to AWOL')
  closeModal()
}
export function resetDemo() {
  Object.assign(store, generateMockData())
  store.modal = null
  toast('Demo data reset')
}
