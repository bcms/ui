<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { StoreService } from '../services';
  import { link } from 'svelte-routing';

  export { className as class };
  export let href: string;
  export let title: string = undefined;

  const dispatch = createEventDispatcher();
  let className = '';
</script>

{#if href.startsWith('http')}
  <a class={className} {href}><slot /></a>
{:else}
  <a
    class={className}
    {href}
    use:link
    {title}
    on:click={() => {
      StoreService.update('path', href);
      dispatch('click');
    }}><slot /></a>
{/if}
