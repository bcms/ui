<script lang="ts">
  import { beforeUpdate } from 'svelte';
  import type { Prop, PropQuill, PropQuillOption } from '@becomes/cms-sdk';
  import QuillContainer from './quill.svelte';
  import { ListIcon } from '../../icons';

  export let id: string = undefined;
  export let prop: Prop;

  let value = prop.value as PropQuill;
  if (
    value.ops.length === 2 &&
    value.ops[0].insert === '' &&
    value.ops[1].insert === '\n'
  ) {
    value.ops = initOps();
  }

  function initOps(): PropQuillOption[] {
    return [
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
  cyTag={prop.type}
  {id}
  class="prop-quill--list"
  label={ListIcon}
  name={prop.name}
  ops={value.ops}
  toolbar={[['bold', 'italic', 'underline', 'strike', 'link'], [{ list: 'bullet' }]]}
  on:update
  on:move
  on:add
  on:remove
  on:enter />
