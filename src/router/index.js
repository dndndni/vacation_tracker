import { createRouter, createWebHashHistory } from 'vue-router'
export const pages = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { title: 'Dashboard', icon: 'dashboard' },
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: () => import('../views/CalendarView.vue'),
    meta: { title: 'Calendar', icon: 'calendar' },
  },
  {
    path: '/employees',
    name: 'employees',
    component: () => import('../views/EmployeesView.vue'),
    meta: { title: 'Employees', icon: 'users' },
  },
  {
    path: '/leave',
    name: 'leave',
    component: () => import('../views/LeaveView.vue'),
    meta: { title: 'Leave', icon: 'leaf' },
  },
  {
    path: '/movement',
    name: 'movement',
    component: () => import('../views/MovementView.vue'),
    meta: { title: 'Movement', icon: 'movement' },
  },
  {
    path: '/staffing',
    name: 'staffing',
    component: () => import('../views/StaffingView.vue'),
    meta: { title: 'Staffing', icon: 'chart' },
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import('../views/ReportsView.vue'),
    meta: { title: 'Reports', icon: 'report' },
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    ...pages,
    { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
router.afterEach((to) => {
  document.title = `${to.meta.title} · Farm HR`
})
export default router
