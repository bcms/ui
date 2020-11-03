<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import { StoreService } from '../../services';

  export { className as class };
  export let name: string;

  const dispatch = createEventDispatcher();
  let show = false;
  let className = '';

  StoreService.create(name, show);
  const toggleUnsunscribe = StoreService.subscribe(name, async (value) => {
    if (typeof value === 'boolean') {
      show = value;
    } else if (typeof value === 'object') {
      if (typeof value.show !== 'undefined') {
        show = value.show;
      }
    }
  });

  function cancel() {
    dispatch('cancel');
  }

  onDestroy(() => {
    toggleUnsunscribe();
  });
</script>

{#if show}
  <div transition:fade class="bcmsModal {className}">
    <div class="bcmsModal">
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
        <header class="bcmsModal--header mb--50">
          <slot name="header" />
          <button
            aria-label="Close modal"
            on:click={() => {
              cancel();
            }}
            class="bcmsModal--close">
            <i class="fas fa-times" />
          </button>
        </header>
        <slot />
      </div>
    </div>
  </div>
{/if}
