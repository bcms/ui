<script lang="ts">
  import ManagerSideNav from './side-nav.svelte';
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

<div class="managerLayout">
  <div in:fly={{ delay: 500, duration: 500, x: -50 }}>
    <ManagerSideNav {label} {items} {actionText} on:action />
  </div>
  <div class="managerLayout--content">
    <div class="managerLayout--content-wrapper">
      <slot />
    </div>
  </div>
</div>
