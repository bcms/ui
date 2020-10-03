<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import Button from '../button.svelte';
  import Link from '../link.svelte';

  type Item = {
    name: string;
    link: string;
    selected: boolean;
  }

  export let label = '';
  export let items: Item[] = [];
  export let actionText = '';

  const dispatch = createEventDispatcher();
</script>

<div
  class="manager-layout">
  <div class="manager-layout--side-menu">
    <h3>{label}</h3>
    <div class="items">
      {#each items as item}
        <Link class="item {item.selected ? 'selected' : ''}" href={item.link}>
          <div class="icon fas fa-arrow-right" />
          <div class="name">{item.name}</div>
        </Link>
      {/each}
    </div>
    <Button
      class="mt--auto"
      kind="ghost"
      icon="fas fa-plus"
      on:click={() => {
        dispatch('action');
      }}>
      {actionText}
    </Button>
  </div>
  <div class="manager-layout--content">
    <div class="manager-layout--content-wrapper">
      <slot />
    </div>
  </div>
</div>
