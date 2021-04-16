import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Login from '@/views/login.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Login',
    meta: {
      noHeader: true,
    },
    component: Login,
  },
  {
    path: '/login',
    name: 'Login2',
    meta: {
      noHeader: true,
    },
    component: Login,
  },
  {
    path: '/dashboard',
    name: 'Home',
    component: () =>
      import(
        /* webpackChunkName: "dashboard-home" */ '../views/dashboard/home.vue'
      ),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'P404',
    meta: {
      noHeader: true,
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
