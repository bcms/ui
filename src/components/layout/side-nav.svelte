<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fly } from 'svelte/transition';
  import { GeneralService, sdk, StoreService } from '../../services';
  import Link from '../link.svelte';
  import type { Template, User } from '@becomes/cms-sdk';

  interface Item {
    name: string;
    icon: string;
    link: string;
    visable: boolean;
    selected: boolean;
  }
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
  let user: User;
  let administration: Item[] = [];
  let entries: Item[] = [];
  let webhooks: Item[] = [];
  let showAdministration = false;
  let showEntries = false;
  let showWebhooks = false;

  function setActive(path: string) {
    administration = administration.map((item) => {
      let linkParts = item.link.split('/');
      if (linkParts[linkParts.length - 1] === '-') {
        linkParts = linkParts.splice(0, linkParts.length - 1);
      }
      if (path.startsWith(linkParts.join('/'))) {
        item.selected = true;
      } else {
        item.selected = false;
      }
      return item;
    });
    entries = entries.map((item) => {
      if (path.startsWith(item.link)) {
        item.selected = true;
      } else {
        item.selected = false;
      }
      return item;
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
  }
  async function signout() {
    if (confirm('Are you sure you want to sign out?')) {
      await sdk.user.logout();
      window.location.href = '/';
    }
  }

  onMount(async () => {
    if ((await sdk.isLoggedIn()) === false) {
      GeneralService.navigate('/');
      return;
    }
    user = await sdk.user.get();

    administration = [
      {
        name: 'Template Manager',
        link: '/dashboard/template/editor/-',
        icon: 'fas fa-cubes',
        visable: false,
        selected: false,
      },
      {
        name: 'Group Manager',
        link: '/dashboard/group/editor/-',
        icon: 'fas fa-layer-group',
        visable: false,
        selected: false,
      },
      {
        name: 'Widget Manager',
        link: '/dashboard/widget/editor/-',
        icon: 'fas fa-pepper-hot',
        visable: false,
        selected: false,
      },
      {
        name: 'Media Manager',
        link: '/dashboard/media/editor',
        icon: 'fa fa-folder',
        visable: false,
        selected: false,
      },
      {
        name: 'Language Manager',
        link: '/dashboard/language/editor/-',
        icon: 'fas fa-globe-europe',
        visable: false,
        selected: false,
      },
      {
        name: 'Users Manager',
        link: '/dashboard/user/editor/-',
        icon: 'fas fa-users',
        visable: false,
        selected: false,
      },
      {
        name: 'Key Manager',
        link: '/dashboard/key/editor/-',
        icon: 'fas fa-key',
        visable: false,
        selected: false,
      },
      // {
      //   name: 'Function Manager',
      //   link: '/dashboard/function/editor/-',
      //   icon: 'fas fa-feather-alt',
      //   visable: false,
      //   selected: false,
      // },
      {
        name: 'Custom Portal',
        link: '/dashboard/custom',
        icon: 'fas fa-magic',
        visable: false,
        selected: false,
      },
    ];
    administration.forEach((item) => {
      if (user.roles[0].name === 'ADMIN') {
        item.visable = true;
      } else {
        if (
          item.link === '/dashboard/media/editor' &&
          user.customPool.policy.media.get === true
        ) {
          item.visable = true;
        }
        if (
          item.link === '/dashboard/custom' &&
          user.customPool.policy.customPortal.get === true
        ) {
          item.visable = true;
        }
      }
    });
    setActive(window.location.pathname);
    parseEntries(await sdk.template.getAll());
    showAdministration = administration.find((e) => e.visable === true)
      ? true
      : false;
    showEntries = entries.length > 0;
    showWebhooks = webhooks.length > 0;
  });
  onDestroy(() => {
    pathUnsub();
    templateStoreUnsub();
  });
</script>

<div in:fly={{ delay: 400, duration: 300, x: -250 }} class="layout--side-nav">
  <h1>BCMS</h1>
  <button
    class="layout--side-nav-logout"
    on:click={() => {
      signout();
    }}>
    <div class="icon fas fa-sign-out-alt" />
    <div class="name">Sign out</div>
  </button>
  {#if showAdministration}
    <div class="layout--side-nav-section">
      <h2>ADMINISTRATION</h2>
      <div class="items">
        {#each administration as item}
          {#if item.visable}
            <Link
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
  {#if showWebhooks}
    <div class="layout--side-nav-section">
      <h2>WEBHOOKS</h2>
      <div class="items">
        {#each webhooks as item}
          {#if item.visable}
            <Link
              class="item {item.selected ? 'selected' : ''}"
              href="{item.link}}">
              <div class="icon {item.icon}" />
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
</div>
