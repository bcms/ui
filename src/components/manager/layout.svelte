<script lang="ts">
  import { blur } from 'svelte/transition';
  import type { RoleName } from '@becomes/cms-sdk';
  import ManagerSideNav from './side-nav.svelte';

  type Item = {
    name: string;
    link: string;
    selected: boolean;
    role?: RoleName;
  };

  export let label = '';
  export let items: Item[] = [];
  export let actionText = '';
</script>

<div
  in:blur={{ delay: 250, duration: 200 }}
  out:blur={{ duration: 200 }}
  class="managerLayout">
  {#if items && items.length > 0}
    <ManagerSideNav {label} {items} {actionText} on:action on:openItem />
  {/if}
  <div class="managerLayout--content">
    <div class="managerLayout--content-wrapper">
      <slot />
    </div>
  </div>
</div>
