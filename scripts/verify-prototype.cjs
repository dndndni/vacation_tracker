/* Run with node scripts/verify-prototype.cjs. Uses the existing Babel toolchain. */
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const babel = require('@babel/core')
const cache = new Map()
function load(file) {
  const filename = path.resolve(__dirname, '..', 'src', 'utils', file + '.js')
  if (cache.has(filename)) return cache.get(filename).exports
  const module = { exports: {} }
  cache.set(filename, module)
  const source = babel.transformSync(fs.readFileSync(filename, 'utf8'), {
    configFile: false,
    babelrc: false,
    plugins: ['@babel/plugin-transform-modules-commonjs'],
  }).code
  const run = vm.runInThisContext(`(function(require,module,exports){${source}\n})`, { filename })
  run(
    (specifier) =>
      specifier.startsWith('.') ? load(path.basename(specifier, '.js')) : require(specifier),
    module,
    module.exports
  )
  return module.exports
}
const dates = load('dateUtils'),
  rules = load('leaveUtils'),
  data = load('mockData'),
  app = load('store')
const { store, stats, visibleEmployees, visibleLeaves, allowedFarms } = app
function reset() {
  app.resetDemo()
  store.role = 'HR'
  store.selectedFarm = 'all'
  store.settings.approvalMode = 'hr_approves'
  store.settings.staffingMode = 'warning'
}
function test(name, action) {
  reset()
  action()
  console.log('PASS', name)
}
test('Seeded data, exact counts, balances, and farm availability', () => {
  assert.deepEqual(data.generateMockData(), data.generateMockData())
  assert.equal(stats.value.employees, 451)
  assert.equal(stats.value.leave, 43)
  assert.equal(stats.value.returning, 12)
  assert.equal(stats.value.overdue, 5)
  assert.equal(stats.value.pending, 4)
  assert.equal(store.employees.filter((e) => e.status === 'Extended').length, 2)
  assert.equal(store.employees.filter((e) => e.status === 'Returned Late').length, 2)
  assert.equal(store.employees.filter((e) => e.status === 'AWOL').length, 1)
  assert.equal(store.leaves.filter((l) => l.extension?.status === 'Pending').length, 3)
  for (const e of store.employees) {
    assert.equal(e.entitlement, e.usedDays + e.remainingBalance)
    assert(e.remainingBalance >= 0)
  }
  assert.equal(store.employees.filter((e) => e.farm === 2 && rules.isOnSite(e)).length, 39)
  assert.equal(store.employees.filter((e) => e.farm === 4 && rules.isOnSite(e)).length, 45)
  assert(store.history.some((h) => h.recordedLate))
  assert(
    store.history.some(
      (h) => h.action === 'Extension approved' && h.oldValues.end !== h.newValues.end
    )
  )
  assert(store.history.every((h) => h.timestamp.slice(0, 10) <= dates.today()))
  for (const f of store.farms)
    assert.equal(
      rules.dailyHeadcount(store, f.id, dates.today()),
      store.employees.filter((e) => e.farm === f.id && rules.isOnSite(e)).length
    )
})
test('Farm Admin sees only assigned farms and cannot approve or set AWOL', () => {
  app.setRole('Farm Admin')
  assert.deepEqual(
    allowedFarms.value.map((f) => f.id),
    [2, 3]
  )
  assert.equal(store.selectedFarm, 2)
  assert(visibleEmployees.value.every((e) => e.farm === 2))
  const leave = visibleLeaves.value.find((l) => l.approval === 'Pending')
  app.approveLeave(leave)
  assert.equal(leave.approval, 'Endorsed')
  const overdue = visibleLeaves.value.find(
    (l) => app.employeeFor(l.employeeId).status === 'Overdue'
  )
  if (overdue) {
    app.setAwol(overdue)
    assert.equal(app.employeeFor(overdue.employeeId).status, 'Overdue')
  }
  store.settings.approvalMode = 'admin_approves'
  app.approveLeave(leave)
  assert.equal(leave.approval, 'Approved')
})
test('New leave reserves balance; depart and return update counts and history', () => {
  const employee = store.employees.find(
    (e) => e.status === 'On Site' && !store.leaves.some((l) => l.employeeId === e.id)
  )
  const before = employee.remainingBalance,
    onsite = stats.value.onsite
  const draft = {
    employeeId: employee.id,
    type: 'Annual Leave',
    start: dates.today(),
    end: dates.addDays(dates.today(), 2),
  }
  assert.equal(app.saveLeave(draft), true)
  const leave = store.leaves[0]
  assert.equal(leave.approval, 'Approved')
  assert.equal(employee.remainingBalance, before - leave.days)
  app.recordDeparture(leave, dates.localDateTime())
  assert.equal(employee.status, 'Returning Soon')
  assert.equal(stats.value.onsite, onsite - 1)
  app.recordReturn(leave, dates.localDateTime())
  assert.equal(employee.status, 'On Site')
  assert.equal(stats.value.onsite, onsite)
  assert.equal(store.history.filter((h) => h.leaveId === leave.id).length, 3)
})
test('Extension date changes only after approval and keeps original dates', () => {
  const leave = store.leaves.find((l) => app.employeeFor(l.employeeId).status === 'Overdue'),
    oldEnd = leave.end,
    newEnd = dates.addDays(dates.today(), 7)
  app.requestExtension(leave, newEnd, 'Family emergency')
  assert.equal(leave.end, oldEnd)
  app.approveExtension(leave)
  assert.equal(leave.end, newEnd)
  assert.equal(leave.originalEnd, oldEnd)
  assert.equal(app.employeeFor(leave.employeeId).status, 'Extended')
  assert(
    store.history.some(
      (h) => h.leaveId === leave.id && h.oldValues?.end === oldEnd && h.newValues?.end === newEnd
    )
  )
})
test('Follow-ups, late returns, and AWOL are synchronized and audited', () => {
  const overdue = store.leaves.filter((l) => app.employeeFor(l.employeeId).status === 'Overdue')
  app.recordFollowUp(overdue[0], 'No answer', 'Try again tomorrow', '')
  assert(app.movementFor(overdue[0]).lastFollowUp)
  app.setAwol(overdue[0])
  assert.equal(app.employeeFor(overdue[0].employeeId).status, 'AWOL')
  assert.equal(stats.value.overdue, 4)
  app.recordReturn(overdue[1], dates.localDateTime())
  assert.equal(app.employeeFor(overdue[1].employeeId).status, 'Returned Late')
  assert.equal(stats.value.overdue, 3)
  assert(store.history.some((h) => h.action === 'Final status set to AWOL'))
})
test('Rescheduling future leaves keeps history, and departed leaves stay locked', () => {
  const leave = store.leaves.find((l) => l.status === 'Scheduled'),
    original = { start: leave.start, end: leave.end },
    balance = app.employeeFor(leave.employeeId).remainingBalance
  app.saveLeave({
    ...leave,
    start: dates.addDays(leave.start, 2),
    end: dates.addDays(leave.end, 2),
  })
  assert(
    store.history.some(
      (h) => h.action === 'Leave rescheduled' && h.oldValues.start === original.start
    )
  )
  assert.equal(
    app.employeeFor(leave.employeeId).remainingBalance,
    balance + dates.workingDays(original.start, original.end) - leave.days
  )
  const departed = store.leaves.find((l) => app.movementFor(l)?.departedAt),
    lockedStart = departed.start
  assert.equal(app.saveLeave({ ...departed, start: dates.today() }), false)
  assert.equal(departed.start, lockedStart)
})
test('Overlap, balance, staffing warnings and Sunday exclusions', () => {
  const leave = store.leaves.find(
    (l) => l.status === 'On Leave' && app.employeeFor(l.employeeId).farm === 2
  )
  const warnings = rules.leaveWarnings(store, {
    employeeId: leave.employeeId,
    type: 'Annual Leave',
    start: leave.start,
    end: dates.addDays(leave.end, 20),
  })
  for (const type of ['overlap', 'balance', 'staffing'])
    assert(warnings.some((w) => w.type === type))
  assert.equal(dates.workingDays('2026-10-25', '2026-10-25'), 0)
  assert.equal(dates.workingDays('2026-10-26', '2026-10-26'), 1)
})
test('Blocking staffing rule prevents saving, and role access cannot cross farms', () => {
  store.settings.staffingMode = 'block'
  const employee = store.employees.find(
    (e) =>
      e.farm === 2 && e.status === 'On Site' && !store.leaves.some((l) => l.employeeId === e.id)
  )
  const count = store.leaves.length
  assert.equal(
    app.saveLeave({
      employeeId: employee.id,
      type: 'Annual Leave',
      start: dates.today(),
      end: dates.addDays(dates.today(), 1),
    }),
    false
  )
  assert.equal(store.leaves.length, count)
  app.setRole('Farm Admin')
  const other = store.leaves.find((l) => app.employeeFor(l.employeeId).farm === 1)
  const before = store.history.length
  app.approveLeave(other)
  app.recordDeparture(other, dates.localDateTime())
  assert.equal(store.history.length, before)
})
test('Future leave preserves an active absence and approved balances cannot be reserved twice', () => {
  const active = store.leaves.find((l) => l.status === 'On Leave')
  const employee = app.employeeFor(active.employeeId)
  app.saveLeave({
    employeeId: employee.id,
    type: 'Sick Leave',
    start: dates.addDays(active.end, 10),
    end: dates.addDays(active.end, 12),
  })
  assert.equal(employee.status, 'On Leave')
  app.recordDeparture(
    store.leaves.find(
      (l) => l.status === 'Scheduled' && app.employeeFor(l.employeeId).status === 'Scheduled'
    ),
    dates.localDateTime()
  )
  const departed = store.leaves.find(
    (l) => app.movementFor(l)?.departedAt && app.employeeFor(l.employeeId).status === 'On Leave'
  )
  assert.equal(departed.status, 'On Leave')
  const pending = store.leaves.find((l) => l.approval === 'Pending')
  app.approveLeave(pending)
  const balance = app.employeeFor(pending.employeeId).remainingBalance
  app.approveLeave(pending)
  assert.equal(app.employeeFor(pending.employeeId).remainingBalance, balance)
})
test('An employee cannot depart twice before their current return is recorded', () => {
  const active = store.leaves.find((l) => l.status === 'On Leave')
  app.saveLeave({
    employeeId: active.employeeId,
    type: 'Sick Leave',
    start: dates.addDays(active.end, 10),
    end: dates.addDays(active.end, 12),
  })
  const next = store.leaves[0]
  const movementCount = store.movements.length
  const historyCount = store.history.length
  app.recordDeparture(next, dates.localDateTime())
  assert.equal(store.movements.length, movementCount, 'A second active departure must be rejected')
  assert.equal(store.history.length, historyCount, 'A rejected departure must not write history')
  assert.equal(next.status, 'Scheduled')
  app.recordReturn(active, dates.localDateTime())
  app.recordDeparture(next, dates.localDateTime())
  assert.equal(store.movements.length, movementCount + 1)
})
const sfc = require('@vue/compiler-sfc')
const sourceRoot = path.resolve(__dirname, '../src')
const vueFiles = [
  path.join(sourceRoot, 'App.vue'),
  ...fs
    .readdirSync(path.join(sourceRoot, 'components'))
    .filter((f) => f.endsWith('.vue') && f !== 'HelloWorld.vue')
    .map((f) => path.join(sourceRoot, 'components', f)),
  ...fs
    .readdirSync(path.join(sourceRoot, 'views'))
    .filter((f) => f.endsWith('View.vue'))
    .map((f) => path.join(sourceRoot, 'views', f)),
]
for (const filename of vueFiles) {
  const { descriptor, errors } = sfc.parse(fs.readFileSync(filename, 'utf8'), { filename })
  assert.deepEqual(errors, [], filename)
  const script = sfc.compileScript(descriptor, { id: filename })
  const template = sfc.compileTemplate({
    source: descriptor.template.content,
    filename,
    id: filename,
    compilerOptions: { bindingMetadata: script.bindings },
  })
  assert.deepEqual(template.errors, [], filename)
}
console.log(`PASS All ${vueFiles.length} Vue scripts and templates compile`)
reset()
console.log('All prototype checks passed.')
process.exit(0)
