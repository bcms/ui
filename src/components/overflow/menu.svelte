<script lang="ts">
  import { onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import { EditIcon } from '../icons';

  export { className as class };
  export let position: 'left' | 'right' = 'left';

  let menuContainer: HTMLDivElement;

  let className = '';
  let show = false;

  function closeOnClickOutside({ target }) {
    if (show) {
      setTimeout(() => {
        show = false;
      }, 50);
    }
    if (menuContainer) {
      if (!menuContainer.contains(target)) {
        show = false;
        document.body.removeEventListener('click', closeOnClickOutside, true);
      }
    }
  }

  function handleClick() {
    if (!show) {
      show = true;
      document.body.addEventListener('click', closeOnClickOutside, true);
    } else {
      show = false;
      document.body.removeEventListener('click', closeOnClickOutside, true);
    }
  }

  onDestroy(() => {
    document.body.removeEventListener('click', closeOnClickOutside);
  });
</script>

<div class="overflow-menu {className}" bind:this={menuContainer}>
  <button on:click={() => handleClick()}>
    <EditIcon />
  </button>
  {#if show}
    <div in:fade class="overflow-menu--items overflow-menu--items-{position}">
      <slot />
    </div>
  {/if}
</div>
