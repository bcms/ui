<script lang="ts">
  import type { Prop } from '@becomes/cms-sdk';
  import { beforeUpdate, createEventDispatcher, onMount } from 'svelte';
  import type { PropWidget } from '@becomes/cms-sdk';
  import PropsEditor from '../props-editor.svelte';
  import { ScrollerLatch } from './quill.svelte';
  import { ArrowDownIcon, ArrowUpIcon, PlusIcon, TrashIcon } from '../../icons';

  export { className as class };
  export let id: string = undefined;
  export let prop: Prop;

  const dispatch = createEventDispatcher();
  let value = prop.value as PropWidget;
  let className = '';
  let showMenu = false;

  function updateProp(propIndex: number, _prop: Prop) {
    (prop.value as PropWidget).props[propIndex] = _prop;
    dispatch('update', prop);
  }

  onMount(() => {
    ScrollerLatch.focus(prop.name);
  });
  beforeUpdate(() => {
    value = prop.value as PropWidget;
  });
</script>

<div
  class="prop-quill"
  on:mouseleave={() => {
    showMenu = false;
  }}
  on:mouseenter={() => {
    showMenu = true;
  }}>
  <div id={prop.name} class="prop-quill--widget {className}">
    <div class="entryEditor--prop-header">
      <div class="entryEditor--prop-header-inner">
        <div class="entryEditor--prop-header-details">
          <div class="entryEditor--prop-header-label">{prop.label}</div>
        </div>
      </div>
    </div>
    {#if showMenu}
      <div class="prop-quill--actions">
        <button
          on:click={() => {
            dispatch('add');
          }}>
          <PlusIcon />
        </button>
        <button
          on:click={() => {
            dispatch('move', -1);
          }}>
          <ArrowUpIcon />
        </button>
        <button
          on:click={() => {
            dispatch('move', 1);
          }}>
          <ArrowDownIcon />
        </button>
        <button
          on:click={() => {
            dispatch('remove');
          }}>
          <TrashIcon />
        </button>
      </div>
    {/if}
    <div {id} class="entryEditor--prop-body">
      <PropsEditor
        depth="content.{prop.name}.value.props"
        props={value.props}
        on:update={(event) => {
          updateProp(event.detail.propIndex, event.detail.prop);
        }} />
    </div>
  </div>
</div>
