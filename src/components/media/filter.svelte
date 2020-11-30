<script context="module" lang="ts">
  export const MediaFilterActions = {
    reset(): void {
      // Logic is added in a component instance
    },
  };
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { MediaType } from '@becomes/cms-sdk';
  import { DateInput, Select } from '../input';
  import { StoreService } from '../../services';
  import type { MediaFilter } from '../../types';
  import Button from '../button.svelte';

  const dispatch = createEventDispatcher();
  let filters = getFiltersInitialValue();
  let searchDebaunceTimer: NodeJS.Timeout;

  function getFiltersInitialValue(): MediaFilter {
    return {
      search: {
        name: '',
      },
      isOpen: false,
      options: [
        {
          label: 'Type',
          dropdown: {
            items: [
              { label: 'Image', value: MediaType.IMG },
              { label: 'Video', value: MediaType.VID },
              { label: 'Directory', value: MediaType.DIR },
            ],
            selected: {
              label: 'No filters',
              value: '',
            },
          },
        },
        {
          label: 'Date Modified',
          date: {
            year: -1,
            month: -1,
            day: -1,
          },
        },
      ],
    };
  }

  MediaFilterActions.reset = () => {
    filters = getFiltersInitialValue();
    dispatch('reset', filters);
  };
</script>

<header>
  <div class="media--search view--left">
    <i class="fas fa-search" />
    <input
      class="media--search-input"
      type="text"
      placeholder="Search"
      bind:value={filters.search.name}
      on:keyup={async () => {
        clearTimeout(searchDebaunceTimer);
        searchDebaunceTimer = setTimeout(() => {
          dispatch('filter', filters);
        }, 300);
      }} />
    <button
      on:click={() => {
        filters.isOpen = !filters.isOpen;
      }}
      class="media--search-toggler {filters.isOpen ? 'media--search-toggler_active' : ''}">
      <i class="fas fa-chevron-down" />
    </button>
    {#if filters.isOpen}
      <div class="media--filters">
        {#each filters.options as option}
          <div class="media--filter">
            {#if option.dropdown}
              <Select
                placeholder="No filters"
                label={option.label}
                options={option.dropdown.items}
                selected={option.dropdown.selected.value}
                on:change={async (event) => {
                  option.dropdown.selected = event.detail;
                  dispatch('filter', filters);
                }} />
            {:else if option.date}
              <DateInput
                label={option.label}
                value={option.date.year !== -1 ? `${option.date.year}-${option.date.month}-${option.date.day}` : ''}
                on:input={async (event) => {
                  if (event.detail === 0) {
                    option.date = { year: -1, month: -1, day: -1 };
                  } else {
                    const date = new Date(event.detail);
                    option.date.year = date.getFullYear();
                    option.date.month = date.getMonth() + 1;
                    option.date.day = date.getDate();
                  }
                  dispatch('filter', filters);
                }} />
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
  <div class="view--right">
    <Button class="mr--20 uploadFileToggler">Upload file</Button>
    <Button
      kind="secondary"
      on:click={() => {
        StoreService.update('MediaAddUpdateFolderModal', true);
      }}>
      Create new folder
    </Button>
  </div>
</header>
