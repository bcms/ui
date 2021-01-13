<script context="module" lang="ts">
  export const ExpendedSectionBuffer = {
    administration: true,
    plugins: false,
    entries: true,
    settings: false,
  };
</script>

<script lang="ts">
  import { onDestroy } from 'svelte';
  import { RoleName, Template, User } from '@becomes/cms-sdk';
  import {
    GeneralService,
    sdk,
    StoreService,
    SideNavService,
    ConfirmService,
    cy,
  } from '../../../services';
  import Link from '../../link.svelte';
  import type { BCMSPluginNavItem, NavItem } from '../../../types';
  import {
    EntryIcon,
    LogoIcon,
    NavIcon,
    SignOutIcon,
    WindIcon,
  } from '../../icons';
  import { Router } from '../../../router';
  import SideNavItem from './item.svelte';

  const pluginNavItems: BCMSPluginNavItem[] = GeneralService.pluginNavItems;
  const userUnsub = StoreService.subscribe('user', async (value: User[]) => {
    if (value && user) {
      const u = value.find((e) => e._id === user._id);
      if (u) {
        user = u;
        if (user.roles[0].name !== RoleName.ADMIN) {
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
                user.roles[0].name === RoleName.ADMIN
                  ? true
                  : userTemplatePolicy
                  ? userTemplatePolicy.get
                  : false,
            };
          });
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
  const pathUnsub = Router.subscribeToPathChange((path) => {
    setActive(path);
  });
  let plugins: Array<NavItem & { originalName: string }> = pluginNavItems.map(
    (e) => {
      return {
        icon: WindIcon,
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
  let settings: NavItem[] = [];
  let showAdministration = false;
  let showPlugins = plugins.length > 0;
  let showSettings = false;
  let isMobileNavOpen = false;
  let expendedSection = ExpendedSectionBuffer;

  function setActive(path: string) {
    if (administration && entries && settings) {
      administration = administration.map((item) => {
        let linkParts = item.link.split('/');
        if (linkParts[linkParts.length - 1] === '-') {
          linkParts = linkParts.splice(0, linkParts.length - 1);
        }
        if (path.startsWith(linkParts.join('/'))) {
          if (!expendedSection.administration) {
            expendedSection.administration = true;
          }
          item.selected = true;
        } else {
          item.selected = false;
        }
        return item;
      });
      entries = entries.map((item) => {
        if (path.startsWith(item.link)) {
          if (!expendedSection.entries) {
            expendedSection.entries = true;
          }
          item.selected = true;
        } else {
          item.selected = false;
        }
        return item;
      });
      settings = settings.map((item) => {
        if (path.startsWith(item.link.replace(/-/g, ''))) {
          if (!expendedSection.settings) {
            expendedSection.settings = true;
          }
          item.selected = true;
        } else {
          item.selected = false;
        }
        return item;
      });
      plugins = plugins.map((item) => {
        if (path.startsWith(item.link)) {
          if (!expendedSection.plugins) {
            expendedSection.plugins = true;
          }
          item.selected = true;
        } else {
          item.selected = false;
        }
        return item;
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
          user.roles[0].name === RoleName.ADMIN
            ? true
            : userTemplatePolicy
            ? userTemplatePolicy.get
            : false,
      };
    });
  }
  async function signout() {
    if (
      await ConfirmService.confirm(
        'Sign out',
        `Are you sure you want to sign out?`
      )
    ) {
      await GeneralService.errorWrapper(
        async () => {
          await sdk.user.logout();
        },
        async () => {
          window.location.href = '/';
        }
      );
    }
  }
  async function init() {
    if ((await sdk.isLoggedIn()) === false) {
      Router.navigate(
        `/?error=${encodeURIComponent('You are not logged in.')}`
      );
      return;
    }
    user = await SideNavService.getUser();
    if (!user) {
      Router.navigate(
        `/?error=${encodeURIComponent('You are not logged in.')}`
      );
      return;
    }
    if (user.roles[0].name !== RoleName.ADMIN) {
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
    settings = SideNavService.getSettings();
    entries = await SideNavService.getEntries();
    setActive(window.location.pathname);
    showAdministration = administration.find((e) => e.visible === true)
      ? true
      : false;
    showSettings = settings.find((e) => e.visible === true) ? true : false;
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
      for (const i in settings) {
        const item = settings[i];
        if (window.location.pathname.startsWith(item.link.replace(/-/g, ''))) {
          expendedSection.settings = true;
          foundNav = true;
          break;
        }
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
    if (isMobileNavOpen) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }
  }

  onDestroy(() => {
    pathUnsub();
    templateStoreUnsub();
    userUnsub();
  });
</script>

<nav
  use:cy={'side-nav'}
  class="sideNav {isMobileNavOpen ? 'is-active' : ''} customScrollbar">
  <div class="sideNav--top">
    <Link cyTag="go-home" href="/" class="sideNav--logo">
      <LogoIcon />
    </Link>
    <button
      use:cy={'open-nav-mob'}
      aria-label="Toggle navigation"
      on:click={toggleMobileNav}>
      <NavIcon />
    </button>
  </div>
  <div class="sideNav--wrapper">
    <div class="sideNav--inner">
      {#if showAdministration && administration}
        <SideNavItem
          cyTag="administration"
          item={{ type: 'parent', name: 'Administration', visible: true, selected: expendedSection.administration, children: administration.map(
              (e) => {
                return {
                  name: e.name,
                  selected: e.selected,
                  type: 'child',
                  visible: e.visible,
                  icon: e.icon,
                  onClick: e.link,
                };
              }
            ) }} />
      {/if}
      {#if showSettings && settings}
        <SideNavItem
          cyTag="settings"
          item={{ type: 'parent', name: 'Settings', visible: true, selected: expendedSection.settings, children: settings.map(
              (e) => {
                return {
                  name: e.name,
                  selected: e.selected,
                  type: 'child',
                  visible: e.visible,
                  icon: e.icon,
                  onClick: e.link,
                };
              }
            ) }} />
      {/if}
      {#if showPlugins}
        <SideNavItem
          cyTag="plugins"
          item={{ type: 'parent', name: 'Plugins', visible: true, selected: expendedSection.plugins, children: plugins.map(
              (e) => {
                return {
                  name: e.name,
                  selected: e.selected,
                  type: 'child',
                  visible: e.visible,
                  icon: e.icon,
                  onClick: e.link,
                };
              }
            ) }} />
      {/if}
      <SideNavItem
        cyTag="entries"
        item={{ type: 'parent', name: 'Entries', visible: true, selected: expendedSection.entries, children: entries.length === 0 ? [] : entries.map(
                  (e) => {
                    return {
                      name: e.name,
                      selected: e.selected,
                      ignoreSelected: true,
                      type: 'child',
                      visible: e.visible,
                      icon: e.icon,
                      onClick: e.link,
                    };
                  }
                ) }} />
      <button
        class="sideNav--logout"
        on:click={() => {
          signout();
        }}>
        <span class="sideNav--section-item-name">Sign out</span>
        <SignOutIcon />
      </button>
    </div>
  </div>
</nav>
