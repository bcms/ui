<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import { StoreService } from '../../services';
  import Button from '../button.svelte';

  export let title: string;
  export let name: string;

  const dispatch = createEventDispatcher();
  let show = false;

  StoreService.create(name, show);
  const toggleUnsunscribe = StoreService.subscribe(name, async (value) => {
    show = value;
  });

  function done() {
    dispatch('done');
  }
  function cancel() {
    dispatch('cancel');
  }

  onDestroy(() => {
    toggleUnsunscribe();
  });
</script>

{#if show}
  <div transition:fade class="modal">
    <div class="modal--body">
      <div class="modal--heading">{title}</div>
      <div class="modal--content">
        <slot />
      </div>
      <div class="modal--actions">
        <Button
          kind="secondary"
          on:click={() => {
            cancel();
          }}>
          Cancel
        </Button>
        <Button
          on:click={() => {
            done();
          }}>
          Done
        </Button>
      </div>
    </div>
  </div>
{/if}
