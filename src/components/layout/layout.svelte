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
  import { fade, blur, fly } from 'svelte/transition';
  import SideNav from './side-nav.svelte';

  const animate = LayoutLatch.animate();
</script>

{#if animate}
  <div in:fade class="layout">
    <div
      in:fly={{ delay: 300, duration: animate ? 300 : 0, x: -250 }}
      class="layout--side-nav">
      <SideNav />
    </div>
    <div in:blur={{ delay: 600 }} class="layout--content">
      <slot />
    </div>
  </div>
{:else}
  <div class="layout">
    <div class="layout--side-nav">
      <SideNav />
    </div>
    <div
      in:fade={{ delay: 250 }}
      out:fade={{ duration: 200 }}
      class="layout--content">
      <slot />
    </div>
  </div>
{/if}
