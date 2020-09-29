<script lang="ts">
  import type { Prop } from '@becomes/cms-sdk';
  import { beforeUpdate, createEventDispatcher, onMount } from 'svelte';
  import type { PropWidget } from '@becomes/cms-sdk';
  import * as uuid from 'uuid';
  import PropsEditor from '../props-editor.svelte';
  import { OverflowMenu, OverflowMenuItem } from '../../overflow';
  import { ScrollerLatch } from './quill.svelte';

  export { className as class };
  export let id: string = undefined;
  export let prop: Prop;

  const dispatch = createEventDispatcher();
  let value = prop.value as PropWidget;
  let className = '';

  onMount(() => {
    ScrollerLatch.focus(prop.name);
  });
  beforeUpdate(() => {
    value = prop.value as PropWidget;
  });
</script>

<div id={prop.name} class="prop-quill {className}">
  <div class="prop-quill--top">
    <label for={id}>{prop.label}</label>
    <OverflowMenu
      class="prop-quill--top-overflow"
      icon="fas fa-ellipsis-h"
      position="right">
      <OverflowMenuItem
        text="Move up"
        on:click={() => {
          dispatch('move', -1);
        }} />
      <OverflowMenuItem
        text="Move down"
        on:click={() => {
          dispatch('move', 1);
        }} />
      <OverflowMenuItem
        text="Add section here"
        on:click={() => {
          dispatch('add');
        }} />
      <OverflowMenuItem
        text="Remove"
        danger
        on:click={() => {
          dispatch('remove');
        }} />
    </OverflowMenu>
  </div>
  <div {id} class="prop-quill--widget">
    <PropsEditor
      depth="content.{prop.name}.value.props"
      props={value.props}
      on:update={(event) => {
        prop[event.detail.propIndex] = event.detail.prop;
        dispatch('update', prop);
      }} />
  </div>
</div>
