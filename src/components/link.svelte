<script lang="ts">
  import * as uuid from 'uuid';
  import { createEventDispatcher, onMount } from 'svelte';
  import { StoreService } from '../services';
  import { link } from 'svelte-routing';

  export { className as class };
  export let style: string = undefined;
  export let selected: boolean = undefined;
  export let id: string = uuid.v4();
  export let href: string;
  export let newTab: boolean = false;

  const dispatch = createEventDispatcher();
  let className = '';

  onMount(() => {
    if (selected) {
      document.getElementById(id).scrollIntoView(true);
    }
  });
</script>

{#if href.startsWith('http')}
  <a {selected} {id} {style} class={className} {href}><slot /></a>
{:else}
  <a
    {selected}
    {id}
    {style}
    class={className}
    {href}
    target={newTab ? '_blank' : undefined}
    use:link
    on:click={() => {
      StoreService.update('path', href);
      dispatch('click');
    }}><slot /></a>
{/if}
