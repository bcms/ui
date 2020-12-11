<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { SideNavItemType } from '../../../types';
  import { CaretRightIcon } from '../../icons';
  import Link from '../../link.svelte';
  import { cy } from '../../../services';

  export let item: SideNavItemType;
  export let cyTag: string = undefined;

  const dispatch = createEventDispatcher();
  let extended: boolean = item.selected;

  function toggle() {
    extended = !extended;
    dispatch('toggle', extended);
  }
</script>

{#if item.type === 'parent'}
  <div use:cy={cyTag} class="sideNav--section">
    <button
      class="sideNav--section-toggler {extended ? 'sideNav--section-toggler_active' : ''}"
      on:click={toggle}>
      <CaretRightIcon />
      <span>{item.name}</span>
    </button>
    <ul class="sideNav--section-items">
      {#each item.children as child}
        <svelte:self item={child} cyTag="{cyTag}-{child.name}" />
      {/each}
    </ul>
  </div>
{:else}
  {#if item.visible}
    <li
      use:cy={cyTag}
      class="sideNav--section-item {item.selected ? 'sideNav--section-item_selected' : ''}">
      {#if typeof item.onClick === 'string'}
        <Link href={item.onClick} disabled={item.selected}>
          <span class="sideNav--section-item-name">{item.name}</span>
          <span class="sideNav--section-item-icon">
            {#if item.icon}
              <svelte:component this={item.icon} />
            {/if}
          </span>
        </Link>
      {:else}
        <Link href="" disabled={true} on:click={item.onClick}>
          <span class="sideNav--section-item-name">{item.name}</span>
          <span class="sideNav--section-item-icon">
            {#if item.icon}
              <svelte:component this={item.icon} />
            {/if}
          </span>
        </Link>
      {/if}
    </li>
  {/if}
{/if}
