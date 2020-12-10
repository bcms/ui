<script context="module" lang="ts">
</script>

<script lang="ts">
  import { ConfirmModal, Layout, Notification, Tooltip, Glow } from './components';
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
  import { Router, RouterContainer } from './router';
  import { GeneralService } from './services';
  import 'simplebar';

  /*%PLUGINS_START%*/
  const plugins = [];
  /*%PLUGINS_END%*/

  GeneralService.pluginNavItems = plugins.map((plugin) => {
    return {
      label: plugin.displayName,
      name: plugin.originalName,
      icon: plugin.icon,
      link: '/dashboard/plugins/' + plugin.path,
    };
  });
  Router.register(
    [
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
    ],
    {
      component: P404,
      path: '',
    }
  );
</script>

<style global lang="scss">
  @import './styles/main.scss';
</style>

<Layout>
  <RouterContainer />
</Layout>
<ConfirmModal />
<Tooltip />
<Notification />
<Glow />
