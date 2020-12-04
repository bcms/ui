<script lang="ts">
  import ManagerSideNav from './side-nav.svelte';

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
  {#if items && items.length > 0}
    <ManagerSideNav {label} {items} {actionText} on:action />
  {/if}
  <div class="managerLayout--content">
    <div class="managerLayout--content-wrapper">
      <slot />
    </div>
  </div>
</div>
