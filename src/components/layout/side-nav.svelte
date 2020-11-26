<script context="module" lang="ts">
  export const ExpendedSectionBuffer = {
    administration: false,
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
        expendedSection[key] = false;
      }
    }
  }

  onDestroy(() => {
    pathUnsub();
    templateStoreUnsub();
    userUnsub();
  });
</script>

<nav class="sideNav {isMobileNavOpen ? 'is-active' : ''}">
  <div class="sideNav--top">
    <Link href="/" class="sideNav--logo">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 25">
        <path
          fill="#FDFDFD"
          d="M0 23.798h12.064c5.784 0 8.759-2.975 8.759-6.776 0-2.38-1.09-3.801-2.248-4.594a7.154 7.154 0 00-2.214-1.025v-.165a6.208 6.208 0 001.818-.893c.892-.694 1.818-1.917 1.818-3.9 0-3.14-2.678-5.784-7.602-5.784H0v23.137zM6.115 9.585V5.62h4.957c1.686 0 2.48.826 2.48 1.983s-.794 1.983-2.48 1.983H6.115zm0 9.255v-4.627h5.288c2.148 0 3.14.991 3.14 2.313s-.992 2.314-3.14 2.314H6.115z" />
        <path
          fill="#FDFDFD"
          d="M22.16 12.23c0 6.94 5.289 12.229 12.89 12.229 5.025 0 8.099-2.38 9.884-4.793a13.812 13.812 0 002.346-4.793H41a5.343 5.343 0 01-1.123 1.984c-.893 1.024-2.314 1.983-4.826 1.983-3.801 0-6.445-2.644-6.445-6.61 0-3.967 2.644-6.611 6.445-6.611 2.247 0 3.669.86 4.561 1.752.529.495.926 1.09 1.223 1.718h6.28a13.221 13.221 0 00-2.248-4.528C43.117 2.314 40.042 0 35.051 0c-7.602 0-12.89 5.288-12.89 12.23z" />
        <path
          fill="#FDFDFD"
          d="M49.435 23.798h6.115V10.577l-.496-2.975h.33l4.463 10.907h6.775l4.462-10.907h.33l-.495 2.975v13.22h6.115V.662H68.44L63.648 12.56h-.827L58.03.66h-8.594v23.137z" />
        <path
          fill="#FDFDFD"
          d="M79.012 16.36c.43 1.521 1.09 2.876 2.016 4.066 1.587 2.017 4.33 4.033 9.056 4.033 6.578 0 9.916-3.636 9.916-7.602 0-5.223-5.388-6.445-9.354-7.404-2.446-.562-4.363-1.19-4.363-2.512 0-.826.793-1.653 3.14-1.653 1.686 0 2.611.496 3.14.992.298.297.53.628.661.992h6.28c-.297-1.356-.86-2.579-1.685-3.636C96.43 1.818 93.885 0 89.423 0c-6.081 0-9.585 3.437-9.585 7.272 0 4.197 3.405 5.784 6.875 6.742 3.437.893 6.842 1.421 6.842 3.173 0 1.025-.992 1.983-3.47 1.983-1.984 0-3.207-.694-3.9-1.388a3.716 3.716 0 01-.893-1.421h-6.28z" />
      </svg>
    </Link>
    <button aria-label="Toggle navigation" on:click={toggleMobileNav}>
      <i class="icon fas fa-bars" />
    </button>
    <ul class="sideNav--items">
      {#each plugins as item}
        {#if item.visable}
          <li
            class="sideNav--item {item.selected ? 'sideNav--item_selected' : ''}">
            <Link href={item.link}>
              <div class="name">{item.name}</div>
              <div class="icon"><img src={item.icon} alt={item.name} /></div>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 4 8"><path d="M4 4L0 8V0l4 4z" /></svg>
            <span>Administration</span>
          </button>
          <ul class="sideNav--items">
            {#each administration as item}
              {#if item.visable}
                <li
                  class="sideNav--item {item.selected ? 'sideNav--item_selected' : ''}">
                  <Link href={item.link}>
                    <div class="name">{item.name}</div>
                    <div class="icon {item.icon}" />
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 4 8"><path d="M4 4L0 8V0l4 4z" /></svg>
            <span>Plugins</span>
          </button>
          <ul class="sideNav--items">
            {#each plugins as item}
              <li
                class="sideNav--item {item.selected ? 'sideNav--item_selected' : ''}">
                <Link href={item.link}>
                  <div class="name">{item.name}</div>
                  <div class="icon">
                    <img src={item.icon} alt={item.name} />
                  </div>
                </Link>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      {#if showEntries}
        <div class="sideNav--section">
          <button
            class="sideNav--section-toggler {expendedSection.entries ? 'sideNav--section-toggler_active' : ''}"
            on:click={() => {
              toggleSection('entries');
            }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 4 8"><path d="M4 4L0 8V0l4 4z" /></svg>
            <span>Entries</span></button>
          <ul class="sideNav--items">
            {#each entries as item}
              {#if item.visable}
                <li
                  class="sideNav--item {item.selected ? 'sideNav--item_selected' : ''}">
                  <Link href={item.link}>
                    <div class="name">{item.name}</div>
                    <div class="icon {item.icon}" />
                  </Link>
                </li>
              {/if}
            {/each}
          </ul>
        </div>
      {/if}
      <button
        class="sideNav--logout"
        on:click={() => {
          signout();
        }}>
        <div class="name">Sign out</div>
        <div class="icon fas fa-sign-out-alt" />
      </button>
    </div>
  </div>
</nav>
