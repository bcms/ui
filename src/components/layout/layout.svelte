<script lang="ts">
  import { onMount } from 'svelte';

  import { fly, blur } from 'svelte/transition';
  import { Router } from '../../router';
  import { LayoutBackground } from '../../services';
  import { SideNav } from './side-nav';

  let path = '';

  Router.subscribeToPathChange((_path) => {
    path = _path;
    LayoutBackground.set();
  });
  onMount(() => {
    LayoutBackground.set();
  });
</script>

{#if path.startsWith('/dashboard') && Router.isAvailable(path)}
  <div class="layout">
    <div
      class="layout--sideNav"
      in:fly={{ delay: 300, duration: 300, x: -250 }}>
      <SideNav />
      <!-- <TopNav /> -->
    </div>
    <div in:blur={{ delay: 450, duration: 500 }} class="layout--content">
      <slot />
    </div>
  </div>
{:else}
  <slot />
{/if}
