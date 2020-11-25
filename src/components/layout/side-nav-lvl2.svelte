<script lang="ts">
  import { beforeUpdate, createEventDispatcher, onMount } from 'svelte';
  import { GeneralService } from '../../services';
  import type { SelectOption } from '../../types';
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

  let pathname: string = '';
  let options: SelectOption[] = [];
  let selectedOption: SelectOption;

  function toggleSideNavSectionList({ target }) {
    target.classList.toggle('sideNav--section-toggler_active');
  }

  onMount(() => {
    pathname = window.location.pathname;
  });
  beforeUpdate(() => {
    pathname = window.location.pathname;

    options = items.map((e) => {
      return {
        label: e.name,
        value: e.name,
        _id: e.link,
      };
    });
    selectedOption = options.find((e) => e._id === pathname);
  });
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
    placeholder="Select {label.slice(0, -1)}"
    label="Select {label.slice(0, -1)}"
    {options}
    value={selectedOption}
    on:change={(event) => {
      GeneralService.navigate(event.detail);
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
