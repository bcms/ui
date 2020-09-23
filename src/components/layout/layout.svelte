<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, blur } from 'svelte/transition';
  import SideNav from './side-nav.svelte';

  let render = false;
  let show = false;

  onMount(() => {
    if (window.location.pathname.startsWith('/dashboard')) {
      render = true;
    }
    show = true;
  });
</script>

{#if render}
  {#if show}
    <div in:fade class="layout">
      <SideNav />
      <div in:blur={{ delay: 600 }} class="layout--content">
        <slot />
      </div>
    </div>
  {/if}
{:else}
  <slot />
{/if}
