<script lang="ts">
  import type { Prop, PropQuill, } from '@becomes/cms-sdk';
  import { beforeUpdate, createEventDispatcher } from 'svelte';
  import QuillContainer from './quill.svelte';

  export let id: string = undefined;
  export let prop: Prop;

  const dispatch = createEventDispatcher();
  let value = prop.value as PropQuill;

  beforeUpdate(() => {
    value = prop.value as PropQuill;
  });
</script>

<QuillContainer
  {id}
  class="prop-quill--paragraph"
  placeholder="Paragraph"
  name={prop.name}
  ops={value.ops}
  on:update
  on:move
  on:add
  on:remove />
