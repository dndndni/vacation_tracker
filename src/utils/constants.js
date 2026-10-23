export const OVERDUE_AFTER_DAYS = 1
export const RETURNING_SOON_DAYS = 3
export const ANNUAL_LEAVE_DAYS = 15
export const APPROVAL_MODE = 'hr_approves'
export const STAFFING_MODE = 'warning'
export const EXCLUDED_WEEKDAYS = [0]
export const HOLIDAYS = ['2026-11-01', '2026-12-25', '2027-01-01']
export const FARM_COUNTS = [62, 58, 55, 60, 52, 57, 50, 57]
export const ASSIGNED_FARMS = [2, 3]
export const DEPARTMENTS = ['Field Operations', 'Livestock', 'Packing', 'Maintenance', 'Admin']
export const LEAVE_TYPES = ['Annual Leave', 'Sick Leave', 'Emergency Leave', 'Other/Unpaid']
export const ROLE_PERMISSIONS = {
  HR: { approve: true, setAwol: true },
  'Farm Admin': { approve: false, setAwol: false },
}
export const STATUSES = {
  'On Site': 'onsite',
  Scheduled: 'scheduled',
  'On Leave': 'leave',
  'Returning Soon': 'returning',
  Overdue: 'overdue',
  Extended: 'extended',
  'Returned Late': 'late',
  AWOL: 'awol',
  Pending: 'pending',
  Approved: 'onsite',
  Endorsed: 'scheduled',
  'Revision Requested': 'pending',
  Completed: 'onsite',
}
export const ABSENT_STATUSES = ['On Leave', 'Returning Soon', 'Overdue', 'Extended', 'AWOL']
