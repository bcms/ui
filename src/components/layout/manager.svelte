<script lang="ts">
  import SideNavLvl2 from './side-nav-lvl2.svelte';
  import { fly } from 'svelte/transition';

  type Item = {
    name: string;
    link: string;
    selected: boolean;
  };

  export let label = '';
  export let items: Item[] = [];
  export let actionText = '';
</script>

<div class="manager-layout">
  <div in:fly={{ delay: 500, duration: 500, x: -50 }}>
    <SideNavLvl2 {label} {items} {actionText} on:action />
  </div>
  <div class="manager-layout--content">
    <div class="manager-layout--content-wrapper">
      <slot />
    </div>
  </div>
</div>
