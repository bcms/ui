<script lang="ts">
  import { onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import Button from '../button.svelte';

  export { className as class };
  export let position: 'left' | 'right' = 'left';
  export let icon = 'fas fa-ellipsis-v';

  let menuContainer: HTMLDivElement;

  let className = '';
  let show = null;

  function closeOnClickOutside({ target }) {
    if (!menuContainer.contains(target)) {
      show = false;
      document.body.removeEventListener('click', closeOnClickOutside, true);
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
  <Button kind="ghost" {icon} onlyIcon={true} on:click={() => handleClick()} />
  {#if show}
    <div in:fade class="overflow-menu--items overflow-menu--items-{position}">
      <slot />
    </div>
  {/if}
</div>
