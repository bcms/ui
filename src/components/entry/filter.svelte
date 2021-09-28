<script context="module" lang="ts">
  export const EntryFilterActions = {
    reset(): void {
      // Logic is added in a component instance
    },
  };
</script>

<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { DateInput, Select } from '../input';
  import {
    ClickOutsideService,
    cy,
    KeyboardService,
    LocalStorageService,
    StoreService,
  } from '../../services';
  import Button from '../button.svelte';
  import { ChevronDownIcon, SearchIcon } from '../icons';
  import type { EntryFilter, EntryLiteModified } from '../../types';
  import type { Language, Template } from '@becomes/cms-sdk';
  import { Router } from '@becomes/svelte-router';

  export let template: Template;
  export let entriesLiteModified: EntryLiteModified[] = [];
  export let language: Language;

  const languages = StoreService.get<Language[]>('language');
  const dispatch = createEventDispatcher();
  const closeFiltersDropdown = ClickOutsideService.bind(() => {
    filters.isOpen = false;
  });
  const keyboardUnsub = KeyboardService.subscribe(['i'], async (event) => {
    switch (event.key) {
      case 'i':
        {
          addEntry();
        }
        break;
    }
  });
  let filters = getFiltersInitialValue();
  let searchDebaunceTimer: NodeJS.Timeout;

  function addEntry() {
    LocalStorageService.set('lang', 'en');
    Router.navigate(`${window.location.pathname}/-`);
  }

  function getFiltersInitialValue(): EntryFilter {
    return {
      search: {
        name: '',
      },
      isOpen: false,
      options: [
        {
          label: 'Date Created',
          dateCreated: {
            year: -1,
            month: -1,
            day: -1,
          },
        },
        {
          label: 'Date Updated',
          dateUpdated: {
            year: -1,
            month: -1,
            day: -1,
          },
        },
      ],
    };
  }

  EntryFilterActions.reset = () => {
    filters = getFiltersInitialValue();
    dispatch('reset', filters);
  };

  onDestroy(() => {
    keyboardUnsub();
  });
</script>

<header>
  <div class="view--left">
    <h2 class="view--title mb-25">{template.label}</h2>
    <p class="view--description">{entriesLiteModified.length} entries found</p>
    <div class="view--search">
      <SearchIcon class="view--search-icon" />
      <input
        use:cy={'search'}
        class="view--search-input"
        type="text"
        placeholder="Search entries by Title or ID"
        bind:value={filters.search.name}
        on:keyup={async () => {
          clearTimeout(searchDebaunceTimer);
          searchDebaunceTimer = setTimeout(() => {
            dispatch('filter', filters);
          }, 300);
        }}
      />
      <button
        use:cy={'open-filters'}
        on:click={() => {
          filters.isOpen = !filters.isOpen;
        }}
        class="view--search-toggler {filters.isOpen
          ? 'view--search-toggler_active'
          : ''}"
      >
        <ChevronDownIcon />
      </button>
    </div>
    {#if filters.isOpen}
      <div
        use:cy={'filters'}
        class="entryOverview--filters"
        use:closeFiltersDropdown
      >
        {#each filters.options as option}
          <div class="entryOverview--filter">
            {#if option.dateCreated}
              <DateInput
                cyTag="date-created"
                label={option.label}
                value={option.dateCreated.year !== -1
                  ? `${option.dateCreated.year}-${option.dateCreated.month}-${option.dateCreated.day}`
                  : ''}
                on:input={async (event) => {
                  if (event.detail === 0) {
                    option.dateCreated = { year: -1, month: -1, day: -1 };
                  } else {
                    const date = new Date(event.detail);
                    option.dateCreated.year = date.getFullYear();
                    option.dateCreated.month = date.getMonth() + 1;
                    option.dateCreated.day = date.getDate();
                  }
                  dispatch('filter', filters);
                }}
              />
            {:else if option.dateUpdated}
              <DateInput
                cyTag="date-updated"
                label={option.label}
                value={option.dateUpdated.year !== -1
                  ? `${option.dateUpdated.year}-${option.dateUpdated.month}-${option.dateUpdated.day}`
                  : ''}
                on:input={async (event) => {
                  if (event.detail === 0) {
                    option.dateUpdated = { year: -1, month: -1, day: -1 };
                  } else {
                    const date = new Date(event.detail);
                    option.dateUpdated.year = date.getFullYear();
                    option.dateUpdated.month = date.getMonth() + 1;
                    option.dateUpdated.day = date.getDate();
                  }
                  dispatch('filter', filters);
                }}
              />
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
  <div class="view--right">
    {#if $languages.length > 1}
      <Select
        cyTag="select-lang"
        selected={language._id}
        options={$languages.map((e) => {
          return { label: `${e.name}`, value: e._id };
        })}
        on:change={(event) => {
          if (event.detail.value) {
            dispatch('selectLanguage', event.detail.value);
          }
        }}
      />
    {/if}
    <Button
      cyTag="add-new"
      on:click={() => {
        addEntry();
      }}
    >
      Add new
      {template.label.toLocaleLowerCase()}
    </Button>
  </div>
</header>
