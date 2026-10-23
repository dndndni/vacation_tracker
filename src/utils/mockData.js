import { FARM_COUNTS, ANNUAL_LEAVE_DAYS, DEPARTMENTS } from './constants'
import { today, addDays, workingDays } from './dateUtils'

export function generateMockData() {
  let seed = 1729
  const random = () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
  const first = [
    'Maria',
    'Jose',
    'Ana',
    'Rafael',
    'Isabel',
    'Miguel',
    'Camille',
    'Paolo',
    'Sofia',
    'Gabriel',
    'Andrea',
    'Luis',
    'Patricia',
    'Carlo',
    'Jasmine',
    'Marco',
    'Elena',
    'Daniel',
    'Bianca',
    'Ramon',
    'Teresa',
    'Angelo',
    'Nina',
    'Emilio',
    'Liza',
    'Francis',
    'Joy',
    'Alvin',
    'Grace',
    'Noel',
  ]
  const last = [
    'Santos',
    'Reyes',
    'Cruz',
    'Garcia',
    'Mendoza',
    'Ramos',
    'Bautista',
    'Aquino',
    'Navarro',
    'Villanueva',
    'Castillo',
    'Fernandez',
    'Soriano',
    'Flores',
    'Dela Cruz',
    'Mercado',
    'Torres',
    'Rivera',
    'Gonzales',
    'Salazar',
    'Valdez',
    'Pascual',
    'Domingo',
    'Santiago',
    'Aguilar',
    'Tolentino',
    'De Leon',
    'Francisco',
    'Lim',
    'Manalo',
  ]
  const regions = [
    'San Pablo, Laguna',
    'Lipa, Batangas',
    'Tiaong, Quezon',
    'Tanauan, Batangas',
    'Los Baños, Laguna',
    'Lucban, Quezon',
    'Calamba, Laguna',
    'San Jose, Batangas',
  ]
  const farms = FARM_COUNTS.map((count, i) => ({
    id: i + 1,
    name: `Farm ${i + 1}`,
    location: regions[i],
    minimum: Math.ceil(count * 0.8),
  }))
  const employees = [],
    leaves = [],
    movements = [],
    history = []
  const absenceCounts = [6, 19, 5, 15, 5, 5, 4, 4]
  const absenceStatuses = [
    ...Array(43).fill('On Leave'),
    ...Array(12).fill('Returning Soon'),
    ...Array(5).fill('Overdue'),
    ...Array(2).fill('Extended'),
    'AWOL',
  ]
  // Seeded shuffle keeps every headline count exact while distributing statuses.
  for (let i = absenceStatuses.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[absenceStatuses[i], absenceStatuses[j]] = [absenceStatuses[j], absenceStatuses[i]]
  }
  let globalId = 0,
    absenceIndex = 0,
    scheduled = 0,
    pending = 0,
    completed = 0
  farms.forEach((farm, fi) => {
    for (let i = 0; i < FARM_COUNTS[fi]; i++) {
      globalId++
      const dept = DEPARTMENTS[i % DEPARTMENTS.length]
      const employee = {
        id: `F${farm.id}-${String(globalId).padStart(4, '0')}`,
        name: `${first[(globalId - 1) % first.length]} ${
          last[Math.floor((globalId - 1) / first.length) % last.length]
        }`,
        farm: farm.id,
        department: dept,
        position: {
          'Field Operations': 'Field associate',
          Livestock: 'Livestock caretaker',
          Packing: 'Packing associate',
          Maintenance: 'Maintenance technician',
          Admin: 'Farm coordinator',
        }[dept],
        entitlement: ANNUAL_LEAVE_DAYS,
        usedDays: Math.floor(random() * 7),
        remainingBalance: 0,
        status: 'On Site',
        currentMovement: null,
      }
      employee.remainingBalance = employee.entitlement - employee.usedDays
      let status,
        start,
        end,
        approval = 'Approved',
        movement = null
      if (i < absenceCounts[fi]) {
        status = absenceStatuses[absenceIndex++]
        start = addDays(
          today(),
          status === 'Overdue' || status === 'AWOL'
            ? -9 - Math.floor(random() * 3)
            : -2 - Math.floor(random() * 3)
        )
        end =
          status === 'Returning Soon'
            ? addDays(today(), 1 + Math.floor(random() * 3))
            : status === 'Overdue' || status === 'AWOL'
            ? addDays(today(), -2 - Math.floor(random() * 4))
            : addDays(today(), 5 + Math.floor(random() * 7))
        movement = {
          id: `M${globalId}`,
          employeeId: employee.id,
          departedAt: start + 'T07:30',
          returnedAt: null,
          status,
          lastFollowUp: status === 'Overdue' ? addDays(today(), -1) + 'T14:00' : null,
          followUpNote: 'Called; awaiting an update.',
          recordedLate: i === 0 && fi === 0,
        }
      } else if (i < absenceCounts[fi] + 3 && scheduled < 18) {
        status = 'Scheduled'
        start = addDays(today(), scheduled % 6)
        end = addDays(start, 4)
        scheduled++
      } else if (i === absenceCounts[fi] + 4 && pending < 4) {
        status = 'Pending'
        approval = 'Pending'
        start = addDays(today(), 8)
        end = addDays(start, 3)
        pending++
      } else if (i === absenceCounts[fi] + 5 && completed < 2) {
        status = 'Returned Late'
        start = addDays(today(), -20)
        end = addDays(today(), -15)
        completed++
        movement = {
          id: `M${globalId}`,
          employeeId: employee.id,
          departedAt: start + 'T08:00',
          returnedAt: addDays(end, 2) + 'T09:00',
          status,
          recordedLate: true,
        }
      }
      if (status) {
        const type =
          globalId % 11 === 0
            ? 'Sick Leave'
            : globalId % 13 === 0
            ? 'Emergency Leave'
            : globalId % 17 === 0
            ? 'Other/Unpaid'
            : 'Annual Leave'
        const leave = {
          id: `L${String(leaves.length + 1).padStart(4, '0')}`,
          employeeId: employee.id,
          type,
          start,
          end,
          originalEnd: end,
          approval,
          status,
          days: workingDays(start, end),
          extension: null,
          note: '',
          endorsed: false,
        }
        leaves.push(leave)
        if (approval === 'Approved' && type === 'Annual Leave') {
          employee.usedDays =
            Math.min(employee.usedDays, Math.max(0, ANNUAL_LEAVE_DAYS - leave.days)) + leave.days
          employee.remainingBalance = employee.entitlement - employee.usedDays
        }
        const createdOn = addDays(start, -3) < today() ? addDays(start, -3) : addDays(today(), -1)
        history.push({
          id: `H${history.length + 1}`,
          leaveId: leave.id,
          employeeId: employee.id,
          actor: 'Camille Reyes · HR',
          action: 'Leave created',
          timestamp: createdOn + 'T10:00',
          oldValues: null,
          newValues: { start, end, approval },
          recordedLate: false,
        })
        if (movement) {
          movement.leaveId = leave.id
          movements.push(movement)
          employee.currentMovement = movement.id
          history.push({
            id: `H${history.length + 1}`,
            leaveId: leave.id,
            employeeId: employee.id,
            actor: 'Rafael Cruz · Farm Admin',
            action: 'Departure recorded',
            timestamp: addDays(start, movement.recordedLate ? 2 : 0) + 'T08:15',
            oldValues: { status: 'Scheduled' },
            newValues: { status: 'On Leave', actualDeparture: movement.departedAt },
            recordedLate: movement.recordedLate,
          })
          if (movement.returnedAt)
            history.push({
              id: `H${history.length + 1}`,
              leaveId: leave.id,
              employeeId: employee.id,
              actor: 'Camille Reyes · HR',
              action: 'Return recorded',
              timestamp: addDays(movement.returnedAt, 2) + 'T10:30',
              oldValues: { status: 'On Leave' },
              newValues: { actualReturn: movement.returnedAt, status: 'Returned Late' },
              recordedLate: true,
            })
        }
        if (status === 'Extended') {
          leave.originalEnd = addDays(end, -4)
          history.push({
            id: `H${history.length + 1}`,
            leaveId: leave.id,
            employeeId: employee.id,
            actor: 'Camille Reyes · HR',
            action: 'Extension approved',
            timestamp: addDays(today(), -1) + 'T11:20',
            oldValues: { end: leave.originalEnd },
            newValues: { end },
            recordedLate: false,
          })
        }
        employee.status = ['Pending'].includes(status) ? 'On Site' : status
      }
      employees.push(employee)
    }
  })
  leaves
    .filter((l) => l.status === 'On Leave')
    .slice(0, 3)
    .forEach((l) => {
      l.extension = {
        originalEnd: l.end,
        requestedEnd: addDays(l.end, 3),
        status: 'Pending',
        reason: 'Additional time needed for a family commitment.',
      }
    })
  return { farms, employees, leaves, movements, history }
}
