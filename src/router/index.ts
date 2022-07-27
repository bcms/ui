import { BCMSJwtRoleName } from '@becomes/cms-sdk/types';
import { computed } from 'vue';
import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
} from 'vue-router';
import { useTranslation } from '../translations';
import Login from '../views/login.vue';

const translations = computed(() => {
  return useTranslation();
});

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
    path: `${dashboardBaseUri}/settings`,
    name: 'Settings',
    component: () =>
      import(
        /* webpackChunkName: "dashboard-settings" */ '../views/dashboard/settings.vue'
      ),
  },
  {
    path: `${dashboardBaseUri}/key-manager`,
    name: 'Key Manager',
    component: () =>
      import(
        /* webpackChunkName: "dashboard-key-manager" */ '../views/dashboard/key-manager.vue'
      ),
  },
  {
    path: `${dashboardBaseUri}/key-manager/:kid`,
    name: 'Key Manager Id',
    component: () =>
      import(
        /* webpackChunkName: "dashboard-key-manager" */ '../views/dashboard/key-manager.vue'
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
    component: () =>
      import(
        /* webpackChunkName: "dashboard-entry-view" */ '../views/dashboard/t/id/e/index.vue'
      ),
  },
  {
    path: `${dashboardBaseUri}/t/:tid/e/:eid`,
    name: 'EntryEditor',
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
    path: `${dashboardBaseUri}/plugin/:pluginName`,
    name: 'Plugin',
    component: () =>
      import(
        /* webpackChunkName: "dashboard-plugin" */ '../views/dashboard/plugin.vue'
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
const noAuthPaths = ['/login', '/'];
function toLogin(next: NavigationGuardNext) {
  const query = window.location.href.split('?');
  let url = window.location.pathname;
  if (query[1]) {
    url = url + '?' + query[1];
  }
  next({
    path: '/',
    query: {
      forward: url,
    },
  });
}
function routeProtectionNotAllowed(next: NavigationGuardNext) {
  window.bcms.notification.warning(
    translations.value.layout.nav.routeNotAllowed
  );
  return next({
    path: '/dashboard',
  });
}
async function reportRoute(path: string) {
  if (!window.bcms.sdk.socket.id()) {
    await new Promise<void>((resolve) => {
      setTimeout(async () => {
        await reportRoute(path);
        resolve();
      }, 100);
    });
  } else {
    await window.bcms.sdk.routeTracker.register(path);
  }
}
async function routeProtection(
  to: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  try {
    const user = await window.bcms.sdk.user.get();
    if (user.roles[0].name !== BCMSJwtRoleName.ADMIN) {
      if (to.path.startsWith('/dashboard/media')) {
        if (!user.customPool.policy.media.get) {
          return routeProtectionNotAllowed(next);
        }
      } else if (to.path.startsWith('/dashboard/t')) {
        const template = await window.bcms.sdk.template.get(
          to.params.tid as string
        );
        if (
          !user.customPool.policy.templates.find((e) => e._id === template._id)
        ) {
          return routeProtectionNotAllowed(next);
        }
      }
    }
    if (to.path.startsWith('/dashboard')) {
      await reportRoute(to.path);
    }
    next();
  } catch (error) {
    console.warn(error);
    toLogin(next);
  }
}

router.beforeEach(async (to, _, next) => {
  if (noAuthPaths.includes(to.path)) {
    next();
  } else {
    if (!(await window.bcms.sdk.isLoggedIn())) {
      toLogin(next);
      // next('/');
    } else {
      await routeProtection(to, next);
    }
  }
});

export default router;
