<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import { StoreService } from '../../services';
  import { CloseIcon } from '../icons';

  export { className as class };
  export let name: string;

  const animationTime = 300;
  const dispatch = createEventDispatcher();
  let show = false;
  let className = '';
  let closing = false;

  StoreService.create(name, show);
  const toggleUnsunscribe = StoreService.subscribe(name, async (value) => {
    await delay(20);
    if (typeof value === 'boolean') {
      if (show && !value) {
        closing = true;
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

  onDestroy(() => {
    toggleUnsunscribe();
  });
</script>

{#if show}
  <div
    in:fade
    out:fade={{ duration: animationTime }}
    class="bcmsModal {className}">
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
      }} />
    <div class="bcmsModal--inner">
      <header class="bcmsModal--header mb-50">
        <slot name="header" />
        <button
          disabled={closing}
          aria-label="Close modal"
          on:click={() => {
            cancel();
          }}
          class="bcmsModal--close">
          <CloseIcon />
        </button>
      </header>
      <slot />
    </div>
  </div>
{/if}
