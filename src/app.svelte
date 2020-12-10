<script context="module" lang="ts">
</script>

<script lang="ts">
  import { Router, Route } from 'svelte-routing';
  import { ConfirmModal, Notification, Tooltip, Glow } from './components';
  import {
    Login,
    P404,
    SignupAdmin,
    Overview,
    TemplateManager,
    GroupManager,
    WidgetManager,
    LanguageManager,
    UserManager,
    ApiKeyManager,
    MediaManager,
    EntryOverview,
    EntryEditor,
    UserProfile,
    HistoryOverviewView,
  } from './views';
  import { GeneralService } from './services';
  import 'simplebar';

  /*%PLUGINS_START%*/
  const plugins = [];
  /*%PLUGINS_END%*/

  export let url = '';
  export let globalProps: {} = {};

  type RouteDescriptor = {
    path: string;
    component: any;
    props?: any;
    children?: RouteDescriptor[];
  };

  GeneralService.pluginNavItems = plugins.map((plugin) => {
    return {
      label: plugin.displayName,
      name: plugin.originalName,
      icon: plugin.icon,
      link: '/dashboard/plugins/' + plugin.path,
    };
  });
  const routes = reduceRoutes([
    {
      path: `/`,
      component: Login,
    },
    {
      path: `/login`,
      component: Login,
    },
    {
      path: `/signup-admin`,
      component: SignupAdmin,
    },
    {
      path: `/dashboard`,
      component: Overview,
      children: [
        {
          path: '/template/editor/:id',
          component: TemplateManager,
        },
        {
          path: '/group/editor/:id',
          component: GroupManager,
        },
        {
          path: '/widget/editor/:id',
          component: WidgetManager,
        },
        {
          path: '/language/editor/:id',
          component: LanguageManager,
        },
        {
          path: '/user',
          component: UserProfile,
        },
        {
          path: '/user/:id',
          component: UserProfile,
        },
        {
          path: '/user/editor/:id',
          component: UserManager,
        },
        {
          path: '/key/editor/:id',
          component: ApiKeyManager,
        },
        {
          path: '/media/editor/:id',
          component: MediaManager,
        },
        {
          path: '/template/:templateId/entry',
          component: EntryOverview,
          children: [
            {
              path: '/:entryId',
              component: EntryEditor,
            },
          ],
        },
        {
          path: '/history',
          component: HistoryOverviewView,
        },
      ],
    },
    /*%ROUTER_PLUGINS_START%*/
    /*%ROUTER_PLUGINS_END%*/
    {
      path: ``,
      component: P404,
    },
  ]);

  function reduceRoutes(rots: RouteDescriptor[]) {
    const output: Array<{
      path: string;
      component: any;
      props?: any;
    }> = [];
    for (const i in rots) {
      const rot = rots[i];
      output.push({
        path: rot.path,
        component: rot.component,
        props: rot.props,
      });
      if (rot.children) {
        const children = reduceRoutes(rot.children);
        for (const j in children) {
          children[j].path = rot.path + children[j].path;
          children[j].props = { ...children[j].props, ...rot.props };
          output.push(children[j]);
        }
      }
    }
    return output;
  }
</script>

<style global lang="scss">
  @import './styles/main.scss';
</style>

<Router {url}>
  {#each routes as route}
    <Route
      path={route.path}
      component={route.component}
      props={{ ...globalProps, ...route.props }} />
  {/each}
</Router>
<ConfirmModal />
<Tooltip />
<Glow />
