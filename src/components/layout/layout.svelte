<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { fly, blur } from 'svelte/transition';
  import { Router } from '../../router';
  import { KeyboardService, LayoutBackground } from '../../services';
  import { SideNav } from './side-nav';

  const keyboardUnsub = KeyboardService.subscribe(
    ['ArrowLeft', 'ArrowRight'],
    async (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          {
            Router.back();
          }
          break;
        case 'ArrowRight':
          {
            Router.forward();
          }
          break;
      }
    }
  );
  let path = '';

  Router.subscribeToPathChange((_path) => {
    path = _path;
    LayoutBackground.set();
  });
  onMount(() => {
    LayoutBackground.set();
  });
  onDestroy(() => {
    keyboardUnsub();
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
