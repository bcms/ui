<script context="module" lang="ts">
  let colorPointer = 0;
  export const colors = ['#d4d4d4', '#bdc0ef', '#d3efbd', '#ecefbd'];
  export const nextColor = () => {
    const color = colors[colorPointer];
    colorPointer = (colorPointer + 1) % colors.length;
    return color;
  };
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Prop, PropType } from '@becomes/cms-sdk';
  import PropString from './string.svelte';
  import PropNumber from './number.svelte';
  import PropBoolean from './boolean.svelte';
  import PropDate from './date.svelte';
  import PropEnum from './enum.svelte';
  import PropMedia from './media.svelte';
  import PropGroupPointer from './group-pointer.svelte';
  import { PropEntryPointer } from '.';
  import { PropQuillRichText } from './quill';

  export { className as class };
  export let props: Prop[];
  export let depth = '';

  const dispatch = createEventDispatcher();
  let className = '';
  const color = nextColor();
</script>

<div class="props-editor {className}" style="border-color: {color};">
  {#each props as prop, i}
    <div style="position: relative; z-index: {props.length - i}">
      {#if prop.type === PropType.STRING}
        <PropString
          class={i > 0 ? 'mt--20' : ''}
          {prop}
          on:update={(event) => {
            props[i] = event.detail;
            dispatch('update', { prop: props[i], propIndex: i });
          }} />
      {:else if prop.type === PropType.NUMBER}
        <PropNumber
          class={i > 0 ? 'mt--20' : ''}
          {prop}
          on:update={(event) => {
            props[i] = event.detail;
            dispatch('update', { prop: props[i], propIndex: i });
          }} />
      {:else if prop.type === PropType.BOOLEAN}
        <PropBoolean
          class={i > 0 ? 'mt--20' : ''}
          {prop}
          on:update={(event) => {
            props[i] = event.detail;
            dispatch('update', { prop: props[i], propIndex: i });
          }} />
      {:else if prop.type === PropType.DATE}
        <PropDate
          class={i > 0 ? 'mt--20' : ''}
          {prop}
          on:update={(event) => {
            props[i] = event.detail;
            dispatch('update', { prop: props[i], propIndex: i });
          }} />
      {:else if prop.type === PropType.ENUMERATION}
        <PropEnum
          class={i > 0 ? 'mt--20' : ''}
          {prop}
          on:update={(event) => {
            props[i] = event.detail;
            dispatch('update', { prop: props[i], propIndex: i });
          }} />
      {:else if prop.type === PropType.MEDIA}
        <PropMedia
          class={i > 0 ? 'mt--20' : ''}
          depth="{depth}.{i}"
          {prop}
          propIndex={i}
          on:update={(event) => {
            props[i] = event.detail;
            dispatch('update', { prop: props[i], propIndex: i });
          }} />
      {:else if prop.type === PropType.GROUP_POINTER}
        <PropGroupPointer
          class={i > 0 ? 'mt--20' : ''}
          {prop}
          depth="{depth}.{i}"
          on:update={(event) => {
            props[i] = event.detail;
            dispatch('update', { prop: props[i], propIndex: i });
          }} />
      {:else if prop.type === PropType.ENTRY_POINTER}
        <PropEntryPointer
          class={i > 0 ? 'mt--20' : ''}
          {prop}
          on:update={(event) => {
            props[i] = event.detail;
            dispatch('update', { prop: props[i], propIndex: i });
          }} />
      {:else if prop.type === PropType.RICH_TEXT}
        <PropQuillRichText
          class={i > 0 ? 'mt--20' : ''}
          {prop}
          on:update={(event) => {
            props[i] = event.detail;
            dispatch('update', { prop: props[i], propIndex: i });
          }} />
      {/if}
    </div>
  {/each}
</div>
