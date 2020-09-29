<script context="module" lang="ts">
  function scrollerLatch() {
    const mountedElements: string[] = [];
    return {
      isMounted(id: string) {
        return mountedElements.find((e) => e === id) ? true : false;
      },
      focus(id: string) {
        const element = document.getElementById(id);
        if (element && !this.isMounted(id)) {
          mountedElements.push(id);
          element.scrollIntoView({
            block: 'center',
          });
        }
      },
    };
  }
  export const ScrollerLatch = scrollerLatch();
</script>

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
  export let syntax: boolean = false;
  export let toolbar: string[] | boolean = [
    'bold',
    'italic',
    'underline',
    'strike',
    'link',
  ];

  const dispatch = createEventDispatcher();
  const updateLatch = {
    name: '' + name,
  };
  let className = '';
  let quill: QuillType;

  onMount(() => {
    const element = document.getElementById(id);
    quill = new Quill(element, {
      theme: 'bubble',
      formats,
      modules: {
        toolbar,
        syntax,
      },
      placeholder,
    });
    quill.setContents(ops as any);
    quill.on('text-change', () => {
      dispatch('update', { ...quill.getContents(), text: quill.getText() });
    });
    ScrollerLatch.focus(name);
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

<div id={name} class="prop-quill {className}">
  <div class="prop-quill--top">
    {#if placeholder}<label for={id}>{placeholder}</label>{/if}
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
    <!-- <button><div class="fas fa-ellipsis-h" />
      <div in:fade class="overflow-menu--items overflow-menu--items-right">
      </div>
    </button> -->
  </div>
  <div {id} class="prop-quill--editor" />
</div>
