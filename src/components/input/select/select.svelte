<script lang="ts">
  import * as uuid from 'uuid';
  import InputWrapper from '../_input.svelte';
  import type { SelectOption } from '../../../types';
  import { beforeUpdate, createEventDispatcher } from 'svelte';
  import { ClickOutsideService, cy } from '../../../services';
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
  export let cyTag: string = undefined;

  const inputId = uuid.v4();
  const scrollerId = uuid.v4();
  const dispatch = createEventDispatcher();
  let className = '';
  let isDropdownActive = false;
  let bcmsDropdownList: HTMLUListElement;
  let filteredOptions: SelectOption[] = options.map((e) => {
    return {
      _id: uuid.v4(),
      ...e,
    };
  });
  let selectedOption: SelectOption;

  const closeDropdown = ClickOutsideService.bind(() => {
    if (isDropdownActive) {
      toggleDropdown('clickOutside');
    }
  });

  function toggleDropdown(from: string) {
    if (from === 'button' && isDropdownActive) {
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
        toggleDropdown('Escape');
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
  }
  function handleSearchInput(event: Event) {
    const element = event.target as HTMLInputElement;
    if (!element) {
      return;
    }
    const searchString = element.value.toLowerCase();
    filteredOptions = options
      .filter(
        (option) =>
          option.value.toLowerCase().includes(searchString) ||
          option.label.toLowerCase().includes(searchString)
      )
      .sort((a, b) => (b.special ? -1 : b.label < a.label ? 1 : -1));
  }
  beforeUpdate(() => {
    selectedOption = options.find((e) => e.value === selected);
    if (
      !hasSearch &&
      (filteredOptions.length > options.length ||
        JSON.stringify(filteredOptions) !== JSON.stringify(options))
    ) {
      filteredOptions = options
        .map((e) => {
          return {
            _id: uuid.v4(),
            ...e,
          };
        })
        .sort((a, b) => (b.special ? -1 : b.label < a.label ? 1 : -1));
    }
  });
</script>

<InputWrapper
  id={inputId}
  class="{className} _bcmsInput_selectWidth"
  {label}
  {invalidText}
  {helperText}
>
  <div use:cy={cyTag} class="_bcmsInput--select">
    {#if hasSearch}
      <div class="_bcmsInput--select-search">
        <SearchIcon />
        <input
          id={label ? label : inputId}
          class="_bcmsInput--select-search-input"
          type="text"
          placeholder="Search"
          on:keyup={handleSearchInput}
        />
      </div>
    {:else}
      <button
        id={label ? label : inputId}
        aria-haspopup="listbox"
        aria-labelledby="bcmsSelect_label bcmsSelect_button"
        type="button"
        class="_bcmsInput--select-toggler {(isDropdownActive || hasSearch) &&
        !disabled
          ? '_bcmsInput--select-toggler_active'
          : ''}"
        on:click={() => {
          if (!isDropdownActive) {
            toggleDropdown('button');
          }
        }}
        {disabled}
      >
        <span class={!selected ? '_bcmsInput--select-placeholder' : ''}
          >{selectedOption ? selectedOption.label : placeholder}</span
        >
        <ChevronDownIcon />
      </button>
    {/if}
    {#if (isDropdownActive || hasSearch) && !disabled}
      <ul
        id={scrollerId}
        use:cy={cyTag ? cyTag + '-select' : undefined}
        use:closeDropdown
        tabindex="-1"
        role="listbox"
        aria-labelledby="bcmsSelect_label"
        class="_bcmsInput--select-list {hasSearch
          ? '_bcmsInput--select-search-list'
          : ''} customScrollbar"
        bind:this={bcmsDropdownList}
      >
        {#each filteredOptions as option, i}
          <li
            id={option._id}
            use:cy={cyTag ? `${cyTag}-select-item-${i}` : undefined}
            role="option"
            tabindex="0"
            class="_bcmsInput--select-list-item {isItemSelected(option)
              ? '_bcmsInput--select-list-item_selected'
              : ''} {option.special
              ? `_bcmsInput--select-list-item_${option.special}`
              : ''}"
            data-value={option.value}
            on:keydown={(event) => {
              if (event.key === 'Enter') {
                selectOption(option);
              }
            }}
            on:click={() => {
              selectOption(option);
            }}
          >
            {#if option.imgUrl}
              <img src={option.imgUrl} alt={option.label} />
            {/if}
            {option.label ? option.label : option.value}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</InputWrapper>
