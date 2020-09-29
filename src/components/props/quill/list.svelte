<script lang="ts">
  import type { Prop, PropQuill } from '@becomes/cms-sdk';
  import { beforeUpdate } from 'svelte';
  import QuillContainer from './quill.svelte';

  export let id: string = undefined;
  export let prop: Prop;

  let value = prop.value as PropQuill;
  if (
    value.ops.length === 2 &&
    value.ops[0].insert === '' &&
    value.ops[1].insert === '\n'
  ) {
    value.ops = [
      { insert: '' },
      {
        attributes: {
          list: 'bullet',
        },
        insert: '\n',
      },
    ];
  }

  beforeUpdate(() => {
    value = prop.value as PropQuill;
  });
</script>

<QuillContainer
  {id}
  class="prop-quill--list"
  placeholder="List"
  name={prop.name}
  ops={value.ops}
  on:change
  on:move
  on:add
  on:remove />
