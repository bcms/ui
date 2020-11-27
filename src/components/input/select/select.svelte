<script lang="ts">
  import InputWrapper from '../_wrapper.svelte';
  import type { SelectOption } from '../../../types';
  import { createEventDispatcher } from 'svelte';
  import * as uuid from 'uuid';

  export { className as class };
  export let label = '';
  export let placeholder = '';
  export let invalidText = '';
  export let disabled = false;
  export let selected: string = '';
  export let options: SelectOption[] = [];
  export let hasSearch: boolean = false;

  options = options.map((e) => {
    return {
      _id: uuid.v4(),
      ...e,
    };
  });

  let className = '';
  let isDropdownActive = false;
  let bcmsDropdownList: HTMLUListElement;

  const dispatch = createEventDispatcher();

  function toggleDropdown(state = undefined) {
    if (state !== undefined) {
      isDropdownActive = state;
    } else {
      isDropdownActive = !isDropdownActive;
    }
    if (isDropdownActive) {
      window.addEventListener('keydown', eventListeners);
    } else {
      window.removeEventListener('keydown', eventListeners);

      const focusedLi = bcmsDropdownList.querySelector(
        'li:focus'
      ) as HTMLLIElement;
      focusedLi?.blur();
    }
  }

  function eventListeners(event: KeyboardEvent) {
    const dropDown = {
      root: bcmsDropdownList as HTMLUListElement,
      active:
        (bcmsDropdownList?.querySelector('li:focus') as HTMLLIElement) ||
        (bcmsDropdownList?.querySelector(
          '.bcmsInput_dropdown--list-item_selected'
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
        toggleDropdown(false);
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
    toggleDropdown(false);
  }
  function getPlaceholderText() {
    if (!selected) {
      return placeholder;
    }
    const selectedOption = options.find((e) => e.value === selected);
    if (!selectOption) {
      return placeholder;
    }
    return selectedOption.label;
  }
</script>

<InputWrapper
  class="{className} bcmsInput_dropdown"
  {label}
  {invalidText}
  innerClass={isDropdownActive ? 'bcmsInput--inner_isActive' : ''}
  {hasSearch}
  on:search>
  <button
    aria-haspopup="listbox"
    aria-labelledby="bcmsDropdown_label bcmsDropdown_button"
    id="bcmsDropdown_button"
    type="button"
    class="bcmsInput_dropdown--toggler {(isDropdownActive || hasSearch) && !disabled ? 'bcmsInput_dropdown--toggler_active' : ''}"
    on:click={() => {
      toggleDropdown();
    }}
    {disabled}>
    <span
      class={!selected ? 'bcmsInput_dropdown--placeholder' : ''}>{getPlaceholderText()}</span>
    <i class="fas fa-chevron-down" />
  </button>
  {#if (isDropdownActive || hasSearch) && !disabled}
    <ul
      tabindex="-1"
      role="listbox"
      aria-labelledby="bcmsDropdown_label"
      class="bcmsInput_dropdown--list"
      bind:this={bcmsDropdownList}>
      {#each options as option}
        <li
          id={option._id}
          role="option"
          tabindex="-1"
          class="bcmsInput_dropdown--list-item {isItemSelected(option) ? 'bcmsInput_dropdown--list-item_selected' : ''}"
          data-value={option.value}
          on:keydown={(event) => {
            if (event.key === 'Enter') {
              selectOption(option);
            }
          }}
          on:click={() => {
            selectOption(option);
          }}>
          {#if hasSearch}
            <img src={`/assets/flags/${option.value}.jpg`} alt={option.label} />
          {/if}
          {option.label}
        </li>
      {/each}
    </ul>
  {/if}
</InputWrapper>
