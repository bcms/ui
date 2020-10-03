<script lang="ts">
  import { Router, Route } from 'svelte-routing';
  import { Popup } from './components';
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
  } from './views';
  import { GeneralService } from './services';
  /*%PLUGINS_START%*/
import P1 from '/home/banez/Documents/becomes/cms/v2/starter/plugins/p1/frontend/main.svelte';
const plugins = [
          {
            originalName: 'p1',
            component: P1,
            displayName: 'My Awesome Plugin',
            path: 'p1',
            icon: '/assets/icons/default-plugin.svg',
          }
          ];
/*%PLUGINS_END%*/

  export let url = '';
  export let globalProps: {} = {};

  type RouteDescriptor = {
    path: string;
    component: any;
    props?: any;
    children?: RouteDescriptor[];
  }

  GeneralService.pluginNavItems = plugins.map((plugin) => {
    return {
      name: plugin.displayName,
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
          path: '/user/editor/:id',
          component: UserManager,
        },
        {
          path: '/key/editor/:id',
          component: ApiKeyManager,
        },
        {
          path: '/media/editor',
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
      ],
    },
    /*%ROUTER_PLUGINS_START%*/
{
            path: '/dashboard/plugins/p1',
            component: P1,
            props: undefined
            },/*%ROUTER_PLUGINS_END%*/

















,
    ,
    ,
    ,
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
<Popup />
