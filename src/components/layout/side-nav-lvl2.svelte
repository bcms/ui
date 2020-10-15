<script lang="ts">
  import { createEventDispatcher } from 'svelte';
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
  <button
    class="sideNav_lvl2--addNewBtn"
    on:click={() => {
      dispatch('action');
    }}>
    <span>{actionText}</span>
  </button>
</div>
