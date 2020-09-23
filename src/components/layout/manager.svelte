<script lang="ts">
  import { link } from 'svelte-routing';
  import { StoreService } from '../../services';
  import Button from '../button.svelte';

  interface Item {
    name: string;
    link: string;
    selected: boolean;
  }

  export let label = '';
  export let items: Item[] = [];
  export let actionText = '';
</script>

<div class="manager-layout">
  <div class="manager-layout--side-menu">
    <h3>{label}</h3>
    <div class="items">
      {#each items as item}
        <a
          class="item {item.selected ? 'selected' : ''}"
          href={item.link}
          use:link
          on:click={() => {
            StoreService.update('path', item.link);
          }}>
          <div class="icon fas fa-arrow-right" />
          <div class="name">{item.name}</div>
        </a>
      {/each}
    </div>
    <Button class="mt--auto" kind="ghost" icon="fas fa-plus">
      {actionText}
    </Button>
  </div>
  <div class="manager-layout--content">
    <slot />
  </div>
</div>
