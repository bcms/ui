<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import * as uuid from 'uuid';
  import { SearchIcon, AlertTriangleIcon } from '../icons';

  export { className as class };
  export let id = uuid.v4();
  export let label = '';
  export let invalidText = '';
  export let innerClass = '';
  export let hasSearch: boolean = false;

  const dispatch = createEventDispatcher();

  let className = '';
  let showMessage = false;

  const messageData = {
    id: uuid.v4(),
    x: 0,
    y: 0,
    maxWidth: -1,
  };
  const SLOTS = $$props.$$slots;

  function screenOverflow(
    screenWidth: number,
    position: number,
    elementWidth: number
  ) {
    const delta = position + elementWidth - screenWidth;
    return delta < 0 ? 0 : delta;
  }
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
    <span class="bcmsInput--actions">
      {#if invalidText}
        <span
          class="bcmsInput--tooltip"
          on:mouseover={(event) => {
            showMessage = true;
            messageData.y = event.clientY + 60;
            messageData.x = event.clientX - screenOverflow(window.innerWidth, event.clientX, 300) - 5;
            if (messageData.x < 0) {
              messageData.x = 0;
              messageData.maxWidth = window.innerWidth;
            } else {
              messageData.maxWidth = -1;
            }
          }}
          on:mouseout={() => {
            showMessage = false;
          }}>
          <AlertTriangleIcon />
        </span>
        {#if showMessage}
          <div
            id={messageData.id}
            class="bcmsInput--tooltip-message"
            style="bottom: {messageData.y}px;
              left: {messageData.x}px;
              min-width: {messageData.maxWidth > 0 ? messageData.maxWidth : 300}px">
            {invalidText}
          </div>
        {/if}
      {/if}
      <slot name="password-eye" />
    </span>
  </span>
</label>
{#if SLOTS?.enumeration}
  <slot name="enumeration" />
{/if}
