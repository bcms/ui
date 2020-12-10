<script lang="ts">
  import * as uuid from 'uuid';
  import { createEventDispatcher, onMount } from 'svelte';
  import { link } from '../router';

  export { className as class };
  export let style: string = undefined;
  export let selected: boolean = undefined;
  export let id: string = uuid.v4();
  export let href: string;
  export let newTab: boolean = false;
  export let title: string = undefined;
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher();
  let className = '';

  onMount(() => {
    if (selected) {
      document.getElementById(id).scrollIntoView(true);
    }
  });
</script>

{#if href.startsWith('http')}
  <a {selected} {id} {style} {disabled} class={className} {href}><slot /></a>
{:else}
  <a
    {selected}
    {id}
    {style}
    {disabled}
    class={className}
    {href}
    target={newTab ? '_blank' : undefined}
    use:link
    {title}
    on:click={() => {
      dispatch('click');
    }}><slot /></a>
{/if}
