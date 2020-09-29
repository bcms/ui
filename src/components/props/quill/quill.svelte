<script lang="ts">
  import { onMount, createEventDispatcher, beforeUpdate } from 'svelte';
  import Quill, { Quill as QuillType } from 'quill';
  import * as uuid from 'uuid';
  import type { PropQuillOption } from '@becomes/cms-sdk';
  import { OverflowMenu, OverflowMenuItem } from '../../overflow';

  export { className as class };
  export let id: string = uuid.v4();
  export let name: string = '';
  export let placeholder = '';
  export let ops: PropQuillOption[] = [];
  export let formats: string[] = undefined;
  export let toolbar: string[] | boolean = [
    'bold',
    'italic',
    'underline',
    'strike',
    'link',
  ];

  const displatch = createEventDispatcher();
  const updateLatch = {
    name: '' + name,
  };
  let className = '';
  let quill: QuillType;

  onMount(() => {
    quill = new Quill(document.getElementById(id), {
      theme: 'bubble',
      formats,
      modules: {
        toolbar,
      },
      placeholder,
    });
    quill.setContents(ops as any);
    quill.on('text-change', () => {
      displatch('change', { ...quill.getContents(), text: quill.getText() });
    });
  });
  beforeUpdate(() => {
    if (quill) {
      if (updateLatch.name !== name) {
        updateLatch.name = name;
        quill.setContents(ops as any);
      }
    }
  });
</script>

<div class="prop-quill {className}">
  <div class="prop-quill--top">
    {#if placeholder}<label for={id}>{placeholder}</label>{/if}
    <OverflowMenu class="prop-quill--top-overflow" icon="fas fa-ellipsis-h" position="right">
      <OverflowMenuItem
        text="Move up"
        on:click={() => {
          displatch('move', -1);
        }} />
      <OverflowMenuItem
        text="Move down"
        on:click={() => {
          displatch('move', 1);
        }} />
      <OverflowMenuItem
        text="Add section here"
        on:click={() => {
          displatch('add');
        }} />
      <OverflowMenuItem
        text="Remove"
        danger
        on:click={() => {
          displatch('remove');
        }} />
    </OverflowMenu>
    <!-- <button><div class="fas fa-ellipsis-h" />
      <div in:fade class="overflow-menu--items overflow-menu--items-right">
      </div>
    </button> -->
  </div>
  <div {id} class="prop-quill--editor" />
</div>
