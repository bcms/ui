<script context="module" lang="ts">
  function layoutLatch() {
    let animate = true;
    return {
      animate() {
        if (animate) {
          animate = false;
          return true;
        }
        return false;
      },
    };
  }
  export const LayoutLatch = layoutLatch();
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { LayoutBackground } from '../../services';
  import SideNav from './side-nav.svelte';
  // TODO: Style top nav
  // import TopNav from './top-nav.svelte';

  const animate = LayoutLatch.animate();

  onMount(() => {
    LayoutBackground.set();
  });
</script>

{#if animate}
  <div in:fade class="layout">
    <div
      class="layout--sideNav"
      in:fly={{ delay: 300, duration: animate ? 300 : 0, x: -250 }}>
      <SideNav />
      <!-- <TopNav /> -->
    </div>
    <div class="layout--content">
      <slot />
    </div>
  </div>
{:else}
  <div class="layout">
    <div>
      <SideNav />
      <!-- <TopNav /> -->
    </div>
    <div
      in:fade={{ delay: 250 }}
      out:fade={{ duration: 200 }}
      class="layout--content">
      <slot />
    </div>
  </div>
{/if}
