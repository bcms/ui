<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { GeneralService } from '../../services';
  import { CaretRightIcon } from '../icons';
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

<div class="managerLayout--sideNav">
  <div class="managerLayout--sideNav--body">
    <button
      class="sideNav--section-toggler sideNav--section-toggler_active"
      on:click={(event) => toggleSideNavSectionList(event)}>
      <CaretRightIcon />
      <span>{label}</span>
    </button>
    <ul class="sideNav--items">
      {#each items as item}
        <li
          class="sideNav--item {item.selected ? 'sideNav--item_selected' : ''}">
          <Link href={item.link}>
            <span class="sideNav--item-name">{item.name}</span>
          </Link>
        </li>
      {/each}
    </ul>
    <Select
      class="managerLayout--sideNav--select"
      placeholder="Select {label}"
      label="Select {label}"
      options={items.map((e) => {
        return { label: e.name, value: e.link };
      })}
      disabled={items.length === 0}
      selected={items.find((e) => e.selected) ? items.find((e) => e.selected).link : ''}
      on:change={(event) => {
        GeneralService.navigate(event.detail.value);
      }} />
  </div>
  <div class="managerLayout--sideNav--footer">
    <div class="managerLayout--sideNav--footer-inner">
      <Button
        class="managerLayout--sideNav--addNewBtn"
        size="m"
        on:click={() => {
          dispatch('action');
        }}>
        {actionText}
      </Button>
    </div>
  </div>
</div>
