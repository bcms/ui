<script context="module" lang="ts">
  export const ExpendedSectionBuffer = {
    administration: true,
    plugins: false,
    entries: false,
  };
</script>

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
  import {
    CaretRightIcon,
    EntryIcon,
    LogoIcon,
    NavIcon,
    SignOutIcon,
  } from '../icons';

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
              icon: EntryIcon,
              selected: entry.selected,
              visible:
                user.roles[0].name === 'ADMIN'
                  ? true
                  : userTemplatePolicy
                  ? userTemplatePolicy.get
                  : false,
            };
          });
          if (!entries.find((e) => e.visible)) {
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
              plugin.visible = false;
            } else {
              plugin.visible = true;
            }
            return plugin;
          });
          if (!plugins.find((e) => e.visible)) {
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
        icon: e.icon ? e.icon : EntryIcon,
        link: e.link,
        name: e.label,
        originalName: e.name,
        selected: false,
        visible: true,
      };
    }
  );
  let user: User;
  let administration: NavItem[];
  let entries: Array<NavItem & { templateId: string }> = [];
  let showAdministration = false;
  let showEntries = false;
  let showPlugins = plugins.length > 0;
  let isMobileNavOpen = false;
  let expendedSection = ExpendedSectionBuffer;

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
        name: template.label,
        link,
        icon: EntryIcon,
        selected: link === window.location.pathname ? true : false,
        visible:
          user.roles[0].name === 'ADMIN'
            ? true
            : userTemplatePolicy
            ? userTemplatePolicy.get
            : false,
      };
    });
    if (!entries.find((e) => e.visible)) {
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
      return;
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
          plugin.visible = false;
        } else {
          plugin.visible = true;
        }
        return plugin;
      });
      if (!plugins.find((e) => e.visible)) {
        showPlugins = false;
      } else {
        showPlugins = true;
      }
    }
    administration = SideNavService.getAdministration();
    entries = await SideNavService.getEntries();
    if (!entries.find((e) => e.visible)) {
      showEntries = false;
    } else {
      showEntries = true;
    }
    setActive(window.location.pathname);
    showAdministration = administration.find((e) => e.visible === true)
      ? true
      : false;
    let foundNav = false;
    for (const i in administration) {
      const item = administration[i];
      if (window.location.pathname.startsWith(item.link.replace(/-/g, ''))) {
        expendedSection.administration = true;
        foundNav = true;
        break;
      }
    }
    if (!foundNav) {
      for (const i in entries) {
        const item = entries[i];
        if (window.location.pathname.startsWith(item.link.replace(/-/g, ''))) {
          expendedSection.entries = true;
          foundNav = true;
          break;
        }
      }
    }
  }
  init().catch((error) => {
    console.error(error);
  });

  function toggleMobileNav() {
    isMobileNavOpen = !isMobileNavOpen;
  }
  function toggleSection(type: 'administration' | 'plugins' | 'entries') {
    for (const key in expendedSection) {
      if (key === type) {
        expendedSection[key] = !expendedSection[key];
      } else {
        // No need to toggle other items. Just the on that has been clicked.
        // expendedSection[key] = false;
      }
    }
  }

  onDestroy(() => {
    pathUnsub();
    templateStoreUnsub();
    userUnsub();
  });
</script>

<nav class="sideNav {isMobileNavOpen ? 'is-active' : ''}" data-simplebar>
  <div class="sideNav--top">
    <Link href="/" class="sideNav--logo">
      <LogoIcon />
    </Link>
    <button aria-label="Toggle navigation" on:click={toggleMobileNav}>
      <NavIcon />
    </button>
    <ul class="sideNav--items">
      {#each plugins as item}
        {#if item.visible}
          <li
            class="sideNav--item {item.selected ? 'sideNav--item_selected' : ''}">
            <Link href={item.link}>
              <span class="sideNav--item-name">{item.name}</span>
              <span class="sideNav--item-icon">
                <svelte:component this={item.icon} />
              </span>
            </Link>
          </li>
        {/if}
      {/each}
    </ul>
  </div>
  <div class="sideNav--wrapper">
    <div class="sideNav--inner">
      {#if showAdministration && administration}
        <div class="sideNav--section">
          <button
            class="sideNav--section-toggler {expendedSection.administration ? 'sideNav--section-toggler_active' : ''}"
            on:click={() => {
              toggleSection('administration');
            }}>
            <CaretRightIcon />
            <span>Administration</span>
          </button>
          <ul class="sideNav--items">
            {#each administration as item}
              {#if item.visible}
                <li
                  class="sideNav--item {item.selected ? 'sideNav--item_selected' : ''}">
                  <Link href={item.link}>
                    <span class="sideNav--item-name">{item.name}</span>
                    <span class="sideNav--item-icon">
                      <svelte:component this={item.icon} />
                    </span>
                  </Link>
                </li>
              {/if}
            {/each}
          </ul>
        </div>
      {/if}
      {#if showPlugins}
        <div class="sideNav--section">
          <button
            class="sideNav--section-toggler {expendedSection.plugins ? 'sideNav--section-toggler_active' : ''}"
            on:click={() => {
              toggleSection('plugins');
            }}>
            <CaretRightIcon />
            <span>Plugins</span>
          </button>
          <ul class="sideNav--items">
            {#each plugins as item}
              <li
                class="sideNav--item {item.selected ? 'sideNav--item_selected' : ''}">
                <Link href={item.link}>
                  <span class="sideNav--item-name">{item.name}</span>
                  <span class="sideNav--item-icon">
                    <svelte:component this={item.icon} />
                  </span>
                </Link>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      <div class="sideNav--section">
        <button
          class="sideNav--section-toggler {expendedSection.entries ? 'sideNav--section-toggler_active' : ''}"
          on:click={() => {
            toggleSection('entries');
          }}>
          <CaretRightIcon />
          <span>Entries</span>
        </button>
        <ul class="sideNav--items">
          {#if !showEntries || !entries.length}
            <li class="sideNav--item">
              <span class="sideNav--item-name_empty">No entries to show</span>
            </li>
          {:else}
            {#each entries as item}
              {#if item.visible}
                <li
                  class="sideNav--item {item.selected ? 'sideNav--item_selected' : ''}">
                  <Link href={item.link}>
                    <span class="sideNav--item-name">{item.name}</span>
                    <span class="sideNav--item-icon">
                      <svelte:component this={item.icon} />
                    </span>
                  </Link>
                </li>
              {/if}
            {/each}
          {/if}
        </ul>
      </div>
      <button
        class="sideNav--logout"
        on:click={() => {
          signout();
        }}>
        <span class="sideNav--item-name">Sign out</span>
        <SignOutIcon />
      </button>
    </div>
  </div>
</nav>
