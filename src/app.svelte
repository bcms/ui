<script lang="ts">
  import { Router, Route } from 'svelte-routing';
  import { Layout, Popup } from './components';
  import {
    Login,
    P404,
    SignupAdmin,
    Overview,
    TemplateManager,
    GroupManager,
    WidgetManager,
    LanguageManager,
  } from './views';

  export let url = '';
  export let globalProps: {} = {};

  interface RouteDescriptor {
    path: string;
    component: any;
    props?: any;
    children?: RouteDescriptor[];
  }

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
      ],
    },
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
  <Layout>
    {#each routes as route}
      <Route
        path={route.path}
        component={route.component}
        props={{ ...globalProps, ...route.props }} />
    {/each}
  </Layout>
</Router>
<Popup />
