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
  import { GeneralService } from '../../../services';

  export { className as class };
  export let id: string = uuid.v4();
  export let name: string = '';
  export let label: string = '';
  export let placeholder = '';
  export let ops: PropQuillOption[] = [];
  export let formats: string[] = undefined;
  export let syntax: boolean = false;
  export let toolbar: any = ['bold', 'italic', 'underline', 'strike', 'link'];
  export let noMenu = false;

  const dispatch = createEventDispatcher();
  const updateLatch = {
    name: '' + name,
  };
  let className = '';
  let quill: QuillType;
  let element: HTMLDivElement;

  onMount(() => {
    element = document.getElementById(id) as HTMLDivElement;
    quill = new Quill(element, {
      placeholder: placeholder ? placeholder : 'Click here and type...',
      theme: 'bubble',
      formats,
      modules: {
        toolbar,
        syntax,
      },
      // placeholder,
    });
    quill.setContents(ops as any);
    quill.on('text-change', () => {
      dispatch('update', {
        ...quill.getContents(),
        text: GeneralService.string
          .textBetween(element.innerHTML, '>', '</div>')
          .replace(/ rel="noopener noreferrer"/g, '')
          .replace(/ target="_blank"/g, '')
          .replace(/class="ql-indent/g, 'class="list-indent'),
      });
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
    {#if label}<label for={id}>{label}</label>{/if}
    {#if !noMenu}
      <OverflowMenu
        class="prop-quill--top-overflow"
        position="right">
        <OverflowMenuItem
          text="Move up"
          icon="arrow-up"
          on:click={() => {
            dispatch('move', -1);
          }} />
        <OverflowMenuItem
          text="Move down"
          icon="arrow-down"
          on:click={() => {
            dispatch('move', 1);
          }} />
        <OverflowMenuItem
          text="Add section above"
          icon="add-section"
          on:click={() => {
            dispatch('add');
          }} />
        <OverflowMenuItem
          text="Remove"
          icon="trash"
          on:click={() => {
            dispatch('remove');
          }} />
      </OverflowMenu>
    {/if}
  </div>
  <div {id} class="prop-quill--editor" />
</div>
