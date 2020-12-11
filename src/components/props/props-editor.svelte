<script lang="ts" context="module">
  export const singleColItems = [
    PropType.BOOLEAN,
    PropType.DATE,
    PropType.ENUMERATION,
    PropType.NUMBER,
  ];
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Prop, PropType } from '@becomes/cms-sdk';
  import PropString from './string.svelte';
  import PropNumber from './number.svelte';
  import PropBoolean from './boolean.svelte';
  import PropDate from './date.svelte';
  import PropEnum from './enum.svelte';
  import { PropMedia } from './media';
  import PropGroupPointer from './group-pointer.svelte';
  import { PropEntryPointer } from '.';
  import { PropQuillRichText } from './quill';
  import { cy } from '../../services';

  export { className as class };
  export let props: Prop[];
  export let depth = '';

  const dispatch = createEventDispatcher();
  let className = '';
  let checkNextType = true;

  function getSingleCol(currentProp: Prop, nextProp?: Prop) {
    if (!checkNextType) {
      checkNextType = true;
      return true;
    }
    if (
      !currentProp.array &&
      singleColItems.includes(currentProp.type) &&
      nextProp &&
      !nextProp.array &&
      singleColItems.includes(nextProp.type)
    ) {
      checkNextType = false;
      return true;
    }
    return false;
  }
</script>

<div use:cy={'props'} class="entryEditor--props {className}">
  {#each props as prop, i}
    <div
      class="entryEditor--props-row {getSingleCol(prop, props[i + 1]) ? 'entryEditor--props-row_half' : ''}">
      {#if prop.type === PropType.STRING}
        <PropString
          {prop}
          on:update={(event) => {
            props[i] = event.detail;
            dispatch('update', { prop: props[i], propIndex: i });
          }} />
      {:else if prop.type === PropType.NUMBER}
        <PropNumber
          {prop}
          on:update={(event) => {
            props[i] = event.detail;
            dispatch('update', { prop: props[i], propIndex: i });
          }} />
      {:else if prop.type === PropType.BOOLEAN}
        <PropBoolean
          {prop}
          on:update={(event) => {
            props[i] = event.detail;
            dispatch('update', { prop: props[i], propIndex: i });
          }} />
      {:else if prop.type === PropType.DATE}
        <PropDate
          {prop}
          on:update={(event) => {
            props[i] = event.detail;
            dispatch('update', { prop: props[i], propIndex: i });
          }} />
      {:else if prop.type === PropType.ENUMERATION}
        <PropEnum
          {prop}
          on:update={(event) => {
            props[i] = event.detail;
            dispatch('update', { prop: props[i], propIndex: i });
          }} />
      {:else if prop.type === PropType.MEDIA}
        <PropMedia
          depth="{depth}.{i}"
          {prop}
          propIndex={i}
          on:update={(event) => {
            props[i] = event.detail;
            dispatch('update', { prop: props[i], propIndex: i });
          }} />
      {:else if prop.type === PropType.GROUP_POINTER}
        <PropGroupPointer
          {prop}
          depth="{depth}.{i}"
          on:update={(event) => {
            props[i] = event.detail;
            dispatch('update', { prop: props[i], propIndex: i });
          }} />
      {:else if prop.type === PropType.ENTRY_POINTER}
        <PropEntryPointer
          {prop}
          on:update={(event) => {
            props[i] = event.detail;
            dispatch('update', { prop: props[i], propIndex: i });
          }} />
      {:else if prop.type === PropType.RICH_TEXT}
        <PropQuillRichText
          {prop}
          on:update={(event) => {
            props[i] = event.detail;
            dispatch('update', { prop: props[i], propIndex: i });
          }} />
      {/if}
    </div>
  {/each}
</div>
