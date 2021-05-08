import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Login from '../views/login.vue';
const dashboardBaseUri = '/dashboard';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Login',
    meta: {
      noLayout: true,
    },
    component: Login,
  },
  {
    path: '/login',
    name: 'Login2',
    meta: {
      noLayout: true,
    },
    component: Login,
  },
  {
    path: `${dashboardBaseUri}`,
    name: 'Home',
    component: () =>
      import(
        /* webpackChunkName: "dashboard-home" */ '../views/dashboard/home.vue'
      ),
  },
  {
    path: `${dashboardBaseUri}/template`,
    name: 'Template',
    component: () =>
      import(
        /* webpackChunkName: "dashboard-template" */ '../views/dashboard/template/id/index.vue'
      ),
  },
  {
    path: `${dashboardBaseUri}/template/:id`,
    name: 'TemplateId',
    component: () =>
      import(
        /* webpackChunkName: "dashboard-template" */ '../views/dashboard/template/id/index.vue'
      ),
  },
  {
    path: `${dashboardBaseUri}/group`,
    name: 'Group',
    component: () =>
      import(
        /* webpackChunkName: "dashboard-group" */ '../views/dashboard/group/id/index.vue'
      ),
  },
  {
    path: `${dashboardBaseUri}/group/:id`,
    name: 'GroupId',
    component: () =>
      import(
        /* webpackChunkName: "dashboard-group" */ '../views/dashboard/group/id/index.vue'
      ),
  },
  {
    path: `${dashboardBaseUri}/widget`,
    name: 'Widget',
    component: () =>
      import(
        /* webpackChunkName: "dashboard-widget" */ '../views/dashboard/widget/id/index.vue'
      ),
  },
  {
    path: `${dashboardBaseUri}/widget/:id`,
    name: 'WidgetId',
    component: () =>
      import(
        /* webpackChunkName: "dashboard-widget" */ '../views/dashboard/widget/id/index.vue'
      ),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'P404',
    meta: {
      noLayout: true,
    },
    component: () =>
      import(/* webpackChunkName: "dashboard-404" */ '../views/404.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
