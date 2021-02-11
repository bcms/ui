<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { KeyboardService, StoreService } from '../../services';
  import { CloseIcon } from '../icons';
  import Button from '../button.svelte';

  export { className as class };
  export let name: string;
  export let title: string = undefined;
  export let actionName: string = undefined;
  export let beforeDone: () => boolean = undefined;

  const animationTime = 200;
  const dispatch = createEventDispatcher();
  const keyboardUnsub = KeyboardService.subscribe(
    ['Enter', 'Escape'],
    async (event) => {
      if (show) {
        switch (event.key) {
          case 'Enter':
            {
              done();
            }
            break;
          case 'Escape':
            {
              cancel();
            }
            break;
        }
      }
    }
  );
  let show = false;
  let className = '';
  let closing = false;
  let doneLatch = false;

  StoreService.create(name, show);
  const toggleUnsunscribe = StoreService.subscribe(name, async (value) => {
    if (typeof value === 'boolean') {
      if (show && !value) {
        closing = true;
        await delay(20);
        delay(animationTime).then(() => {
          closing = false;
          dispatch('animationDone');
        });
      }
      show = value;
    } else if (typeof value === 'object') {
      if (typeof value.show !== 'undefined') {
        if (show && !value.show) {
          closing = true;
          await delay(20);
          delay(animationTime).then(() => {
            closing = false;
            dispatch('animationDone');
          });
        }
        show = value.show;
      }
    }
  });

  async function delay(time: number) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }
  function cancel() {
    dispatch('cancel');
  }
  function done() {
    if (!doneLatch) {
      doneLatch = true;
      if (beforeDone) {
        if (!beforeDone()) {
          doneLatch = false;
          return;
        }
      }
      dispatch('done');
      doneLatch = false;
    }
  }
  onDestroy(() => {
    toggleUnsunscribe();
    keyboardUnsub();
  });
</script>

<div
  class="bcmsModal {className}"
  style="display: {show ? 'initial' : 'none'}; transition: all 0.4s;"
>
  <div
    class="bcmsModal--overlay"
    tabindex="0"
    role="button"
    aria-label="Close modal"
    on:keydown={(event) => {
      if (event.key === 'Enter') {
        cancel();
      }
    }}
    on:click={() => {
      cancel();
    }}
  />
  <div class="bcmsModal--inner">
    <header class="bcmsModal--header mb-50">
      {#if $$slots.header}
        <slot name="header" />
      {:else if title}
        <div class="bcmsModal--title">{title}</div>
      {/if}
      <button
        disabled={closing}
        aria-label="Close modal"
        on:click={cancel}
        class="bcmsModal--close"
      >
        <CloseIcon />
      </button>
    </header>
    <div class="bcmsModal--body customScrollbar">
      <slot />
    </div>
    <div class="bcmsModal--actions">
      {#if $$slots.actions}
        <slot name="actions" />
      {:else}
        <Button disabled={closing || doneLatch} on:click={done}>
          <span>{actionName ? actionName : 'Done'}</span>
        </Button>
        <Button disabled={closing || doneLatch} kind="ghost" on:click={cancel}>
          Cancel
        </Button>
      {/if}
    </div>
  </div>
</div>
