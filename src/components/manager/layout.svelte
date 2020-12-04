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
  <div class="managerLayout--inner">
    <ManagerSideNav {label} {items} {actionText} on:action />
  </div>
  <div class="managerLayout--content">
    <div class="managerLayout--content-wrapper">
      <slot />
    </div>
  </div>
</div>
