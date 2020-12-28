<script lang="ts">
  import { RoleName } from '@becomes/cms-sdk';
  import { createEventDispatcher } from 'svelte';
  import { Router } from '../../router';
  import { AdminIcon, CaretRightIcon } from '../icons';
  import { Button } from '../index';
  import { Select } from '../index';
  import Link from '../link.svelte';

  type Item = {
    name: string;
    link: string;
    selected: boolean;
    role?: RoleName;
  };

  export let label: string = '';
  export let items: Item[] = [];
  export let actionText: string = '';

  const dispatch = createEventDispatcher();

  function toggleSideNavSectionList({ target }) {
    if (target.tagName === 'svg') {
      target.parentNode.classList.toggle('sideNav--section-toggler_active');
    } else {
      target.classList.toggle('sideNav--section-toggler_active');
    }
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
    <ul class="sideNav--section-items">
      {#each items as item}
        <li
          class="sideNav--section-item {item.selected ? 'sideNav--section-item_selected' : ''}">
          <Link
            href={item.link}
            on:click={() => {
              dispatch('openItem', item);
            }}>
            <span class="sideNav--section-item-name"> {item.name} </span>
            {#if item.role && item.role === RoleName.ADMIN}
              <span class="sideNav--section-item-icon">
                <AdminIcon />
              </span>
            {/if}
          </Link>
        </li>
      {/each}
    </ul>
    <Select
      cyTag="managerSideNav"
      class="managerLayout--sideNav--select"
      placeholder="Select {label}"
      label="Select {label}"
      options={items.map((e) => {
        return { label: e.name, value: e.link };
      })}
      disabled={items.length === 0}
      selected={items.find((e) => e.selected) ? items.find((e) => e.selected).link : ''}
      on:change={(event) => {
        Router.navigate(event.detail.value);
      }} />
  </div>
  {#if actionText}
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
  {/if}
</div>
