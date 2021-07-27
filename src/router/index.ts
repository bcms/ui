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
    meta: {
      noSecondLevelNav: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "dashboard-home" */ '../views/dashboard/home.vue'
      ),
  },
  {
    path: `${dashboardBaseUri}/t`,
    name: 'Template',
    component: () =>
      import(
        /* webpackChunkName: "dashboard-template" */ '../views/dashboard/t/id/index.vue'
      ),
  },
  {
    path: `${dashboardBaseUri}/t/:tid`,
    name: 'TemplateId',
    component: () =>
      import(
        /* webpackChunkName: "dashboard-template" */ '../views/dashboard/t/id/index.vue'
      ),
  },
  {
    path: `${dashboardBaseUri}/t/:tid/e`,
    name: 'EntryView',
    meta: {
      noSecondLevelNav: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "dashboard-entry-view" */ '../views/dashboard/t/id/e/index.vue'
      ),
  },
  {
    path: `${dashboardBaseUri}/t/:tid/e/:eid`,
    name: 'EntryEditor',
    meta: {
      noSecondLevelNav: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "dashboard-entry-editor" */ '../views/dashboard/t/id/e/id.vue'
      ),
  },
  {
    path: `${dashboardBaseUri}/g`,
    name: 'Group',
    component: () =>
      import(
        /* webpackChunkName: "dashboard-group" */ '../views/dashboard/g/id/index.vue'
      ),
  },
  {
    path: `${dashboardBaseUri}/g/:gid`,
    name: 'GroupId',
    component: () =>
      import(
        /* webpackChunkName: "dashboard-group" */ '../views/dashboard/g/id/index.vue'
      ),
  },
  {
    path: `${dashboardBaseUri}/w`,
    name: 'Widget',
    component: () =>
      import(
        /* webpackChunkName: "dashboard-widget" */ '../views/dashboard/w/id/index.vue'
      ),
  },
  {
    path: `${dashboardBaseUri}/w/:wid`,
    name: 'WidgetId',
    component: () =>
      import(
        /* webpackChunkName: "dashboard-widget" */ '../views/dashboard/w/id/index.vue'
      ),
  },
  {
    path: `${dashboardBaseUri}/media`,
    name: 'Media',
    meta: {
      noSecondLevelNav: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "dashboard-media" */ '../views/dashboard/media/index.vue'
      ),
  },
  {
    path: `${dashboardBaseUri}/media/:id`,
    name: 'MediaId',
    meta: {
      noSecondLevelNav: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "dashboard-media" */ '../views/dashboard/media/index.vue'
      ),
  },
  // {
  //   path: `${dashboardBaseUri}/plugin/:id`,
  //   name: 'Plugin',
  //   meta: {
  //     noSecondLevelNav: true,
  //   },
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "dashboard-plugin" */ '../views/dashboard/plugin/id.vue'
  //     ),
  // },
  {
    path: '/:pathMatch(.*)*',
    name: 'P404',
    meta: {
      noLayout: true,
      noSecondLevelNav: true,
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
