<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { Template, User } from '@becomes/cms-sdk';
  import {
    GeneralService,
    sdk,
    StoreService,
    SideNavService,
  } from '../../services';
  import Link from '../link.svelte';
  import type { BCMSPluginNavItem, NavItem } from '../../types';

  const pluginNavItems: BCMSPluginNavItem[] = GeneralService.pluginNavItems;
  const userUnsub = StoreService.subscribe('user', async (value: User[]) => {
    if (value && user) {
      const u = value.find((e) => e._id === user._id);
      if (u) {
        user = u;
        if (user.roles[0].name !== 'ADMIN') {
          entries = entries.map((entry) => {
            const userTemplatePolicy = user.customPool.policy.templates.find(
              (e) => e._id === entry.templateId
            );
            return {
              templateId: entry.templateId,
              name: entry.name,
              link: entry.link,
              icon: 'fas fa-pencil-alt',
              selected: entry.selected,
              visable:
                user.roles[0].name === 'ADMIN'
                  ? true
                  : userTemplatePolicy
                  ? userTemplatePolicy.get
                  : false,
            };
          });
          if (!entries.find((e) => e.visable)) {
            showEntries = false;
          } else {
            showEntries = true;
          }
          plugins = plugins.map((plugin) => {
            const userPluginPolicy = user.customPool.policy.plugins
              ? user.customPool.policy.plugins.find(
                  (e) => e.name === plugin.originalName
                )
              : undefined;
            if (!userPluginPolicy || userPluginPolicy.get === false) {
              plugin.visable = false;
            } else {
              plugin.visable = true;
            }
            return plugin;
          });
          if (!plugins.find((e) => e.visable)) {
            showPlugins = false;
          } else {
            showPlugins = true;
          }
        }
      }
    }
  });
  const templateStoreUnsub = StoreService.subscribe(
    'template',
    async (value) => {
      if (user && value) {
        parseEntries(value);
      }
    }
  );
  const pathUnsub = StoreService.subscribe('path', async (value: string) => {
    setActive(value);
  });
  let plugins: Array<NavItem & { originalName: string }> = pluginNavItems.map(
    (e) => {
      return {
        icon: e.icon ? e.icon : '/assets/icons/default-plugin.svg',
        link: e.link,
        name: e.label,
        originalName: e.name,
        selected: false,
        visable: true,
      };
    }
  );
  let user: User;
  let administration: NavItem[];
  let entries: Array<NavItem & { templateId: string }> = [];
  let webhooks: NavItem[] = [];
  let showAdministration = false;
  let showEntries = false;
  let showPlugins = plugins.length > 0;

  function setActive(path: string) {
    if (administration && entries) {
      administration.forEach((item) => {
        let linkParts = item.link.split('/');
        if (linkParts[linkParts.length - 1] === '-') {
          linkParts = linkParts.splice(0, linkParts.length - 1);
        }
        if (path.startsWith(linkParts.join('/'))) {
          item.selected = true;
        } else {
          item.selected = false;
        }
        // return item;
      });
      entries.forEach((item) => {
        if (path.startsWith(item.link)) {
          item.selected = true;
        } else {
          item.selected = false;
        }
        // return item;
      });
    }
  }
  function parseEntries(templates: Template[]) {
    entries = templates.map((template) => {
      const userTemplatePolicy = user.customPool.policy.templates.find(
        (e) => e._id === template._id
      );
      const link = `/dashboard/template/${template._id}/entry`;
      return {
        templateId: template._id,
        name: GeneralService.string.toPretty(template.name),
        link,
        icon: 'fas fa-pencil-alt',
        selected: link === window.location.pathname ? true : false,
        visable:
          user.roles[0].name === 'ADMIN'
            ? true
            : userTemplatePolicy
            ? userTemplatePolicy.get
            : false,
      };
    });
    if (!entries.find((e) => e.visable)) {
      showEntries = false;
    } else {
      showEntries = true;
    }
  }
  async function signout() {
    if (confirm('Are you sure you want to sign out?')) {
      await sdk.user.logout();
      window.location.href = '/';
    }
  }
  async function init() {
    if ((await sdk.isLoggedIn()) === false) {
      GeneralService.navigate(
        `/?error=${encodeURIComponent('You are not logged in.')}`
      );
    }
    user = await SideNavService.getUser();
    if (user.roles[0].name !== 'ADMIN') {
      plugins = plugins.map((plugin) => {
        const userPluginPolicy = user.customPool.policy.plugins
          ? user.customPool.policy.plugins.find(
              (e) => e.name === plugin.originalName
            )
          : undefined;
        if (!userPluginPolicy || userPluginPolicy.get === false) {
          plugin.visable = false;
        } else {
          plugin.visable = true;
        }
        return plugin;
      });
      if (!plugins.find((e) => e.visable)) {
        showPlugins = false;
      } else {
        showPlugins = true;
      }
    }
    administration = SideNavService.getAdministration();
    entries = await SideNavService.getEntries();
    if (!entries.find((e) => e.visable)) {
      showEntries = false;
    } else {
      showEntries = true;
    }
    setActive(window.location.pathname);
    showAdministration = administration.find((e) => e.visable === true)
      ? true
      : false;
  }
  init().catch((error) => {
    console.error(error);
  });
  onDestroy(() => {
    pathUnsub();
    templateStoreUnsub();
    userUnsub();
  });
</script>

<h1>BCMS</h1>
<button
  class="layout--side-nav-logout"
  on:click={() => {
    signout();
  }}>
  <div class="icon fas fa-sign-out-alt" />
  <div class="name">Sign out</div>
</button>
{#if showAdministration && administration}
  <div class="layout--side-nav-section">
    <h2>ADMINISTRATION</h2>
    <div class="items">
      {#each administration as item}
        {#if item.visable}
          <Link
            selected={item.selected}
            class="item {item.selected ? 'selected' : ''}"
            href={item.link}>
            <div class="icon {item.icon}" />
            <div class="name">{item.name}</div>
          </Link>
        {/if}
      {/each}
    </div>
  </div>
{/if}
{#if showPlugins}
  <div class="layout--side-nav-section">
    <h2>PLUGINS</h2>
    <div class="items">
      {#each plugins as item}
        {#if item.visable}
          <Link class="item {item.selected ? 'selected' : ''}" href={item.link}>
            <div class="icon"><img src={item.icon} alt={item.name} /></div>
            <div class="name">{item.name}</div>
          </Link>
        {/if}
      {/each}
    </div>
  </div>
{/if}
{#if showEntries}
  <div class="layout--side-nav-section">
    <h2>ENTRIES</h2>
    <div class="items">
      {#each entries as item}
        {#if item.visable}
          <Link
            selected={item.selected}
            class="item {item.selected ? 'selected' : ''}"
            href={item.link}>
            <div class="icon {item.icon}" />
            <div class="name">{item.name}</div>
          </Link>
        {/if}
      {/each}
    </div>
  </div>
{/if}
