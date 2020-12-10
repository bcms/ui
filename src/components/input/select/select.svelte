<script lang="ts">
  import InputWrapper from '../_input.svelte';
  import type { SelectOption } from '../../../types';
  import { beforeUpdate, createEventDispatcher } from 'svelte';
  import * as uuid from 'uuid';
  import { ClickOutsideService } from '../../../services';
  import { ChevronDownIcon, SearchIcon } from '../../icons';

  export { className as class };
  export let label = '';
  export let placeholder = '';
  export let invalidText = '';
  export let helperText: string = undefined;
  export let disabled = false;
  export let selected: string = '';
  export let options: SelectOption[] = [];
  export let hasSearch: boolean = false;

  const scrollerId = uuid.v4();
  const dispatch = createEventDispatcher();
  let className = '';
  let isDropdownActive = false;
  let bcmsDropdownList: HTMLUListElement;
  let stateLatch = false;
  let filteredOptions: SelectOption[] = options.map((e) => {
    return {
      _id: uuid.v4(),
      ...e,
    };
  });

  const closeDropdown = ClickOutsideService.bind(() => {
    toggleDropdown();
    stateLatch = true;
  });

  function toggleDropdown() {
    if (stateLatch) {
      stateLatch = false;
      return;
    }
    isDropdownActive = !isDropdownActive;
    if (isDropdownActive) {
      window.addEventListener('keydown', eventListeners);
    } else {
      window.removeEventListener('keydown', eventListeners);
    }
  }
  function eventListeners(event: KeyboardEvent) {
    const dropDown = {
      root: bcmsDropdownList as HTMLUListElement,
      active:
        (bcmsDropdownList?.querySelector('li:focus') as HTMLLIElement) ||
        (bcmsDropdownList?.querySelector(
          '._bcmsInput--select-list-item_selected'
        ) as HTMLLIElement),
      firstItem: bcmsDropdownList?.querySelector(
        'li:first-child'
      ) as HTMLLIElement,
      lastItem: bcmsDropdownList?.querySelector(
        'li:last-child'
      ) as HTMLLIElement,
    };

    switch (event.key) {
      case 'Escape': // 'ESC' - Close dropdown
        event.preventDefault();
        toggleDropdown();
        break;

      case 'ArrowUp': // 'ARROW UP' - Move up
        event.preventDefault();
        if (!dropDown.active || !dropDown.active?.previousSibling) {
          dropDown.lastItem.focus();
        } else {
          const prevSibl = dropDown.active.previousSibling as HTMLLIElement;
          prevSibl.focus();
        }
        break;

      case 'ArrowDown': // 'ARROW DOWN - Move down
        event.preventDefault();
        if (!dropDown.active || !dropDown.active?.nextSibling) {
          dropDown.firstItem.focus();
        } else {
          const nextSibling = dropDown.active.nextSibling as HTMLLIElement;
          nextSibling.focus();
        }
        break;

      default:
        break;
    }
  }
  function isItemSelected(item: SelectOption) {
    return item.value === selected;
  }
  function selectOption(option: SelectOption) {
    if (option.value === selected) {
      dispatch('change', { label: '', value: '' });
    } else {
      dispatch('change', {
        label: option.label,
        value: option.value,
        _id: option._id || '',
      });
    }
    toggleDropdown();
  }
  function getPlaceholderText(_selected: string) {
    if (!_selected) {
      return placeholder;
    }
    const selectedOption = options.find((e) => e.value === _selected);
    if (!selectOption) {
      return placeholder;
    }
    return selectedOption.label;
  }
  function handleSearchInput(event: Event) {
    const element = event.target as HTMLInputElement;
    if (!element) {
      return;
    }
    const searchString = element.value.toLowerCase();
    filteredOptions = options.filter(
      (option) =>
        option.value.toLowerCase().includes(searchString) ||
        option.label.toLowerCase().includes(searchString)
    );
  }
  beforeUpdate(() => {
    if (
      !hasSearch &&
      (filteredOptions.length > options.length ||
        JSON.stringify(filteredOptions) !== JSON.stringify(options))
    ) {
      filteredOptions = options.map((e) => {
        return {
          _id: uuid.v4(),
          ...e,
        };
      });
    }
  });
</script>

<InputWrapper class="{className} _bcmsInput_selectWidth" {label} {invalidText} {helperText}>
  <div class="_bcmsInput--select">
    {#if hasSearch}
      <div class="_bcmsInput--select-search">
        <SearchIcon />
        <input
          class="_bcmsInput--select-search-input"
          type="text"
          placeholder="Search"
          on:keyup={handleSearchInput} />
      </div>
    {:else}
      <button
        aria-haspopup="listbox"
        aria-labelledby="bcmsSelect_label bcmsSelect_button"
        id="bcmsSelect_button"
        type="button"
        class="_bcmsInput--select-toggler {(isDropdownActive || hasSearch) && !disabled ? '_bcmsInput--select-toggler_active' : ''}"
        on:click={() => {
          toggleDropdown();
        }}
        {disabled}>
        <span
          class={!selected ? '_bcmsInput--select-placeholder' : ''}>{getPlaceholderText(selected)}</span>
        <ChevronDownIcon />
      </button>
    {/if}
    {#if (isDropdownActive || hasSearch) && !disabled}
      <ul
        id={scrollerId}
        use:closeDropdown
        tabindex="-1"
        role="listbox"
        aria-labelledby="bcmsSelect_label"
        class="_bcmsInput--select-list {hasSearch ? '_bcmsInput--select-search-list' : ''} customScrollbar"
        bind:this={bcmsDropdownList}>
        {#each filteredOptions as option}
          <li
            id={option._id}
            role="option"
            tabindex="-1"
            class="_bcmsInput--select-list-item {isItemSelected(option) ? '_bcmsInput--select-list-item_selected' : ''}"
            data-value={option.value}
            on:keydown={(event) => {
              if (event.key === 'Enter') {
                selectOption(option);
              }
            }}
            on:click={() => {
              selectOption(option);
            }}>
            {#if option.imgUrl}
              <img src={option.imgUrl} alt={option.label} />
            {/if}
            {option.label}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</InputWrapper>
