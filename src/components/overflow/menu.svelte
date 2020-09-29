<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import Button from '../button.svelte';

  export { className as class };
  export let position: 'left' | 'right' = 'left';
  export let icon = 'fas fa-ellipsis-v';

  let className = '';
  let show = false;

  onMount(() => {
    document.body.addEventListener('click', () => {
      if (show === true) {
        show = false;
      }
    });
  });
</script>

<div class="overflow-menu {className}">
  <Button
    kind="ghost"
    {icon}
    onlyIcon={true}
    on:click={() => {
      if (show === false) {
        setTimeout(() => {
          show = true;
        }, 50);
      }
    }} />
  {#if show}
    <div in:fade class="overflow-menu--items overflow-menu--items-{position}">
      <slot />
    </div>
  {/if}
</div>
