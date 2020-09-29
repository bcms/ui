<script lang="ts">
  import type { Prop, PropQuill, PropQuillOption } from '@becomes/cms-sdk';
  import { beforeUpdate } from 'svelte';
  import QuillContainer from './quill.svelte';

  export let id: string = undefined;
  export let prop: Prop;

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
  on:change
  on:move
  on:add
  on:remove />
