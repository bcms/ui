<script context="module" lang="ts">
  const toolbar = [
    [
      { header: 1 },
      { header: 2 },
      { header: 3 },
      { header: 4 },
      { header: 5 },
      { header: 6 },
    ],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'bullet' }],
    ['link'],
  ];
</script>

<script lang="ts">
  import type { Prop, PropQuill } from '@becomes/cms-sdk';
  import { beforeUpdate, createEventDispatcher } from 'svelte';
  import QuillContainer from './quill.svelte';

  export { className as class };
  export let id: string = undefined;
  export let prop: Prop;

  const dispatch = createEventDispatcher();
  let className = '';
  let value = prop.value as PropQuill;

  beforeUpdate(() => {
    value = prop.value as PropQuill;
  });
</script>

<QuillContainer
  {id}
  class="prop-quill--rich-text {className}"
  placeholder={prop.label}
  name={prop.name}
  ops={value.ops}
  noMenu={true}
  on:update={(event) => {
    value.ops = event.detail.ops;
    value.text = event.detail.text;
    prop.value = value;
    dispatch('update', prop);
  }}
  {toolbar}
  on:move
  on:add
  on:remove />
