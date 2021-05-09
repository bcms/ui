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
    path: `${dashboardBaseUri}/template/:tid/entry`,
    name: 'EntryView',
    component: () =>
      import(
        /* webpackChunkName: "dashboard-entry-view" */ '../views/dashboard/template/id/entry/index.vue'
      ),
  },
  {
    path: `${dashboardBaseUri}/template/:tid/entry/:eid`,
    name: 'EntryEditor',
    component: () =>
      import(
        /* webpackChunkName: "dashboard-entry-editor" */ '../views/dashboard/template/id/entry/id.vue'
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
    path: `${dashboardBaseUri}/media`,
    name: 'Media',
    component: () =>
      import(
        /* webpackChunkName: "dashboard-media" */ '../views/dashboard/media/index.vue'
      ),
  },
  {
    path: `${dashboardBaseUri}/media/:id`,
    name: 'MediaId',
    component: () =>
      import(
        /* webpackChunkName: "dashboard-media" */ '../views/dashboard/media/index.vue'
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
