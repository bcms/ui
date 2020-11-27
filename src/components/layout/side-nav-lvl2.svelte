<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { GeneralService } from '../../services';
  import { Button } from '../index';
  import { Select } from '../index';
  import Link from '../link.svelte';

  type Item = {
    name: string;
    link: string;
    selected: boolean;
  };

  export let label: string = '';
  export let items: Item[] = [];
  export let actionText: string = '';

  const dispatch = createEventDispatcher();

  function toggleSideNavSectionList({ target }) {
    target.classList.toggle('sideNav--section-toggler_active');
  }
</script>

<div class="sideNav_lvl2">
  <button
    class="sideNav--section-toggler sideNav--section-toggler_active"
    on:click={(event) => toggleSideNavSectionList(event)}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 4 8"><path
        d="M4 4L0 8V0l4 4z" /></svg>
    <span>{label}</span>
  </button>
  <ul class="sideNav--items">
    {#each items as item}
      <li class="sideNav--item {item.selected ? 'sideNav--item_selected' : ''}">
        <Link href={item.link}>
          <div class="name">{item.name}</div>
        </Link>
      </li>
    {/each}
  </ul>
  <Select
    class="sideNav_lvl2--select"
    placeholder="Select {label}"
    label="Select {label}"
    options={items.map(e => {
      return {
        label: e.name,
        value: e.link,
      }
    })}
    disabled={items.length === 0}
    selected={items.find(e => e.selected) ? items.find(e => e.selected).link : ''}
    on:change={(event) => {
      GeneralService.navigate(event.detail.value);
    }} />
  <Button
    class="sideNav_lvl2--addNewBtn"
    size="m"
    on:click={() => {
      dispatch('action');
    }}>
    {actionText}
  </Button>
</div>
