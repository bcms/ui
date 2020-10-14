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
  import { fade, blur, fly } from 'svelte/transition';
  import SideNav from './side-nav.svelte';
  import TopNav from './top-nav.svelte';

  const animate = LayoutLatch.animate();

  onMount(() => {
    document.body.setAttribute('style', 'top: 40px; left: 250px;');
  });
</script>

<style global lang="scss">
  body {
    top: 40px;
    left: 250px;
  }
</style>

{#if animate}
  <div in:fade class="layout">
    <div
      in:fly={{ delay: 300, duration: animate ? 300 : 0, x: -250 }}
      class="sideNav">
      <SideNav />
      <TopNav />
    </div>
    <div in:blur={{ delay: 600 }} class="layout--content">
      <slot />
    </div>
  </div>
{:else}
  <div class="layout">
    <div class="sideNav">
      <SideNav />
      <TopNav />
    </div>
    <div
      in:fade={{ delay: 250 }}
      out:fade={{ duration: 200 }}
      class="layout--content">
      <slot />
    </div>
  </div>
{/if}
