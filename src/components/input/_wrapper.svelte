<script lang="ts">
  import { beforeUpdate, createEventDispatcher } from 'svelte';

  import * as uuid from 'uuid';
  import { TooltipService } from '../../services';
  import { SearchIcon, AlertTriangleIcon } from '../icons';

  export { className as class };
  export let id = uuid.v4();
  export let label = '';
  export let invalidText = '';
  export let innerClass = '';
  export let hasSearch: boolean = false;

  const dispatch = createEventDispatcher();
  const SLOTS = $$props.$$slots;
  const buffer = {
    invalidText: '' + invalidText,
  };
  let className = '';
  let tooltip = TooltipService.bind('');

  beforeUpdate(() => {
    if (invalidText !== buffer.invalidText) {
      buffer.invalidText = '' + invalidText;
      tooltip = TooltipService.bind(invalidText);
    }
  });
</script>

<label for={id} class="bcmsInput {className}">
  {#if label}<span class="bcmsInput--label">{label}</span>{/if}
  {#if hasSearch}
    <div class="bcmsInput_dropdown--search">
      <SearchIcon />
      <input
        class="bcmsInput_dropdown--search-input"
        type="text"
        placeholder="Search"
        on:keyup={(event) => {
          dispatch('search', event.target.value.trim().toLowerCase());
        }} />
    </div>
  {/if}
  <span
    class="bcmsInput--inner {invalidText ? 'bcmsInput--inner_isError' : ''}
      {innerClass}">
    <slot />
    <div class="bcmsInput--actions">
      <slot name="password-eye" />
      {#if invalidText}
        <span style="display: block;" class="bcmsInput--tooltip" use:tooltip>
          <AlertTriangleIcon />
        </span>
      {/if}
    </div>
  </span>
</label>
{#if SLOTS?.enumeration}
  <slot name="enumeration" />
{/if}
