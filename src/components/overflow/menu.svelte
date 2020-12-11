<script lang="ts">
  import { onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import { MoreVerticalIcon, MoreHorizontalIcon } from '../icons';
  import { cy } from '../../services';

  export { className as class };
  export let position: 'left' | 'right' = 'left';
  export let orientation: 'vertical' | 'horizontal' = 'vertical';
  export let title: string = 'Options';
  export let cyTag: string = undefined;

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

<div use:cy={cyTag} class="overflowMenu {className}" bind:this={menuContainer}>
  <button class="overflowMenu--trigger" on:click={() => handleClick()}>
    {#if orientation === 'vertical'}
      <MoreVerticalIcon />
    {:else}
      <MoreHorizontalIcon />
    {/if}
  </button>
  {#if show}
    <div
      in:fade
      use:cy={cyTag ? cyTag + '-list' : undefined}
      class="overflowMenu--items overflowMenu--items-{position}">
      <div class="overflowMenu--items-title">{title}</div>
      <slot />
    </div>
  {/if}
</div>
