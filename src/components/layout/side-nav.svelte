<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fly } from 'svelte/transition';
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
  const plugins: NavItem[] = pluginNavItems.map((e) => {
    return {
      icon: e.icon ? e.icon : '/assets/icons/default-plugin.svg',
      link: e.link,
      name: e.name,
      selected: false,
      visable: true,
    };
  });
  let user: User;
  let administration: NavItem[];
  let entries: NavItem[] = [];
  let webhooks: NavItem[] = [];
  let showAdministration = false;
  let showEntries = false;
  let showWebhooks = false;
  let showPlugins = plugins.length > 0;

  function setActive(path: string) {
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
  function parseEntries(templates: Template[]) {
    entries = templates.map((template) => {
      const link = `/dashboard/template/${template._id}/entry`;
      return {
        name: GeneralService.string.toPretty(template.name),
        link,
        icon: 'fas fa-pencil-alt',
        selected: link === window.location.pathname ? true : false,
        visable:
          user.roles[0].name === 'ADMIN'
            ? true
            : user.customPool.policy.templates.find(
                (e) => e._id === template._id
              )
            ? true
            : false,
      };
    });
    showEntries = entries.length > 0;
  }
  async function signout() {
    if (confirm('Are you sure you want to sign out?')) {
      await sdk.user.logout();
      window.location.href = '/';
    }
  }
  async function init() {
    user = await SideNavService.getUser();
    administration = SideNavService.getAdministration();
    entries = await SideNavService.getEntries();
    setActive(window.location.pathname);
    showAdministration = administration.find((e) => e.visable === true)
      ? true
      : false;
    showEntries = entries.length > 0;
    showWebhooks = webhooks.length > 0;
  }
  init().catch((error) => {
    console.error(error);
  });
  onDestroy(() => {
    pathUnsub();
    templateStoreUnsub();
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
        <Link class="item {item.selected ? 'selected' : ''}" href={item.link}>
          <div class="icon"><img src={item.icon} alt={item.name} /></div>
          <div class="name">{item.name}</div>
        </Link>
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
