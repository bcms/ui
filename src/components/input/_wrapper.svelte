<script lang="ts">
  import * as uuid from 'uuid';

  export { className as class };
  export let id = uuid.v4();
  export let label = '';
  export let invalidText = '';

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
  <span class="bcmsInput--label">{label}</span>
  <span
    class="bcmsInput--inner {invalidText ? 'bcmsInput--inner_isError' : ''}">
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
          }}
          style="margin-right: {SLOTS['password-eye'] ? 10 : 0}px">
          <i class="fas fa-exclamation-triangle" />
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
