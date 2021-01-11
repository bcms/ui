<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Prop, PropType } from '@becomes/cms-sdk';
  import Button from '../button.svelte';
  import {
    PropQuillCodeBlock,
    PropQuillHeading,
    PropQuillList,
    PropQuillParagraph,
    PropQuillWidget,
  } from '../props';
  import { cy } from '../../services';

  export let content: Prop[] = [];

  const dispatch = createEventDispatcher();
</script>

<div use:cy={'content-props'} class="entry-content">
  {#if content.length > 0}
    <div class="entry-content--props">
      {#each content as prop, i}
        <div
          class="entry-content--prop"
          style="position: relative; z-index: {content.length - i};">
          {#if prop.type === PropType.PARAGRAPH}
            <PropQuillParagraph
              {prop}
              on:move={(event) => {
                dispatch('move', { prop, position: i, move: event.detail });
              }}
              on:add={() => {
                dispatch('new', { position: i });
              }}
              on:remove={() => {
                dispatch('remove', { prop, position: i });
              }}
              on:update={(event) => {
                dispatch('update', { position: i, ...event.detail });
              }} />
          {:else if prop.type.startsWith('HEADING')}
            <PropQuillHeading
              {prop}
              on:move={(event) => {
                dispatch('move', { prop, position: i, move: event.detail });
              }}
              on:add={() => {
                dispatch('new', { position: i });
              }}
              on:remove={() => {
                dispatch('remove', { prop, position: i });
              }}
              on:update={(event) => {
                dispatch('update', { position: i, ...event.detail });
              }} />
          {:else if prop.type === PropType.LIST}
            <PropQuillList
              {prop}
              on:move={(event) => {
                dispatch('move', { prop, position: i, move: event.detail });
              }}
              on:add={() => {
                dispatch('new', { position: i });
              }}
              on:remove={() => {
                dispatch('remove', { prop, position: i });
              }}
              on:update={(event) => {
                dispatch('update', { position: i, ...event.detail });
              }} />
          {:else if prop.type === PropType.CODE}
            <PropQuillCodeBlock
              {prop}
              on:move={(event) => {
                dispatch('move', { prop, position: i, move: event.detail });
              }}
              on:add={() => {
                dispatch('new', { position: i });
              }}
              on:remove={() => {
                dispatch('remove', { prop, position: i });
              }}
              on:update={(event) => {
                dispatch('update', { position: i, ...event.detail });
              }} />
          {:else if prop.type === PropType.WIDGET}
            <PropQuillWidget
              {prop}
              on:move={(event) => {
                dispatch('move', { prop, position: i, move: event.detail });
              }}
              on:add={() => {
                dispatch('new', { position: i });
              }}
              on:remove={() => {
                dispatch('remove', { prop, position: i });
              }}
              on:update={(event) => {
                dispatch('update', { position: i, widget: event.detail });
              }} />
          {/if}
        </div>
      {/each}
    </div>
  {/if}
  <div class="entryEditor--footer">
    <Button
      class="ml-auto mr-auto mt-20 w-auto"
      kind="alternate"
      on:click={() => {
        dispatch('new', { position: content.length });
      }}>
      Add new section
    </Button>
  </div>
</div>
